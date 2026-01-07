# Delhi-NCR Health Advisory System

An AI-powered health advisory system enabling users to get personalized health recommendations based on real-time air quality data in Delhi-NCR.

## Features

- **Real-time AQI Data**: Fetches pollution data (PM2.5, PM10, NO2, etc.) from OpenAQ.
- **Personalized Health Logic**: Assessment engine checks user conditions (Asthma, COPD, etc.) against specific pollutants.
- **Gemini AI Integration**: Uses Google's Gemini Pro model to generate nuanced, medically-aware insights.
- **Interactive Dashboard**: Modern, responsive UI with glassmorphism design.
- **Offline Capable**: Caches data and user profile locally.

## Setup & Running

1. **Prerequisites**:
   - A modern web browser (Chrome, Edge, Firefox).
   - Internet connection.

2. **Installation**:
   - No installation required. This is a client-side application.
   - Simply open `index.html` in your web browser.

3. **Usage**:
   - **Step 1**: Allow location access or enter coordinates manually.
   - **Step 2**: Fill out the health profile form.
   - **Step 3**: View your personalized dashboard with risk levels and recommendations.

## Configuration

- **API Keys**: preset in `config.js`
- **Firebase**: Currently set to Mock Mode (Local Storage) for immediate use without backend setup. 
  - To enable real Firebase: Update `firebase-config.js` with your project credentials.

## Troubleshooting

### 1. Firebase Authentication Error
If you see `auth/configuration-not-found`, you must enable **Anonymous Authentication**:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`clear-sight0`)
3. Go to **Authentication** > **Sign-in method**
4. Enable **Anonymous** provider

### 2. Gemini API Error 404
If AI insights fail:
1. Ensure your API Key in `config.js` is valid and has access to `gemini-1.5-flash`.
2. Get a key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### 3. Data Not Loading (CORS)
### 3. Data Not Loading (CORS / Proxy Errors)
If you see `Access to fetch... blocked by CORS` or `403` on the live site:
- **Solution**: This app includes a fallback to `rss_feed.xml`. Ensure this file is present in your deployment.
- The app tries 3 methods:
  1. `selected_stations.json` (Static curated list)
  2. Live CPCB RSS via Proxies (`corsproxy.io`, `allorigins.win`)
  3. **Fallback**: Local `rss_feed.xml` (Ensure this file is in your root folder!)

### 4. Deployment on Render/Vercel
- **Authorized Domains**: If using Firebase, go to Firebase Console -> Authentication -> Settings -> Authorized Domains and add your Render domain (e.g., `clearsight-health-advisory.onrender.com`).
- **Mixed Content**: The app uses HTTPS. Ensure all API calls (config.js) use `https://`.

## Technologies

- HTML5 / CSS3 (Grid, Flexbox, Variables)
- Vanilla JavaScript (ES6+)
- OpenAQ API
- Google Gemini API

## Disclaimer

This system provides general informational advice only. It is not a medical device. Always consult a doctor for serious health concerns.
