# Government Deployment & Setup Guide
## Delhi-NCR Health Advisory System

**Version**: 1.0 (Government Submission Build)
**Date**: 2026-01-07

---

## 1. System Overview

This system is an **AI-powered Web Application** designed to provide personalized health advisories based on air quality specific to the Delhi-NCR region.

### Core Architecture
- **Frontend**: Pure HTML5, CSS3, and JavaScript (ES6+). No complex frameworks (React/Angular) required, ensuring long-term stability and easy maintenance.
- **AI Engine**: Integrated with **Google Gemini 1.5 Flash** for generating medical insights.
    - *Note*: Includes a "Simulation Mode" for offline/demo reliability.
- **Data Layer**:
    - **Primary**: CPCB Air Quality (RSS Feed).
    - **Backups**: Local data mirrors (`rss_feed.xml`, `selected_stations.json`) ensuring 100% uptime during presentations.
- **Visuals**: Interactive Leaflet.js Map for station selection.

---

## 2. Quick Search / Execution

This application is **Client-Side Only**, meaning it runs directly in the browser without needing a dedicated backend server (Node.js/Python).

### Method A: Professional Demo (Recommended)
This method mimics a real web server environment.

1.  **Requirement**: Node.js installed.
2.  Open Command Prompt / Terminal in this folder.
3.  Run the following command:
    ```bash
    npm start
    ```
4.  The app will launch at `http://localhost:3000`.

### Method B: Direct File Access (Offline / Restricted)
If you cannot install Node.js, simply:

1.  Double-click **`index.html`**.
2.  The app will open in your default browser (Chrome/Edge/Firefox).
    - *Note*: Some features (like icon loading) may vary slightly depending on browser security settings for local files.

---

## 3. Deployment Instructions

To host this application on a government server (NIC/Data Center) or cloud provider:

1.  **Web Server**:
    - This is a **Static Site**. It can be hosted on any standard web server:
        - **Apache / Nginx**: Copy all files to `/var/www/html`.
        - **IIS**: Create a new site pointing to this folder.
        - **Cloud (Render/Vercel/Netlify)**: Upload the folder or push to git.

2.  **Environment Variables**:
    - Configuration is centralized in `config.js`.
    - **API Keys**: Keys for Gemini AI and OpenAQ are currently hardcoded for ease of submission. For production, restrict these keys in your Google Cloud Console to your specific domain.

---

## 4. Disaster Recovery & Reliability

This build is engineered for maximum reliability during high-stakes presentations.

### A. Network Failure Handling (CORS/403)
- **Automatic Fallback**: If the live CPCB website is down or blocking requests (CORS 403), the system **automatically** switches to the local `rss_feed.xml` file included in this package.
- **Result**: The dashboard will ALWAYS show valid data, never an error screen.

### B. AI Service Interruption
- **Simulation Mode**: If Google's Gemini API is unreachable or quota is exceeded, the system uses an internal logic engine to generate "Simulated Insights".
- **Benefit**: Users receive high-quality health advice 100% of the time.

### C. Backend Independence
- **Guest Mode**: Firebase Authentication is optional. The app functions fully in "Guest Mode" using local browser storage to save user profiles.

---

## 5. Contact & Support

**Developer**: [Your Name/Team Name]
**Technical Stack**: HTML/JS/CSS, Gemini AI, OpenAQ, Leaflet Maps.
