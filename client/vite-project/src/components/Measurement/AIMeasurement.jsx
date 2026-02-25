import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { Camera, StopCircle, Scan, CheckCircle, XCircle } from "lucide-react";

export default function AIMeasurement({ onMeasurementsComplete }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [detector, setDetector] = useState(null);
  const [status, setStatus] = useState("idle"); // idle, loading, ready, capturing, analyzing, complete
  const [measurements, setMeasurements] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [error, setError] = useState("");
  const [userHeight, setUserHeight] = useState("");
  const animationFrameId = useRef(null);

  // Track state changes
  useEffect(() => {
    console.log("State updated - Status:", status, "Measurements:", measurements ? "exists" : "null", "Confidence:", confidence);
  }, [status, measurements, confidence]);

  // Initialize pose detector
  useEffect(() => {
    const initDetector = async () => {
      try {
        setStatus("loading");
        console.log("Initializing TensorFlow.js...");
        await tf.ready();
        console.log("TensorFlow.js ready");
        
        console.log("Loading MoveNet model...");
        const detectorConfig = {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        };
        
        const poseDetector = await poseDetection.createDetector(
          poseDetection.SupportedModels.MoveNet,
          detectorConfig
        );
        
        console.log("MoveNet model loaded successfully");
        setDetector(poseDetector);
        setStatus("ready");
      } catch (err) {
        console.error("Model initialization error:", err);
        setError("Failed to load AI model: " + err.message);
        setStatus("idle");
      }
    };

    initDetector();

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  // Start camera
  const startCamera = async () => {
    try {
      setError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user",
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          // Set canvas dimensions to match video
          if (canvasRef.current) {
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
          }
          videoRef.current.play();
          setIsCapturing(true);
          setStatus("capturing");
          console.log("Camera started successfully");
        };
        
        videoRef.current.onerror = (err) => {
          console.error("Video error:", err);
          setError("Failed to play video stream");
        };
      }
    } catch (err) {
      console.error("Camera error:", err);
      setError("Failed to access camera: " + err.message);
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCapturing(false);
    setStatus("ready");
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
  };

  // Calculate distance between two points
  const calculateDistance = (point1, point2) => {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Calculate measurements from pose keypoints
  const calculateMeasurements = (keypoints, heightInCm) => {
    // Extract key body points
    const nose = keypoints.find((kp) => kp.name === "nose");
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");
    const leftHip = keypoints.find((kp) => kp.name === "left_hip");
    const rightHip = keypoints.find((kp) => kp.name === "right_hip");
    const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
    const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");
    const leftAnkle = keypoints.find((kp) => kp.name === "left_ankle");
    const rightAnkle = keypoints.find((kp) => kp.name === "right_ankle");

    // Check if all required points are detected with good confidence
    const requiredPoints = [
      nose, leftShoulder, rightShoulder, leftHip, rightHip,
      leftElbow, rightElbow, leftWrist, rightWrist
    ];
    
    const avgConfidence = requiredPoints.reduce((sum, pt) => sum + (pt?.score || 0), 0) / requiredPoints.length;
    
    if (avgConfidence < 0.3) {
      return null; // Not enough confidence
    }

    // Calculate pixel-to-cm ratio based on user-provided height
    const headToAnkle = calculateDistance(
      nose,
      { x: (leftAnkle.x + rightAnkle.x) / 2, y: (leftAnkle.y + rightAnkle.y) / 2 }
    );
    const pixelToCm = heightInCm / headToAnkle;

    // Calculate measurements
    const shoulderWidth = calculateDistance(leftShoulder, rightShoulder) * pixelToCm;
    const hipWidth = calculateDistance(leftHip, rightHip) * pixelToCm;
    
    // Arm length (shoulder to wrist)
    const leftArmLength = (
      calculateDistance(leftShoulder, leftElbow) + 
      calculateDistance(leftElbow, leftWrist)
    ) * pixelToCm;
    
    const rightArmLength = (
      calculateDistance(rightShoulder, rightElbow) + 
      calculateDistance(rightElbow, rightWrist)
    ) * pixelToCm;
    
    const avgArmLength = (leftArmLength + rightArmLength) / 2;

    // Estimate body measurements using realistic body proportion ratios
    // Using more conservative multipliers to account for 2D to 3D conversion
    const chest = shoulderWidth * 2.2; // Chest circumference estimate (typically 85-110 cm)
    const waist = hipWidth * 1.8; // Waist circumference estimate (typically 70-90 cm)
    const hips = hipWidth * 2.3; // Hip circumference estimate (typically 90-110 cm)
    const bust = chest * 0.92; // Bust estimate for female measurements
    
    // Neck estimate (proportional to shoulder width)
    const neck = shoulderWidth * 0.85;
    
    // Sleeve length (actual arm length measurement is already accurate)
    const sleeve = avgArmLength * 0.95;

    return {
      height: Math.round(heightInCm),
      bust: Math.round(bust),
      chest: Math.round(chest),
      waist: Math.round(waist),
      hips: Math.round(hips),
      shoulder: Math.round(shoulderWidth),
      armLength: Math.round(avgArmLength),
      neck: Math.round(neck),
      sleeve: Math.round(sleeve),
      confidence: Math.round(avgConfidence * 100),
    };
  };

  // Draw pose on canvas
  const drawPose = (poses) => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!canvas || !video) return;

    const ctx = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (poses.length > 0) {
      const pose = poses[0];
      const keypoints = pose.keypoints;

      // Draw keypoints
      keypoints.forEach((keypoint) => {
        if (keypoint.score > 0.3) {
          ctx.beginPath();
          ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
          ctx.fillStyle = keypoint.score > 0.6 ? "#10b981" : "#f59e0b";
          ctx.fill();
        }
      });

      // Draw skeleton
      const adjacentPairs = [
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

      adjacentPairs.forEach(([part1, part2]) => {
        const kp1 = keypoints.find((kp) => kp.name === part1);
        const kp2 = keypoints.find((kp) => kp.name === part2);

        if (kp1 && kp2 && kp1.score > 0.3 && kp2.score > 0.3) {
          ctx.beginPath();
          ctx.moveTo(kp1.x, kp1.y);
          ctx.lineTo(kp2.x, kp2.y);
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });
    }
  };

  // Capture and analyze pose
  const capturePose = async () => {
    if (!detector || !videoRef.current || !userHeight || parseFloat(userHeight) < 50) {
      setError("Please enter your height in centimeters (e.g., 170)");
      return;
    }

    setStatus("analyzing");
    setError("");

    try {
      // Ensure video is ready
      if (!videoRef.current.srcObject) {
        setError("Video stream not ready. Please start the camera again.");
        setStatus("capturing");
        return;
      }

      console.log("Starting pose estimation...");
      const poses = await detector.estimatePoses(videoRef.current, {
        maxPoses: 1,
        flipHorizontal: false,
      });
      
      console.log("Poses detected:", poses.length);
      
      if (poses.length > 0) {
        drawPose(poses);
        
        const heightInCm = parseFloat(userHeight);
        const measuredData = calculateMeasurements(poses[0].keypoints, heightInCm);
        
        console.log("Measured data:", measuredData);
        
        if (measuredData) {
          // Stop camera first
          stopCamera();
          
          // Then update measurements state
          console.log("Setting measurements state...");
          setMeasurements(measuredData);
          setConfidence(measuredData.confidence);
          
          // Finally, update status to trigger UI change
          setTimeout(() => {
            console.log("Setting status to complete...");
            setStatus("complete");
          }, 100);
        } else {
          setError("Could not detect body properly. Please ensure your full body is visible and try again.");
          setStatus("capturing");
        }
      } else {
        setError("No person detected. Please ensure you're fully visible in the frame.");
        setStatus("capturing");
      }
    } catch (err) {
      console.error("Capture error:", err);
      setError("Analysis failed: " + err.message);
      setStatus("capturing");
    }
  };

  // Continuous pose detection for real-time feedback
  useEffect(() => {
    const detectPoseContinuously = async () => {
      if (!detector || !videoRef.current || !isCapturing) return;

      try {
        if (!videoRef.current.srcObject) return;

        const poses = await detector.estimatePoses(videoRef.current, {
          maxPoses: 1,
          flipHorizontal: false,
        });
        drawPose(poses);
        
        if (poses.length > 0) {
          const avgConfidence = poses[0].keypoints.reduce((sum, kp) => sum + kp.score, 0) / poses[0].keypoints.length;
          setConfidence(Math.round(avgConfidence * 100));
        }
      } catch (err) {
        console.error("Pose detection error:", err);
      }

      animationFrameId.current = requestAnimationFrame(detectPoseContinuously);
    };

    if (isCapturing && status === "capturing") {
      detectPoseContinuously();
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isCapturing, status, detector]);

  const handleComplete = () => {
    console.log("handleComplete called with measurements:", measurements);
    if (onMeasurementsComplete && measurements) {
      console.log("Calling onMeasurementsComplete callback");
      onMeasurementsComplete(measurements);
    } else {
      console.warn("Cannot call onMeasurementsComplete - callback exists:", !!onMeasurementsComplete, "measurements exist:", !!measurements);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-rose-600" />
          <h2 className="text-xl font-semibold text-stone-900">AI Body Measurement</h2>
        </div>
        {status !== "idle" && (
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            status === "loading" ? "bg-yellow-100 text-yellow-700" :
            status === "ready" ? "bg-blue-100 text-blue-700" :
            status === "capturing" ? "bg-green-100 text-green-700" :
            status === "analyzing" ? "bg-purple-100 text-purple-700" :
            "bg-emerald-100 text-emerald-700"
          }`}>
            {status === "loading" ? "Loading AI..." :
             status === "ready" ? "Ready" :
             status === "capturing" ? `Detecting (${confidence}%)` :
             status === "analyzing" ? "Analyzing..." :
             "Complete"}
          </div>
        )}
      </div>

      {/* Debug: Log current state */}
      {process.env.NODE_ENV === "development" && (
        <div className="mb-2 text-xs text-stone-500">
          [Debug] Status: {status} | Measurements: {measurements ? "Yes" : "No"}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
          <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {status !== "complete" && (
        <>
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-medium text-blue-900 mb-2">Instructions:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Enter your height in centimeters</li>
              <li>Stand 2-3 meters away from the camera</li>
              <li>Ensure your full body is visible in the frame</li>
              <li>Stand straight with arms slightly away from your body</li>
              <li>Click "Start Camera" and then "Capture Measurements"</li>
            </ol>
          </div>

          {/* Height Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Your Height (in cm) *
            </label>
            <input
              type="number"
              placeholder="e.g., 170"
              value={userHeight}
              onChange={(e) => setUserHeight(e.target.value)}
              className="w-full px-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:ring-2 focus:ring-rose-400 outline-none"
              disabled={isCapturing}
            />
          </div>

          {/* Camera View */}
          <div className="relative mb-4 bg-stone-900 rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            {!isCapturing && status === "ready" && (
              <div className="absolute inset-0 flex items-center justify-center bg-stone-900/50">
                <Camera className="w-16 h-16 text-white/50" />
              </div>
            )}
          </div>

          {/* Camera Controls */}
          <div className="flex gap-3">
            {!isCapturing ? (
              <button
                onClick={startCamera}
                disabled={status !== "ready"}
                className="flex-1 bg-rose-600 text-white py-3 rounded-xl shadow-md hover:bg-rose-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Start Camera
              </button>
            ) : (
              <>
                <button
                  onClick={capturePose}
                  disabled={status === "analyzing"}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl shadow-md hover:bg-green-700 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center gap-2"
                >
                  <Scan className="w-5 h-5" />
                  {status === "analyzing" ? "Analyzing..." : "Capture Measurements"}
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 bg-stone-600 text-white py-3 rounded-xl shadow-md hover:bg-stone-700 transition-all font-medium flex items-center justify-center gap-2"
                >
                  <StopCircle className="w-5 h-5" />
                  Stop
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Results */}
      {status === "complete" && measurements ? (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-medium text-green-900">Measurements captured successfully!</p>
              <p className="text-sm text-green-700">Confidence: {confidence}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {Object.entries(measurements).filter(([key]) => key !== "confidence").map(([key, value]) => (
              <div key={key} className="p-3 bg-stone-50 rounded-lg">
                <div className="text-xs text-stone-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                <div className="text-lg font-semibold text-stone-900">{value} cm</div>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                console.log("Retake button clicked");
                setStatus("ready");
                setMeasurements(null);
                setConfidence(0);
              }}
              className="flex-1 bg-stone-600 text-white py-3 rounded-xl shadow-md hover:bg-stone-700 transition-all font-medium"
            >
              Retake
            </button>
            <button
              onClick={handleComplete}
              className="flex-1 bg-rose-600 text-white py-3 rounded-xl shadow-md hover:bg-rose-700 transition-all font-medium"
            >
              Use These Measurements
            </button>
          </div>
        </div>
      ) : status === "complete" ? (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
          <p className="text-sm text-yellow-700">Status is complete but measurements are missing. This shouldn't happen!</p>
        </div>
      ) : null}
    </div>
  );
}
