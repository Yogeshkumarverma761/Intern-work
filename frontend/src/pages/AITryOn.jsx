import React, { useState } from "react";
import { ArrowLeft, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AIMeasurement from "../components/Measurement/AIMeasurement";
import MeasurementReview from "../components/Measurement/MeasurementReview";

export default function AITryOn() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Capture, 2: Review
  const [aiMeasurements, setAiMeasurements] = useState(null);
  
  // Get user ID from localStorage or context
  const userId = localStorage.getItem("userId");

  const handleMeasurementsComplete = (measurements) => {
    setAiMeasurements(measurements);
    setStep(2);
  };

  const handleSaveComplete = () => {
    // Navigate to user profile or dashboard after successful save
    setTimeout(() => {
      navigate("/profile");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => step === 1 ? navigate(-1) : setStep(1)}
              className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-stone-700" />
            </button>
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-rose-600" />
              <h1 className="text-2xl font-bold text-stone-900">AI Try-On & Measurement</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[
              { num: 1, label: "AI Capture" },
              { num: 2, label: "Review & Save" },
            ].map((item, idx) => (
              <React.Fragment key={item.num}>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= item.num
                        ? "bg-rose-600 text-white"
                        : "bg-stone-200 text-stone-500"
                    }`}
                  >
                    {item.num}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      step >= item.num ? "text-stone-900" : "text-stone-500"
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
                {idx < 1 && (
                  <div
                    className={`w-16 h-1 rounded-full transition-all ${
                      step > item.num ? "bg-rose-600" : "bg-stone-200"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <AIMeasurement onMeasurementsComplete={handleMeasurementsComplete} />
        )}

        {step === 2 && aiMeasurements && (
          <MeasurementReview
            initialMeasurements={aiMeasurements}
            isAIGenerated={true}
            userId={userId}
            onSaveComplete={handleSaveComplete}
          />
        )}
      </main>
    </div>
  );
}
