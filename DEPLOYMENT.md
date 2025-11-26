# Deployment Guide

## Prerequisites

1. Google Cloud Platform account
2. `gcloud` CLI installed and configured
3. Docker installed (for local testing)
4. Node.js 18+ installed

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Firestore Database
4. Get your Firebase config from Project Settings > General > Your apps
5. Create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Test Locally

```bash
# Development mode
npm run dev

# Production build test
npm run build
npm run server
```

### 4. Deploy to Google Cloud Run

#### Option A: Using Cloud Build (Recommended)

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id

# Submit build
gcloud builds submit --config cloudbuild.yaml
```

#### Option B: Manual Deployment

```bash
# Set your project ID
export PROJECT_ID=your-gcp-project-id

# Build and push Docker image
gcloud builds submit --tag gcr.io/$PROJECT_ID/pomodoro-timer

# Deploy to Cloud Run
gcloud run deploy pomodoro-timer \
  --image gcr.io/$PROJECT_ID/pomodoro-timer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --cpu 1
```

### 5. Set Environment Variables (if needed)

```bash
gcloud run services update pomodoro-timer \
  --update-env-vars KEY=VALUE \
  --region us-central1
```

### 6. Access Your App

After deployment, Cloud Run will provide a URL like:
```
https://pomodoro-timer-xyz-uc.a.run.app
```

## Alternative: Deploy Frontend to Firebase Hosting

If you prefer to separate frontend and backend:

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login and initialize:
```bash
firebase login
firebase init hosting
```

3. Build and deploy:
```bash
npm run build
firebase deploy --only hosting
```

## Troubleshooting

### Build fails
- Check that all dependencies are in `package.json`
- Verify Node.js version matches `.nvmrc`

### Container won't start
- Check logs: `gcloud run services logs read pomodoro-timer`
- Verify PORT environment variable is set (Cloud Run sets this automatically)

### Firebase connection issues
- Verify environment variables are set correctly
- Check Firebase project settings
- Ensure Firestore is enabled in Firebase Console

