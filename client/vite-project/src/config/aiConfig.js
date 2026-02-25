/**
 * AI Try-On Configuration
 * Central configuration for AI measurement feature
 */

export const AI_CONFIG = {
  // TensorFlow.js Model Configuration
  MODEL: {
    TYPE: "MoveNet",
    VARIANT: "SINGLEPOSE_THUNDER", // Options: SINGLEPOSE_LIGHTNING, SINGLEPOSE_THUNDER
    MIN_POSE_CONFIDENCE: 0.3,
    MIN_KEYPOINT_CONFIDENCE: 0.3,
  },

  // Camera Settings
  CAMERA: {
    WIDTH: 640,
    HEIGHT: 480,
    FACING_MODE: "user", // 'user' for front camera, 'environment' for back
    FRAME_RATE: 30,
  },

  // Measurement Settings
  MEASUREMENTS: {
    MIN_HEIGHT_CM: 50,
    MAX_HEIGHT_CM: 250,
    DECIMAL_PLACES: 0,
    CONFIDENCE_THRESHOLD: 0.5,
  },

  // UI Settings
  UI: {
    CANVAS_STROKE_WIDTH: 2,
    KEYPOINT_RADIUS: 5,
    HIGH_CONFIDENCE_COLOR: "#10b981",
    MEDIUM_CONFIDENCE_COLOR: "#f59e0b",
    LOW_CONFIDENCE_COLOR: "#ef4444",
    SKELETON_COLOR: "#3b82f6",
  },

  // API Endpoints
  API: {
    BASE_URL: "http://localhost:5000",
    SAVE_MEASUREMENTS: "/api/measurements",
    GET_MEASUREMENTS: "/api/measurements",
    UPDATE_MEASUREMENT: "/api/measurements/:id",
  },

  // Error Messages
  ERRORS: {
    CAMERA_ACCESS: "Failed to access camera. Please check permissions.",
    MODEL_LOAD: "Failed to load AI model. Please refresh the page.",
    NO_PERSON_DETECTED: "No person detected. Please ensure you're fully visible.",
    LOW_CONFIDENCE: "Pose confidence too low. Please adjust lighting and position.",
    MISSING_HEIGHT: "Please enter your height in centimeters.",
    INVALID_HEIGHT: "Height must be between 50 and 250 cm.",
    SAVE_FAILED: "Failed to save measurements. Please try again.",
  },

  // Success Messages
  SUCCESS: {
    MEASUREMENTS_CAPTURED: "Measurements captured successfully!",
    MEASUREMENTS_SAVED: "Measurements saved to your profile.",
    MODEL_LOADED: "AI model loaded successfully.",
  },

  // Instructions
  INSTRUCTIONS: [
    "Enter your height in centimeters",
    "Stand 2-3 meters away from the camera",
    "Ensure your full body is visible in the frame",
    "Stand straight with arms slightly away from your body",
    "Click 'Start Camera' and then 'Capture Measurements'",
  ],

  // Performance Settings
  PERFORMANCE: {
    ENABLE_GPU_ACCELERATION: true,
    MAX_FRAMES_TO_PROCESS: 60,
    DETECTION_INTERVAL_MS: 100,
  },

  // Feature Flags
  FEATURES: {
    ENABLE_REAL_TIME_PREVIEW: true,
    ENABLE_SKELETON_OVERLAY: true,
    ENABLE_CONFIDENCE_DISPLAY: true,
    ENABLE_MEASUREMENT_HISTORY: false,
    ENABLE_EXPORT_PDF: false,
  },
};

/**
 * Get API endpoint URL
 * @param {string} endpoint - Endpoint key from AI_CONFIG.API
 * @param {Object} params - URL parameters to replace
 * @returns {string} Full URL
 */
export const getApiUrl = (endpoint, params = {}) => {
  let url = AI_CONFIG.API.BASE_URL + AI_CONFIG.API[endpoint];
  
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`:${key}`, value);
  });
  
  return url;
};

/**
 * Get error message
 * @param {string} errorKey - Error key from AI_CONFIG.ERRORS
 * @returns {string} Error message
 */
export const getErrorMessage = (errorKey) => {
  return AI_CONFIG.ERRORS[errorKey] || "An unknown error occurred.";
};

/**
 * Get success message
 * @param {string} successKey - Success key from AI_CONFIG.SUCCESS
 * @returns {string} Success message
 */
export const getSuccessMessage = (successKey) => {
  return AI_CONFIG.SUCCESS[successKey] || "Operation completed successfully.";
};

/**
 * Validate height input
 * @param {number} height - Height in centimeters
 * @returns {Object} Validation result
 */
export const validateHeight = (height) => {
  const { MIN_HEIGHT_CM, MAX_HEIGHT_CM } = AI_CONFIG.MEASUREMENTS;
  
  if (!height || isNaN(height)) {
    return {
      isValid: false,
      message: getErrorMessage("MISSING_HEIGHT"),
    };
  }
  
  if (height < MIN_HEIGHT_CM || height > MAX_HEIGHT_CM) {
    return {
      isValid: false,
      message: getErrorMessage("INVALID_HEIGHT"),
    };
  }
  
  return {
    isValid: true,
    message: "Height is valid.",
  };
};

/**
 * Check if feature is enabled
 * @param {string} featureKey - Feature key from AI_CONFIG.FEATURES
 * @returns {boolean} Whether feature is enabled
 */
export const isFeatureEnabled = (featureKey) => {
  return AI_CONFIG.FEATURES[featureKey] || false;
};

export default AI_CONFIG;
