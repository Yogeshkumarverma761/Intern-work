import React, { useState, useEffect } from "react";
import axios from "axios";
import { Ruler } from "lucide-react";

export default function Measurements({ userId }) {
  const [measurements, setMeasurements] = useState({
    height: "",
    bust: "",
    waist: "",
    hips: "",
    shoulder: "",
    armLength: "",
  });

  const [saved, setSaved] = useState(false);

  // Fetch existing measurements if available
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/measurements/${userId}`)
      .then((res) => {
        if (res.data?.measurements) {
          setMeasurements(res.data.measurements);
        }
      })
      .catch(() => {});
  }, [userId]);

  const handleChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  // Save new measurements
  const handleSave = async () => {
    try {
      await axios.post("http://localhost:5000/api/measurements/save", {
        userId,
        measurements,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      alert("Failed to save measurements");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Ruler className="w-6 h-6 text-rose-600" />
        <h2 className="text-xl font-semibold text-stone-900">Measurements</h2>
      </div>

      {/* Two-Column Grid */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Height", name: "height" },
          { label: "Bust", name: "bust" },
          { label: "Waist", name: "waist" },
          { label: "Hips", name: "hips" },
          { label: "Shoulder", name: "shoulder" },
          { label: "Arm Length", name: "armLength" },
        ].map((item) => (
          <div key={item.name} className="flex flex-col">
            <label className="text-sm text-stone-600 mb-1">{item.label}</label>
            <input
              type="text"
              name={item.name}
              placeholder={`Enter ${item.label}`}
              value={measurements[item.name] || ""}
              onChange={handleChange}
              className="px-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-stone-800 focus:ring-2 focus:ring-rose-400 outline-none shadow-sm"
            />
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-6 w-full bg-rose-600 text-white py-3 rounded-xl shadow-md hover:bg-rose-700 transition-all font-medium"
      >
        Save Measurements
      </button>

      {saved && (
        <p className="text-green-600 text-center mt-3 font-medium">
          Measurements Saved Successfully ✔
        </p>
      )}
    </div>
  );
}
