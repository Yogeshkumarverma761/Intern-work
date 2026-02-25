# Quick Start Guide - AI Try-On Feature

## Prerequisites
- Node.js 16+ installed
- Modern browser (Chrome, Firefox, Safari, Edge)
- Webcam/camera access
- MongoDB running locally or connection string

## Installation

### 1. Clone and Install Dependencies

```bash
# Navigate to project root
cd SmartStitch

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client/vite-project
npm install
```

### 2. Environment Setup

**Backend (.env file in server/):**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartstitch
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend (vite-project/):**
- No additional environment variables needed
- API base URL is configured in `src/config/aiConfig.js`

### 3. Start the Application

**Terminal 1 - Backend:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client/vite-project
npm run dev
```

The app will be available at: `http://localhost:5173`

## Using the AI Try-On Feature

### Step 1: Create Account & Login
1. Navigate to http://localhost:5173
2. Click "Sign Up" and create a user account
3. Login with your credentials

### Step 2: Access AI Try-On
**Option 1:** Click the "AI Try-On" button in the header
**Option 2:** Go to your profile and click the "Try AI Measurement" card

### Step 3: Capture Measurements
1. Enter your height in centimeters (e.g., 170)
2. Click "Start Camera"
3. Stand 2-3 meters from camera
4. Ensure full body is visible
5. Wait for confidence score to reach 60%+
6. Click "Capture Measurements"

### Step 4: Review & Save
1. Review AI-generated measurements
2. Edit any values if needed
3. Click "Save Measurements"

## Troubleshooting

### Camera Not Working
```bash
# Check browser permissions in browser settings
# For Chrome: chrome://settings/content/camera
# For Firefox: about:preferences#privacy
# For Safari: Safari > Preferences > Websites > Camera
```

### Build Errors
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Connection Issues
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
mongod

# Check backend is running on port 5000
curl http://localhost:5000
```

### CORS Issues
Update `server/app.js` to include CORS:
```javascript
import cors from 'cors';
app.use(cors());
```

## Testing Tips

### For Best Results:
- Use good lighting (natural light is best)
- Wear fitted clothing
- Stand on a plain background
- Keep arms slightly away from body
- Maintain good posture

### Test Data:
- **Test Height:** 170 cm
- **Expected Confidence:** 60-90%
- **Processing Time:** 2-5 seconds

## Development Commands

```bash
# Frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code

# Backend
npm start            # Start server
npm run dev          # Start with nodemon (hot reload)
```

## File Structure

```
SmartStitch/
├── client/vite-project/
│   ├── src/
│   │   ├── pages/
│   │   │   └── AITryOn.jsx              # Main AI Try-On page
│   │   ├── components/
│   │   │   └── Measurement/
│   │   │       ├── AIMeasurement.jsx    # Camera & AI capture
│   │   │       └── MeasurementReview.jsx # Review & edit
│   │   ├── config/
│   │   │   └── aiConfig.js              # AI configuration
│   │   └── utils/
│   │       └── aiMeasurementUtils.js    # Helper functions
│   └── package.json
├── server/
│   ├── models/
│   │   └── measurement.model.js         # Updated schema
│   ├── controllers/
│   │   └── measurement.controller.js    # Updated controller
│   └── routes/
│       └── measurement.route.js         # API routes
└── AI_TRYON_README.md                   # Full documentation
```

## API Testing

### Using cURL:

**Create Measurement:**
```bash
curl -X POST http://localhost:5000/api/measurements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "height": 170,
    "chest": 95,
    "waist": 75,
    "hips": 90,
    "shoulder": 45,
    "armLength": 60,
    "neck": 36,
    "bust": 92,
    "sleeve": 60,
    "isAIGenerated": true,
    "confidence": 85
  }'
```

**Get Measurements:**
```bash
curl http://localhost:5000/api/measurements \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Performance Optimization

### If AI model loads slowly:
1. Check internet connection (first load downloads model)
2. Model is cached after first load
3. Use SINGLEPOSE_LIGHTNING for faster inference

### If camera is laggy:
1. Reduce camera resolution in `aiConfig.js`
2. Increase DETECTION_INTERVAL_MS
3. Disable ENABLE_REAL_TIME_PREVIEW

## Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full  |
| Firefox | 88+     | ✅ Full  |
| Safari  | 14+     | ✅ Full  |
| Edge    | 90+     | ✅ Full  |

## Known Issues

1. **Safari on iOS:** May require HTTPS for camera access
2. **Firefox:** First load may be slower for model download
3. **Mobile:** Works best on tablets; phones may have smaller viewing area

## Production Deployment

### Frontend:
```bash
cd client/vite-project
npm run build
# Deploy dist/ folder to hosting service
```

### Backend:
```bash
# Update API URLs in aiConfig.js
# Set up MongoDB Atlas or managed database
# Deploy to cloud service (Heroku, AWS, DigitalOcean)
```

### Environment Variables for Production:
```env
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_secret_key
FRONTEND_URL=https://yourdomain.com
```

## Support & Resources

- **TensorFlow.js Docs:** https://www.tensorflow.org/js
- **Pose Detection Guide:** https://github.com/tensorflow/tfjs-models/tree/master/pose-detection
- **React Documentation:** https://react.dev

## Next Steps

1. ✅ Feature is installed and ready to use
2. 🔄 Test with different users and body types
3. 📊 Monitor confidence scores and accuracy
4. 🎨 Customize UI to match your brand
5. 🚀 Deploy to production

---

**Happy Coding! 🎉**

For detailed documentation, see [AI_TRYON_README.md](./AI_TRYON_README.md)
