# AI Try-On & Measurement Feature

## Overview
The AI Try-On feature uses advanced machine learning (TensorFlow.js with MoveNet) to automatically detect and measure body dimensions from a live camera feed. Users can capture their measurements instantly and review/modify them before saving.

## Features

### 1. **AI-Powered Measurement Capture**
- Real-time pose detection using TensorFlow.js MoveNet model
- Full-body skeleton tracking with confidence visualization
- Automatic calculation of 9+ body measurements
- Confidence scoring for measurement accuracy

### 2. **User-Friendly Workflow**
- Step-by-step guided process
- Live camera preview with pose overlay
- Visual feedback during capture
- Easy retake option if not satisfied

### 3. **Measurement Review & Editing**
- Review all AI-generated measurements
- Edit any measurement manually
- Confidence score display
- Save to user profile

### 4. **Seamless Integration**
- Accessible from header navigation
- Quick access from user profile
- Protected route (requires login)
- Responsive design

## Technologies Used

- **@tensorflow/tfjs** - Core TensorFlow.js library
- **@tensorflow-models/pose-detection** - Pose detection models
- **@mediapipe/pose** - MediaPipe Pose solution
- **React** - Frontend framework
- **Lucide React** - Icons
- **Tailwind CSS** - Styling

## How It Works

### Step 1: AI Measurement Capture
1. User enters their height in centimeters (required for scale)
2. User starts the camera
3. AI model detects body keypoints in real-time
4. User captures when pose confidence is high
5. System calculates measurements based on body proportions

### Step 2: Review & Modify
1. AI-generated measurements are displayed
2. Confidence score is shown
3. User can edit any measurement
4. User saves to their profile

## Measurements Detected

The AI system calculates the following measurements:

1. **Height** - User-provided reference
2. **Bust** - Estimated chest circumference
3. **Chest** - Shoulder width × 2.5
4. **Waist** - Hip width × 2.2
5. **Hips** - Hip width × 2.4
6. **Shoulder** - Distance between shoulder keypoints
7. **Arm Length** - Shoulder to wrist distance
8. **Neck** - Estimated from shoulder width
9. **Sleeve** - Average arm length

## Calculation Method

The AI uses body proportion ratios and detected keypoints:

```
1. Detect body keypoints (nose, shoulders, elbows, wrists, hips, knees, ankles)
2. Calculate pixel-to-cm ratio using user height
3. Measure distances between keypoints
4. Apply body proportion formulas
5. Generate measurements with confidence scores
```

## API Endpoints

### Create/Save Measurement
```
POST /api/measurements
Authorization: Bearer <token>

Body:
{
  "userId": "string",
  "height": number,
  "bust": number,
  "chest": number,
  "waist": number,
  "hips": number,
  "shoulder": number,
  "armLength": number,
  "neck": number,
  "sleeve": number,
  "isAIGenerated": boolean,
  "confidence": number
}
```

### Get User Measurements
```
GET /api/measurements
Authorization: Bearer <token>
```

## Database Schema

```javascript
measurementSchema = {
  userId: ObjectId (ref: 'user'),
  neck: Number,
  chest: Number,
  waist: Number,
  hips: Number,
  sleeve: Number,
  inseam: Number,
  height: Number,
  bust: Number,
  shoulder: Number,
  armLength: Number,
  weight: Number,
  isAIGenerated: Boolean,
  confidence: Number (0-100),
  timestamps: true
}
```

## Component Structure

```
src/
├── pages/
│   └── AITryOn.jsx                    # Main AI Try-On page
├── components/
│   └── Measurement/
│       ├── AIMeasurement.jsx          # Camera & AI capture
│       ├── MeasurementReview.jsx      # Review & edit
│       └── Measurement.jsx            # Manual input (existing)
```

## Usage Instructions

### For Users:

1. **Navigate to AI Try-On**
   - Click "AI Try-On" button in header
   - Or click the CTA in your profile page

2. **Prepare for Capture**
   - Enter your height in centimeters
   - Stand 2-3 meters from camera
   - Ensure full body is visible
   - Stand straight with arms slightly away

3. **Capture Measurements**
   - Click "Start Camera"
   - Wait for pose detection (confidence should be >60%)
   - Click "Capture Measurements"
   - Wait for AI analysis

4. **Review & Save**
   - Review all measurements
   - Edit any values if needed
   - Click "Save Measurements"

### For Developers:

#### Running the Application

**Backend:**
```bash
cd server
npm install
npm start
```

**Frontend:**
```bash
cd client/vite-project
npm install
npm run dev
```

#### Testing the AI Feature

1. Ensure camera permissions are granted
2. Good lighting improves detection accuracy
3. Wear fitted clothing for better results
4. Test with different heights and body types

## Best Practices

### For Accurate Measurements:
- Stand in good lighting
- Wear fitted clothing
- Stand straight with good posture
- Keep full body in frame
- Avoid busy backgrounds
- Wait for high confidence score (>60%)

### For Developers:
- Handle camera permission errors gracefully
- Provide clear user instructions
- Show real-time confidence scores
- Allow multiple retakes
- Validate measurements before saving

## Browser Compatibility

- Chrome 90+ ✅
- Firefox 88+ ✅
- Safari 14+ ✅
- Edge 90+ ✅

**Requirements:**
- WebGL support
- Camera access
- Modern JavaScript support

## Performance Optimization

- TensorFlow.js model is cached after first load
- Animation frames are properly cleaned up
- Camera stream stops when not in use
- Canvas rendering is optimized

## Security & Privacy

- Camera access requires user permission
- Video is processed locally (not uploaded)
- Measurements stored securely in database
- User authentication required
- HTTPS recommended for production

## Future Enhancements

- [ ] Multiple camera angle support
- [ ] 3D body scanning
- [ ] Virtual garment try-on
- [ ] Size recommendation engine
- [ ] Measurement history tracking
- [ ] Export measurements as PDF
- [ ] Integration with tailor matching

## Troubleshooting

### Camera Not Starting
- Check browser permissions
- Ensure HTTPS in production
- Try different browser

### Low Confidence Score
- Improve lighting
- Adjust distance from camera
- Remove obstructions
- Wear fitted clothing

### Inaccurate Measurements
- Verify height input
- Ensure full body visible
- Retake with better pose
- Manually adjust values

## Support

For issues or questions:
- Create an issue on GitHub
- Contact support team
- Check documentation

## License

MIT License - See LICENSE file for details

---

**SmartStitch** - AI-Powered Custom Tailoring Platform
