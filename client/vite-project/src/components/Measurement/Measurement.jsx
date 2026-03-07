import React, { useState, useEffect } from "react";
import axios from "axios";
import { Ruler, Save, CheckCircle, AlertCircle } from "lucide-react";

export default function Measurements({ userId, onMeasurementsSaved }) {
  const [measurements, setMeasurements] = useState({
    height: "",
    weight: "",
    neck: "",
    chest: "",
    bust: "",
    waist: "",
    hips: "",
    shoulder: "",
    armLength: "",
    sleeve: "",
    inseam: "",
  });

  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [existingId, setExistingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch existing measurements
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    axios
      .get("http://localhost:5000/measurements/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.data;
        if (data && data.length > 0) {
          const latest = data[0]; // already sorted by createdAt desc
          setExistingId(latest._id);
          setMeasurements({
            height: latest.height || "",
            weight: latest.weight || "",
            neck: latest.neck || "",
            chest: latest.chest || "",
            bust: latest.bust || "",
            waist: latest.waist || "",
            hips: latest.hips || "",
            shoulder: latest.shoulder || "",
            armLength: latest.armLength || "",
            sleeve: latest.sleeve || "",
            inseam: latest.inseam || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
    setSaved(false);
    setError("");
  };

  // Save or update measurements
  const handleSave = async () => {
    try {
      setError("");
      // Build payload — convert strings to numbers, skip empty
      const payload = {};
      Object.entries(measurements).forEach(([key, val]) => {
        if (val !== "" && val !== null && val !== undefined) {
          payload[key] = Number(val);
        }
      });

      if (Object.keys(payload).length === 0) {
        setError("Please enter at least one measurement.");
        return;
      }

      if (existingId) {
        // Update existing
        await axios.patch(
          `http://localhost:5000/measurements/${existingId}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new
        const res = await axios.post(
          "http://localhost:5000/measurements/",
          payload,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setExistingId(res.data?.data?._id);
      }

      setSaved(true);
      if (onMeasurementsSaved) onMeasurementsSaved(measurements);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save measurements");
    }
  };

  const fields = [
    { label: "Height", name: "height", unit: "cm" },
    { label: "Weight", name: "weight", unit: "kg" },
    { label: "Neck", name: "neck", unit: "cm" },
    { label: "Chest", name: "chest", unit: "cm" },
    { label: "Bust", name: "bust", unit: "cm" },
    { label: "Waist", name: "waist", unit: "cm" },
    { label: "Hips", name: "hips", unit: "cm" },
    { label: "Shoulder", name: "shoulder", unit: "cm" },
    { label: "Arm Length", name: "armLength", unit: "cm" },
    { label: "Sleeve", name: "sleeve", unit: "cm" },
    { label: "Inseam", name: "inseam", unit: "cm" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Two-Column Grid */}
      <div className="grid grid-cols-2 gap-3">
        {fields.map((item) => (
          <div key={item.name} className="flex flex-col">
            <label className="text-xs font-medium text-stone-500 mb-1 uppercase tracking-wider">
              {item.label}
            </label>
            <div className="relative">
              <input
                type="number"
                name={item.name}
                placeholder="—"
                value={measurements[item.name] || ""}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-stone-800 text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent outline-none transition-all pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-stone-400">
                {item.unit}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="mt-5 w-full bg-gradient-to-r from-rose-600 to-orange-500 text-white py-2.5 rounded-lg shadow-md hover:from-rose-700 hover:to-orange-600 transition-all font-medium text-sm flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        {existingId ? "Update Measurements" : "Save Measurements"}
      </button>

      {saved && (
        <div className="flex items-center justify-center gap-2 mt-3 text-green-600 text-sm font-medium">
          <CheckCircle className="w-4 h-4" />
          Measurements saved successfully!
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center gap-2 mt-3 text-red-500 text-sm font-medium">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}
    </div>
  );
}
