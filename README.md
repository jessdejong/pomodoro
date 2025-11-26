# Pomodoro Timer

A beautiful Pomodoro timer application with Beeminder integration, built with React and deployed on Google Cloud Run.

## Features

- ⏱️ 25-minute work sessions with 5-minute breaks (customizable)
- 🔔 Browser notifications when sessions complete
- 🔊 Notification sound alerts (customizable, can be disabled)
- 📊 Track completed Pomodoros
- ⚙️ Customizable timer durations and settings
- 🔐 Google authentication (sign in with Google account)
- 🎨 Beautiful, modern UI with progress visualization
- 💾 Settings persist in localStorage
- ☁️ Ready for Cloud Run deployment

## Tech Stack

- **Frontend**: React 18 with Vite
- **Backend**: Express.js
- **Hosting**: Google Cloud Run
- **Database**: Firebase Firestore (to be integrated)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Set Up Google Authentication

1. Follow the guide in [FIREBASE_AUTH_SETUP.md](./FIREBASE_AUTH_SETUP.md)
2. Enable Google sign-in in Firebase Console
3. Add your Firebase config to `.env` file
4. Restart the dev server

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with the production build.

### Run Production Server Locally

```bash
npm run server
```

Server runs on `http://localhost:8080`

## Deployment

### Deploy to Google Cloud Run

1. Build and push the Docker image:
```bash
gcloud builds submit --tag gcr.io/YOUR-PROJECT-ID/pomodoro-timer
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy pomodoro-timer \
  --image gcr.io/YOUR-PROJECT-ID/pomodoro-timer \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --port 8080
```

### Deploy Frontend to Firebase Hosting (Alternative)

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

## Project Structure

```
pomodoro/
├── src/
│   ├── components/
│   │   └── Timer.jsx       # Main timer component
│   ├── App.jsx             # Root component
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── server/
│   └── server.js           # Express server
├── Dockerfile              # Container configuration
├── vite.config.js          # Vite configuration
└── package.json
```

## Future Enhancements

- [ ] Beeminder API integration
- [x] User authentication (Google)
- [ ] Session history tracking (per user)
- [ ] Statistics and analytics (per user)
- [x] Customizable timer durations
- [x] Sound alerts
- [ ] Dark mode
- [ ] Sync settings across devices

## License

MIT

