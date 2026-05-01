/**
 * AI Measurement Utilities
 * Helper functions for body measurement calculations and pose detection
 */

/**
 * Calculate Euclidean distance between two points
 * @param {Object} point1 - First point with x, y coordinates
 * @param {Object} point2 - Second point with x, y coordinates
 * @returns {number} Distance in pixels
 */
export const calculateDistance = (point1, point2) => {
  const dx = point2.x - point1.x;
  const dy = point2.y - point1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Calculate midpoint between two points
 * @param {Object} point1 - First point with x, y coordinates
 * @param {Object} point2 - Second point with x, y coordinates
 * @returns {Object} Midpoint with x, y coordinates
 */
export const calculateMidpoint = (point1, point2) => {
  return {
    x: (point1.x + point2.x) / 2,
    y: (point1.y + point2.y) / 2,
  };
};

/**
 * Body proportion ratios for estimation
 * Based on average human body proportions
 */
export const BODY_PROPORTIONS = {
  CHEST_TO_SHOULDER_RATIO: 2.5,
  WAIST_TO_HIP_RATIO: 2.2,
  HIP_CIRCUMFERENCE_RATIO: 2.4,
  BUST_TO_CHEST_RATIO: 0.95,
  NECK_TO_SHOULDER_RATIO: 0.6,
};

/**
 * Minimum confidence thresholds for different use cases
 */
export const CONFIDENCE_THRESHOLDS = {
  MINIMUM: 0.3,  // Minimum for any detection
  GOOD: 0.5,     // Good for general use
  EXCELLENT: 0.7, // Excellent quality
};

/**
 * Body keypoint names used by MoveNet model
 */
export const KEYPOINT_NAMES = {
  NOSE: "nose",
  LEFT_EYE: "left_eye",
  RIGHT_EYE: "right_eye",
  LEFT_EAR: "left_ear",
  RIGHT_EAR: "right_ear",
  LEFT_SHOULDER: "left_shoulder",
  RIGHT_SHOULDER: "right_shoulder",
  LEFT_ELBOW: "left_elbow",
  RIGHT_ELBOW: "right_elbow",
  LEFT_WRIST: "left_wrist",
  RIGHT_WRIST: "right_wrist",
  LEFT_HIP: "left_hip",
  RIGHT_HIP: "right_hip",
  LEFT_KNEE: "left_knee",
  RIGHT_KNEE: "right_knee",
  LEFT_ANKLE: "left_ankle",
  RIGHT_ANKLE: "right_ankle",
};

/**
 * Skeleton connections for drawing pose
 */
export const SKELETON_CONNECTIONS = [
  ["left_shoulder", "right_shoulder"],
  ["left_shoulder", "left_elbow"],
  ["left_elbow", "left_wrist"],
  ["right_shoulder", "right_elbow"],
  ["right_elbow", "right_wrist"],
  ["left_shoulder", "left_hip"],
  ["right_shoulder", "right_hip"],
  ["left_hip", "right_hip"],
  ["left_hip", "left_knee"],
  ["left_knee", "left_ankle"],
  ["right_hip", "right_knee"],
  ["right_knee", "right_ankle"],
];

/**
 * Extract specific keypoints from pose detection result
 * @param {Array} keypoints - All detected keypoints
 * @returns {Object} Object containing relevant keypoints
 */
export const extractKeypoints = (keypoints) => {
  return {
    nose: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.NOSE),
    leftShoulder: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.LEFT_SHOULDER),
    rightShoulder: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.RIGHT_SHOULDER),
    leftElbow: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.LEFT_ELBOW),
    rightElbow: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.RIGHT_ELBOW),
    leftWrist: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.LEFT_WRIST),
    rightWrist: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.RIGHT_WRIST),
    leftHip: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.LEFT_HIP),
    rightHip: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.RIGHT_HIP),
    leftKnee: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.LEFT_KNEE),
    rightKnee: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.RIGHT_KNEE),
    leftAnkle: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.LEFT_ANKLE),
    rightAnkle: keypoints.find((kp) => kp.name === KEYPOINT_NAMES.RIGHT_ANKLE),
  };
};

/**
 * Calculate average confidence score from keypoints
 * @param {Array} keypoints - Array of keypoints with scores
 * @returns {number} Average confidence score (0-1)
 */
export const calculateAverageConfidence = (keypoints) => {
  if (!keypoints || keypoints.length === 0) return 0;
  const sum = keypoints.reduce((acc, kp) => acc + (kp.score || 0), 0);
  return sum / keypoints.length;
};

/**
 * Validate if pose has sufficient quality for measurement
 * @param {Array} keypoints - All detected keypoints
 * @param {number} minConfidence - Minimum acceptable confidence
 * @returns {Object} Validation result with isValid and message
 */
export const validatePoseQuality = (keypoints, minConfidence = CONFIDENCE_THRESHOLDS.GOOD) => {
  const extracted = extractKeypoints(keypoints);
  const requiredPoints = [
    extracted.nose,
    extracted.leftShoulder,
    extracted.rightShoulder,
    extracted.leftHip,
    extracted.rightHip,
    extracted.leftElbow,
    extracted.rightElbow,
  ];

  // Check if all required points are detected
  const missingPoints = requiredPoints.filter((pt) => !pt);
  if (missingPoints.length > 0) {
    return {
      isValid: false,
      message: "Some body parts are not visible. Please adjust your position.",
    };
  }

  // Check confidence levels
  const avgConfidence = calculateAverageConfidence(requiredPoints);
  if (avgConfidence < minConfidence) {
    return {
      isValid: false,
      message: `Pose confidence too low (${Math.round(avgConfidence * 100)}%). Please improve lighting or adjust position.`,
    };
  }

  return {
    isValid: true,
    message: "Pose quality is good!",
    confidence: avgConfidence,
  };
};

/**
 * Convert pixel measurements to centimeters
 * @param {number} pixels - Measurement in pixels
 * @param {number} referenceHeightCm - Known height in cm
 * @param {number} referenceHeightPx - Height in pixels
 * @returns {number} Measurement in centimeters
 */
export const pixelsToCm = (pixels, referenceHeightCm, referenceHeightPx) => {
  const ratio = referenceHeightCm / referenceHeightPx;
  return pixels * ratio;
};

/**
 * Format measurement for display
 * @param {number} value - Measurement value
 * @param {string} unit - Unit of measurement
 * @returns {string} Formatted measurement string
 */
export const formatMeasurement = (value, unit = "cm") => {
  return `${Math.round(value)} ${unit}`;
};

/**
 * Estimate inseam length from leg keypoints
 * @param {Object} keypoints - Extracted keypoints
 * @param {number} pixelToCmRatio - Conversion ratio
 * @returns {number} Estimated inseam in cm
 */
export const estimateInseam = (keypoints, pixelToCmRatio) => {
  const { leftHip, leftKnee, leftAnkle, rightHip, rightKnee, rightAnkle } = keypoints;
  
  if (!leftHip || !leftKnee || !leftAnkle || !rightHip || !rightKnee || !rightAnkle) {
    return null;
  }

  const leftInseam = (
    calculateDistance(leftHip, leftKnee) + 
    calculateDistance(leftKnee, leftAnkle)
  ) * pixelToCmRatio * 0.8; // 0.8 factor for inseam vs full leg

  const rightInseam = (
    calculateDistance(rightHip, rightKnee) + 
    calculateDistance(rightKnee, rightAnkle)
  ) * pixelToCmRatio * 0.8;

  return (leftInseam + rightInseam) / 2;
};

/**
 * Generate measurement report
 * @param {Object} measurements - All measurements
 * @param {number} confidence - Overall confidence score
 * @returns {string} Human-readable report
 */
export const generateMeasurementReport = (measurements, confidence) => {
  const qualityLevel = 
    confidence >= CONFIDENCE_THRESHOLDS.EXCELLENT ? "Excellent" :
    confidence >= CONFIDENCE_THRESHOLDS.GOOD ? "Good" :
    "Fair";

  return `
Measurement Report
==================
Quality: ${qualityLevel} (${Math.round(confidence * 100)}%)

Body Measurements:
- Height: ${measurements.height} cm
- Chest: ${measurements.chest} cm
- Bust: ${measurements.bust} cm
- Waist: ${measurements.waist} cm
- Hips: ${measurements.hips} cm
- Shoulder: ${measurements.shoulder} cm
- Arm Length: ${measurements.armLength} cm
- Neck: ${measurements.neck} cm
- Sleeve: ${measurements.sleeve} cm

Note: These are AI-estimated measurements. Please verify and adjust as needed.
  `.trim();
};

/**
 * Color code for confidence visualization
 * @param {number} confidence - Confidence score (0-1)
 * @returns {string} CSS color value
 */
export const getConfidenceColor = (confidence) => {
  if (confidence >= CONFIDENCE_THRESHOLDS.EXCELLENT) return "#10b981"; // green
  if (confidence >= CONFIDENCE_THRESHOLDS.GOOD) return "#f59e0b"; // orange
  return "#ef4444"; // red
};
