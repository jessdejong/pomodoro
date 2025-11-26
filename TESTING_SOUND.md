# Testing Notification Sound

## Quick Test Methods

### Method 1: Test Button in Settings (Easiest)

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open the app in your browser (usually `http://localhost:3000`)

3. Click the **⚙️ Settings** button (top-right corner)

4. Scroll down to the "Enable Notification Sound" option

5. Make sure the checkbox is checked

6. Click the **🔊 Test Sound** button

   You should hear a pleasant two-tone chime sound!

### Method 2: Complete a Timer Session

1. Start the timer (click **▶ Start**)

2. **For quick testing**, you can:
   - Go to Settings
   - Change "Work Duration" to **1 minute** (or even less)
   - Save settings
   - Start the timer
   - Wait for it to complete

3. When the timer reaches 00:00, you should hear:
   - A notification sound (two-tone chime)
   - A browser notification (if you granted permission)

### Method 3: Use Browser Console (Developer Testing)

1. Open browser DevTools (F12 or Cmd+Option+I)

2. Go to the Console tab

3. Type:
   ```javascript
   // Import the sound function (if using module system)
   // Or test directly if you have access to the function
   ```

4. Alternatively, you can test by temporarily modifying the timer duration:
   - Open Settings
   - Set Work Duration to **1 minute**
   - Save and start timer
   - Wait 1 minute for completion

## Troubleshooting

### No Sound Plays

**Check 1: Sound is Enabled**
- Go to Settings
- Make sure "Enable Notification Sound" checkbox is checked

**Check 2: Browser Audio Context**
- Some browsers require user interaction before playing audio
- Make sure you've clicked somewhere on the page first
- Try clicking the "Test Sound" button in Settings

**Check 3: Browser Console**
- Open DevTools (F12)
- Check the Console for any errors
- Look for messages like "Error playing notification sound"

**Check 4: Browser Permissions**
- Some browsers block autoplay audio
- Make sure your browser allows audio from the site
- Check browser settings for autoplay permissions

**Check 5: System Volume**
- Make sure your computer/device volume is not muted
- Check that browser tab volume is not muted (some browsers show a speaker icon)

### Sound Plays But Too Quiet/Loud

The sound uses Web Audio API with a volume of 30% (0.3 gain). If you need to adjust:
- You can modify the volume in `src/utils/sound.js`
- Look for `gainNode.gain.linearRampToValueAtTime(0.3, ...)`
- Change `0.3` to a value between 0.0 and 1.0

### Sound Doesn't Work in Some Browsers

**Chrome/Edge**: Should work perfectly
**Firefox**: Should work perfectly  
**Safari**: May require user interaction first
**Mobile Browsers**: May have restrictions on autoplay

## Technical Details

The notification sound uses the **Web Audio API** to generate a two-tone chime:
- First tone: C5 note (523.25 Hz) for 150ms
- Second tone: E5 note (659.25 Hz) for 200ms
- Uses sine wave for a pleasant, smooth sound
- Volume fades in and out smoothly

No external audio files are needed - the sound is generated programmatically!

## Testing Checklist

- [ ] Test Sound button works in Settings
- [ ] Sound plays when timer completes (work session)
- [ ] Sound plays when break completes
- [ ] Sound can be disabled via Settings checkbox
- [ ] Sound setting persists after page refresh
- [ ] No console errors when sound plays
- [ ] Sound works in your preferred browser

## Quick Test Script

For the fastest test:
1. Set Work Duration to **1 minute** in Settings
2. Start timer
3. Wait 60 seconds
4. Verify sound plays at completion

Or use the Test Sound button for instant feedback!

