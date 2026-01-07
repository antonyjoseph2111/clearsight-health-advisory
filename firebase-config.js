// Firebase Configuration and Service (Real Implementation)

// Initialize Firebase
const initFirebase = () => {
    // Check if Firebase is available (loaded from index.html)
    if (typeof firebase === 'undefined') {
        console.error("Firebase SDK not loaded! Check index.html scripts.");
        return new LocalFallbackService(); // Fallback if script fails to load
    }

    try {
        const firebaseConfig = CONFIG.FIREBASE_CONFIG;
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        const app = firebase.app();

        // Initialize Analytics if supported
        try {
            if (firebase.analytics) {
                firebase.analytics();
            }
        } catch (e) {
            console.warn("Firebase Analytics could not be initialized:", e);
        }

        console.log("Firebase initialized successfully");
        return new FirebaseService(app);
    } catch (error) {
        console.error("Firebase initialization failed:", error);
        return new LocalFallbackService();
    }
};

class FirebaseService {
    constructor(app) {
        this.app = app;
        this.db = firebase.firestore();
        this.auth = firebase.auth();
        this.collectionName = 'users'; // Collection for storing profiles
        this.fallbackService = new LocalFallbackService();
        this.isGuestMode = false;
    }

    // Save user profile
    async saveUserProfile(userId, profile) {
        if (this.isGuestMode) {
            return this.fallbackService.saveUserProfile(userId, profile);
        }

        try {
            await this.db.collection(this.collectionName).doc(userId).set({
                ...profile,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

            console.log("Profile saved to Firebase");
            return { success: true };
        } catch (error) {
            console.error("Error saving profile to Firebase:", error);
            throw error;
        }
    }

    // Get user profile
    async getUserProfile(userId) {
        if (this.isGuestMode) {
            return this.fallbackService.getUserProfile(userId);
        }

        try {
            const doc = await this.db.collection(this.collectionName).doc(userId).get();
            if (doc.exists) {
                return doc.data();
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error fetching profile from Firebase:", error);
            throw error;
        }
    }

    // Login (Anonymous)
    async loginAnonymous() {
        try {
            const userCredential = await this.auth.signInAnonymously();
            return {
                uid: userCredential.user.uid,
                isAnonymous: userCredential.user.isAnonymous
            };
        } catch (error) {
            // Check for expected configuration errors and handle silently
            const isConfigError = error.code === 'auth/configuration-not-found' ||
                error.code === 'auth/operation-not-allowed' ||
                error.code === 'auth/admin-restricted-operation' ||
                error.code === 'auth/project-not-found';

            if (isConfigError) {
                console.warn("Firebase Auth not fully configured. Using Guest Mode.");
            } else {
                // Only log unexpected errors
                console.warn("Auth negotiation failed, switching to Guest Mode:", error.code);
            }

            // Common Fallback Strategy
            this.isGuestMode = true;
            return {
                uid: 'guest_' + (localStorage.getItem('device_uid') || Date.now()),
                isAnonymous: true,
                isGuest: true
            };
        }
    }
}

// Fallback service in case of config errors or missing Internet
class LocalFallbackService {
    constructor() {
        console.warn("⚠️ Using Local Fallback Service (Mock Mode)");
        this.storageKey = 'offline_user_profiles';
    }

    async saveUserProfile(userId, profile) {
        try {
            const profiles = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            profiles[userId] = { ...profile, updatedAt: new Date().toISOString() };
            localStorage.setItem(this.storageKey, JSON.stringify(profiles));
            console.log("Profile saved to local storage");
            return { success: true };
        } catch (e) {
            console.error("Local save failed", e);
            throw e;
        }
    }

    async getUserProfile(userId) {
        try {
            const profiles = JSON.parse(localStorage.getItem(this.storageKey) || '{}');
            return profiles[userId] || null;
        } catch (e) {
            return null;
        }
    }

    async loginAnonymous() {
        // Create a critical persistent ID for local storage
        let uid = localStorage.getItem('device_uid');
        if (!uid) {
            uid = 'local_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('device_uid', uid);
        }
        return { uid: uid, isAnonymous: true };
    }
}

// Export singleton
const firebaseService = initFirebase();
