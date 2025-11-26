# Firebase Google Authentication Setup Guide

This guide will help you set up Google authentication for your Pomodoro Timer app.

## Prerequisites

1. A Firebase project (create one at [Firebase Console](https://console.firebase.google.com/))
2. Your Firebase configuration values

## Step-by-Step Setup

### 1. Enable Google Authentication in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Authentication** in the left sidebar
4. Click **Get Started** (if you haven't enabled Authentication yet)
5. Click on the **Sign-in method** tab
6. Click on **Google** from the list of providers
7. Toggle **Enable** to ON
8. Enter a **Project support email** (your email address)
9. Click **Save**

### 2. Configure OAuth Consent Screen (if needed)

If you haven't set up OAuth consent screen before:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your Firebase project
3. Navigate to **APIs & Services** > **OAuth consent screen**
4. Choose **External** (unless you have a Google Workspace)
5. Fill in the required information:
   - App name: "Pomodoro Timer"
   - User support email: Your email
   - Developer contact: Your email
6. Click **Save and Continue**
7. Add scopes (if needed):
   - Click **Add or Remove Scopes**
   - Add `email`, `profile`, `openid` (usually already added)
   - Click **Update** then **Save and Continue**
8. Add test users (optional for development):
   - Add your email address
   - Click **Save and Continue**
9. Review and go back to dashboard

### 3. Add Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings** > **Authorized domains**
2. Add your domains:
   - `localhost` (for development)
   - Your production domain (e.g., `your-app.web.app` or your Cloud Run domain)
3. Firebase automatically adds:
   - `your-project.firebaseapp.com`
   - `your-project.web.app`

### 4. Get Your Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps** section
3. If you don't have a web app, click **Add app** > **Web** (</> icon)
4. Register your app with a nickname (e.g., "Pomodoro Timer Web")
5. Copy the configuration values

### 5. Set Environment Variables

Create a `.env` file in your project root (if you don't have one):

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the values with your actual Firebase configuration.

### 6. Test Authentication Locally

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser
3. Click **Sign in with Google** button (top-right corner)
4. You should see a Google sign-in popup
5. Select your Google account
6. Grant permissions if prompted
7. You should now be signed in!

## Troubleshooting

### "Error: Firebase: Error (auth/popup-closed-by-user)"
- User closed the popup window
- This is normal behavior, not an error

### "Error: Firebase: Error (auth/unauthorized-domain)"
- Your domain is not authorized
- Add your domain in Firebase Console > Authentication > Settings > Authorized domains

### "Error: Firebase: Error (auth/operation-not-allowed)"
- Google sign-in method is not enabled
- Enable it in Firebase Console > Authentication > Sign-in method > Google

### Popup Blocked
- Browser may be blocking popups
- Allow popups for your domain
- Try using redirect method instead (requires code change)

### OAuth Consent Screen Issues
- Make sure OAuth consent screen is configured
- Add your email as a test user if app is in testing mode
- Publish your app if you want public access

## Security Notes

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **API keys are safe** - Firebase API keys are safe to expose in client-side code
3. **Use Firebase Security Rules** - Set up Firestore security rules to protect user data
4. **HTTPS in production** - Always use HTTPS in production (Firebase requires it)

## Next Steps

After authentication is set up, you can:

1. Store user-specific settings in Firestore
2. Track user's Pomodoro sessions
3. Sync data across devices
4. Add Beeminder integration per user

## Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Sign-In Setup](https://firebase.google.com/docs/auth/web/google-signin)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)

