# AI Try-On Debugging Guide

## Issue: "Capture Measurements" Button Does Nothing

### Symptoms
- Click "Capture Measurements" - no response
- No error messages displayed
- Status doesn't change to "Analyzing"

### Root Causes & Solutions

#### 1. **Model Not Loaded**
**Signs:**
- Status shows "Loading AI..." for too long
- Console shows model loading errors

**Solutions:**
```javascript
// Check browser console (F12 > Console tab)
// Look for messages like:
// ✓ "TensorFlow.js ready"
// ✓ "Loading MoveNet model..."
// ✓ "MoveNet model loaded successfully"

// If you see errors, try:
1. Hard refresh the page (Ctrl+Shift+R)
2. Clear browser cache (F12 > Storage > Clear Everything)
3. Check internet connection (model downloads ~5MB first time)
4. Try in different browser
```

#### 2. **Camera Stream Not Ready**
**Signs:**
- Video preview is black
- Status shows "Detecting 0%"
- Console shows "Video stream not ready"

**Solutions:**
```javascript
// 1. Check camera permissions
- Chrome: chrome://settings/content/camera
- Firefox: about:preferences#privacy
- Safari: System Preferences > Security & Privacy > Camera

// 2. Allow camera access when prompted
// 3. Restart browser if camera was denied

// 4. Test camera in other apps:
- Video Conferencing (Teams, Zoom)
- Browser's built-in camera test
```

#### 3. **Canvas Not Initialized**
**Signs:**
- No skeleton overlay visible
- Console shows canvas errors

**Solutions:**
```javascript
// Ensure canvas has proper dimensions
// The fix adds automatic canvas sizing when video loads:
if (canvasRef.current) {
  canvasRef.current.width = videoRef.current.videoWidth;
  canvasRef.current.height = videoRef.current.videoHeight;
}
```

#### 4. **Video Metadata Not Ready**
**Signs:**
- Video plays but looks frozen
- Confidence shows 0% always

**Solutions:**
```javascript
// Make sure video element has crossOrigin set
// Already fixed in component:
<video
  ref={videoRef}
  className="w-full h-full object-cover"
  playsInline
  crossOrigin="anonymous"  // Important for canvas access
/>
```

---

## Debugging Steps

### Step 1: Open Browser Console
```
Press: F12 (Windows) or Cmd+Option+I (Mac)
Click: Console tab
```

### Step 2: Clear Logs
```
Right-click in console > Clear Console
```

### Step 3: Check Initialization
1. Go to AI Try-On page
2. Watch console for these messages:
```
✓ "Initializing TensorFlow.js..."
✓ "TensorFlow.js ready"
✓ "Loading MoveNet model..."
✓ "MoveNet model loaded successfully"
```

If any message is missing, the model failed to load.

### Step 4: Test Camera
1. Click "Start Camera"
2. Allow camera permission
3. Watch console for:
```
✓ "Camera started successfully"
```

If you see errors, camera access failed.

### Step 5: Check Video Stream
1. Look at the video preview
2. Should show your face/body
3. Verify no black screen

### Step 6: Test Pose Detection
1. Wait 2-3 seconds after camera starts
2. Check if confidence percentage increases
3. Should see skeleton overlay on your body

### Step 7: Try Capture
1. Enter height (e.g., 170)
2. Stand clearly in frame
3. Click "Capture Measurements"
4. Watch console for:
```
✓ "Starting pose estimation..."
✓ "Poses detected: 1"
✓ "Measured data: {...}"
```

---

## Common Console Errors & Fixes

### Error: "tf is not defined"
**Cause:** TensorFlow.js not imported properly
**Fix:** Already included in component - check if npm packages installed
```bash
npm install @tensorflow/tfjs
```

### Error: "poseDetection is not defined"
**Cause:** Pose detection model not imported
**Fix:** Install package
```bash
npm install @tensorflow-models/pose-detection
```

### Error: "No supported backend found"
**Cause:** WebGL not available in browser
**Fix:** 
- Use different browser
- Enable GPU acceleration
- Try latest Chrome/Firefox

### Error: "Cannot read property 'estimatePoses'"
**Cause:** Detector not initialized yet
**Fix:** 
- Wait for "Ready" status
- Don't click capture while loading
- Check console for load errors

### Error: "Video element not ready"
**Cause:** Camera stream hasn't loaded yet
**Fix:**
- Wait 2 seconds after "Start Camera"
- Check camera permissions
- Restart browser

---

## Network & Performance

### Slow Model Loading
**Signs:** "Loading AI..." takes >10 seconds

**Fixes:**
1. Check internet speed
2. Disable browser extensions
3. Close other tabs
4. Try wired connection
5. Check browser cache settings

### Lagging Video
**Signs:** Jerky skeleton overlay, low FPS

**Fixes:**
```javascript
// In aiConfig.js, increase detection interval:
DETECTION_INTERVAL_MS: 200  // Instead of 100

// Or disable real-time preview:
ENABLE_REAL_TIME_PREVIEW: false
```

### Memory Issues
**Signs:** Browser crashes or freezes

**Fixes:**
1. Close unused tabs
2. Restart browser
3. Use lighter model (SINGLEPOSE_LIGHTNING)
4. Reduce camera resolution

---

## Camera Permission Issues

### Chrome
```
1. Click lock icon next to URL
2. Find "Camera" permission
3. Change to "Allow"
4. Reload page
```

### Firefox
```
1. Type about:preferences in URL bar
2. Go to Privacy & Security
3. Find "Permissions" > "Camera"
4. Allow site
5. Reload page
```

### Safari
```
1. Safari > Preferences > Websites
2. Find Camera section
3. Set to "Allow"
4. Reload page
```

### Edge
```
1. Settings > Privacy & Security
2. Site permissions > Camera
3. Add site to "Allow" list
4. Reload page
```

---

## Testing Checklist

### Before Using
- [ ] Internet connection working
- [ ] Camera accessible and working
- [ ] Good lighting in the room
- [ ] Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### During Setup
- [ ] Height entered (50-250 cm)
- [ ] Camera started (video visible)
- [ ] Confidence shows >0%
- [ ] Skeleton overlay visible

### For Capture
- [ ] Full body visible in frame
- [ ] Standing straight
- [ ] Good lighting
- [ ] Confidence >60%
- [ ] No blur or motion

### After Capture
- [ ] Measurements displayed
- [ ] Confidence score shown
- [ ] Can edit measurements
- [ ] Can save successfully

---

## Advanced Debugging

### Enable Console Logging
The component now includes console.log statements:
```javascript
console.log("Starting pose estimation...");
console.log("Poses detected:", poses.length);
console.log("Measured data:", measuredData);
```

These help track execution flow.

### Check Network Tab
1. Open F12 > Network tab
2. Reload page
3. Look for:
   - `pose-detection.tflite` - Model download (~100KB)
   - `/api/measurements` - API calls

### Monitor Performance
1. Open F12 > Performance tab
2. Click Record
3. Use AI Try-On feature
4. Stop recording
5. Check for dropped frames or long tasks

---

## Still Not Working?

### Step-by-Step Restart
```bash
# 1. Stop frontend server (Ctrl+C)
# 2. Stop backend server (Ctrl+C)

# 3. Clear browser cache
# Press Ctrl+Shift+Delete

# 4. Clear npm cache
npm cache clean --force

# 5. Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# 6. Start backend
cd server
npm start

# 7. Start frontend in new terminal
cd client/vite-project
npm run dev

# 8. Hard refresh browser
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (Mac)
```

### Test with Minimal Example
```javascript
// Paste in browser console to test:
navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => {
    console.log("✓ Camera access works");
    stream.getTracks().forEach(t => t.stop());
  })
  .catch(err => {
    console.error("✗ Camera error:", err);
  });
```

### Check Browser Compatibility
- Open https://caniuse.com
- Search for "WebRTC getUserMedia"
- Verify your browser is supported

---

## Report an Issue

If problems persist, collect this information:

```
Browser: Chrome/Firefox/Safari/Edge
Version: [e.g., 120.0.0]
OS: Windows/Mac/Linux

Steps to reproduce:
1. ...
2. ...
3. ...

Expected behavior:
[What should happen]

Actual behavior:
[What actually happens]

Console errors:
[Copy error messages]

Screenshots:
[Attach if helpful]
```

---

## Related Resources

- [TensorFlow.js Issues](https://github.com/tensorflow/tfjs/issues)
- [Pose Detection Issues](https://github.com/tensorflow/tfjs-models/issues)
- [MDN WebRTC Guide](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)
- [Browser DevTools Guide](https://developer.chrome.com/docs/devtools/)

---

**Need help?** Check the browser console first - 90% of issues are logged there!
