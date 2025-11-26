# Quick Start Guide

## Get Started in 3 Steps

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Test the Timer

- Click **Start** to begin a 25-minute work session
- The timer will count down with a visual progress ring
- When the session completes, you'll get a browser notification
- The timer automatically switches to a break session
- After 4 work sessions, you'll get a 15-minute long break

## Features Available Now

✅ 25-minute work sessions  
✅ 5-minute short breaks  
✅ 15-minute long breaks (after 4 sessions)  
✅ Start/Pause/Reset controls  
✅ Skip session option  
✅ Browser notifications  
✅ Progress visualization  
✅ Completed Pomodoros counter  

## Next Steps

1. **Set up Firebase** (optional, for future features):
   - Create a Firebase project
   - Enable Firestore
   - Add your config to `.env` file

2. **Deploy to Cloud Run**:
   - See `DEPLOYMENT.md` for detailed instructions
   - Or use: `gcloud builds submit --config cloudbuild.yaml`

3. **Add Beeminder Integration** (coming soon):
   - Connect your Beeminder account
   - Automatically log completed sessions

## Project Structure

```
pomodoro/
├── src/
│   ├── components/
│   │   └── Timer.jsx       # Main timer logic
│   ├── config/
│   │   └── firebase.js     # Firebase setup
│   └── App.jsx             # Root component
├── server/
│   └── server.js           # Express server
└── Dockerfile              # Cloud Run deployment
```

## Troubleshooting

**Port already in use?**
- Change the port in `vite.config.js` or kill the process using port 3000

**Dependencies won't install?**
- Make sure you have Node.js 18+ installed
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**Timer not working?**
- Check browser console for errors
- Make sure JavaScript is enabled
- Try a hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

