import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Mail,
  Phone,
  User,
  Ruler,
  ShoppingBag,
  Wand2,
  ChevronRight,
  Bot,
  PenLine,
  Shield,
} from "lucide-react";
import Measurements from "../components/Measurement/Measurement.jsx";
import Header from "../components/Header.jsx";

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [measurements, setMeasurements] = useState(null);
  const [showMeasurementForm, setShowMeasurementForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch user profile
    axios
      .get(`${API_BASE_URL}/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => {
        // Error fetching user profile
      });

    // Fetch measurements
    axios
      .get(`${API_BASE_URL}/measurements/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.data;
        if (data && data.length > 0) {
          setMeasurements(data[0]);
        }
      })
      .catch(() => {});
  }, [token]);

  if (!user)
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
      </div>
    );

  // Get user initials
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  // Format date
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  // Measurement display fields
  const measurementFields = [
    { key: "height", label: "Height", unit: "cm", icon: "📏" },
    { key: "weight", label: "Weight", unit: "kg", icon: "⚖️" },
    { key: "neck", label: "Neck", unit: "cm", icon: "👔" },
    { key: "chest", label: "Chest", unit: "cm", icon: "👕" },
    { key: "bust", label: "Bust", unit: "cm", icon: "👗" },
    { key: "waist", label: "Waist", unit: "cm", icon: "📐" },
    { key: "hips", label: "Hips", unit: "cm", icon: "👖" },
    { key: "shoulder", label: "Shoulder", unit: "cm", icon: "🧥" },
    { key: "armLength", label: "Arm Length", unit: "cm", icon: "💪" },
    { key: "sleeve", label: "Sleeve", unit: "cm", icon: "🧵" },
    { key: "inseam", label: "Inseam", unit: "cm", icon: "📏" },
  ];

  const hasMeasurements =
    measurements &&
    measurementFields.some(
      (f) => measurements[f.key] !== null && measurements[f.key] !== undefined
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 relative overflow-x-hidden">
      {/* Decorative Background Shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-amber-200/40 rounded-full blur-[180px] pointer-events-none"></div>

      <Header />

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="relative pt-16 pb-10 px-6 z-10">
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Initials Avatar */}
          <div className="inline-flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-rose-500 to-rose-700 shadow-2xl shadow-rose-300/50 mb-6 border-4 border-white">
            <span className="text-4xl font-bold text-white tracking-wide">
              {initials}
            </span>
          </div>

          <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">
            {user.name}
          </h1>
          <p className="text-stone-600 text-lg">{user.email}</p>
          <p className="text-stone-500 text-sm mt-1">
            Member since {memberSince}
          </p>
        </div>
      </section>

      {/* ═══════════════ MAIN CONTENT ═══════════════ */}
      <div className="max-w-6xl mx-auto px-6 pb-20 grid lg:grid-cols-3 gap-8 relative z-10">
        {/* ──────── LEFT COLUMN ──────── */}
        <div className="space-y-6">
          {/* Personal Details Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-stone-900 mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-rose-600" />
              Personal Details
            </h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">
                    Name
                  </p>
                  <p className="text-stone-900 font-medium">{user.name}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">
                    Email
                  </p>
                  <p className="text-stone-900 font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">
                    Phone
                  </p>
                  <p className="text-stone-900 font-medium">{user.phoneNo}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-rose-600" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 uppercase tracking-wider">
                    Account Type
                  </p>
                  <p className="text-stone-900 font-medium capitalize">
                    {user.role}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-stone-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                to="/ai-tryon"
                className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-200/50 hover:from-rose-100 hover:to-orange-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <Wand2 className="w-5 h-5 text-rose-600" />
                  <span className="text-stone-800 font-medium text-sm">
                    AI Try-On
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-rose-600 transition-colors" />
              </Link>

              <Link
                to="/shop"
                className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/50 hover:bg-stone-100 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-5 h-5 text-stone-600" />
                  <span className="text-stone-800 font-medium text-sm">
                    Browse Shop
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-400 group-hover:text-stone-700 transition-colors" />
              </Link>
            </div>
          </div>
        </div>

        {/* ──────── RIGHT COLUMN (spans 2) ──────── */}
        <div className="lg:col-span-2 space-y-6">
          {/* ═════ Measurements Display Card ═════ */}
          <div className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-stone-900 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-rose-600" />
                My Measurements
              </h3>
              {hasMeasurements && (
                <div className="flex items-center gap-2">
                  {/* AI or Manual badge */}
                  {measurements.isAIGenerated ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-xs font-medium">
                      <Bot className="w-3.5 h-3.5" />
                      AI Generated
                      {measurements.confidence && (
                        <span className="text-violet-500 ml-1">
                          ({measurements.confidence}% confidence)
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                      <PenLine className="w-3.5 h-3.5" />
                      Manually Entered
                    </span>
                  )}
                </div>
              )}
            </div>

            {hasMeasurements ? (
              <>
                {/* Measurement Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6">
                  {measurementFields.map((field) => {
                    const value = measurements[field.key];
                    if (value === null || value === undefined) return null;
                    return (
                      <div
                        key={field.key}
                        className="bg-gradient-to-br from-rose-50/80 to-amber-50/80 border border-rose-100/60 rounded-2xl p-3 text-center hover:shadow-md transition-all"
                      >
                        <p className="text-lg mb-1">{field.icon}</p>
                        <p className="text-xl font-bold text-stone-900">
                          {value}
                          <span className="text-xs text-stone-500 ml-1 font-normal">
                            {field.unit}
                          </span>
                        </p>
                        <p className="text-xs text-stone-600 mt-1">
                          {field.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Update button */}
                <button
                  onClick={() => setShowMeasurementForm(!showMeasurementForm)}
                  className="text-sm text-rose-600 hover:text-rose-700 transition-colors font-medium"
                >
                  {showMeasurementForm
                    ? "← Hide Form"
                    : "✏️ Update Measurements"}
                </button>

                {showMeasurementForm && (
                  <div className="mt-4 pt-4 border-t border-stone-200">
                    <Measurements
                      userId={user._id}
                      onMeasurementsSaved={(m) => {
                        setMeasurements((prev) => ({ ...prev, ...m }));
                        setShowMeasurementForm(false);
                        // Re-fetch to get proper data types
                        axios
                          .get(`${API_BASE_URL}/measurements/`, {
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          .then((res) => {
                            const data = res.data?.data;
                            if (data && data.length > 0) {
                              setMeasurements(data[0]);
                            }
                          })
                          .catch(() => {});
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="text-center py-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-4">
                  <Ruler className="w-8 h-8 text-rose-500" />
                </div>
                <h4 className="text-stone-900 font-semibold text-lg mb-2">
                  No Measurements Yet
                </h4>
                <p className="text-stone-600 text-sm mb-6 max-w-md mx-auto">
                  Add your body measurements to get perfectly tailored clothes.
                  You can enter them manually or use our AI to get instant
                  measurements.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    to="/ai-tryon"
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 text-white rounded-full font-medium text-sm shadow-lg hover:bg-rose-700 transition-all"
                  >
                    <Sparkles className="w-4 h-4" />
                    Try AI Measurement
                  </Link>
                  <button
                    onClick={() => setShowMeasurementForm(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/70 border border-white/40 text-stone-900 rounded-full font-medium text-sm hover:bg-white transition-all shadow"
                  >
                    <PenLine className="w-4 h-4" />
                    Enter Manually
                  </button>
                </div>

                {showMeasurementForm && (
                  <div className="mt-8 text-left">
                    <Measurements
                      userId={user._id}
                      onMeasurementsSaved={(m) => {
                        setShowMeasurementForm(false);
                        // Re-fetch to get proper data
                        axios
                          .get(`${API_BASE_URL}/measurements/`, {
                            headers: { Authorization: `Bearer ${token}` },
                          })
                          .then((res) => {
                            const data = res.data?.data;
                            if (data && data.length > 0) {
                              setMeasurements(data[0]);
                            }
                          })
                          .catch(() => {});
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ═════ AI Try-On CTA Banner ═════ */}
          <Link
            to="/ai-tryon"
            className="block bg-gradient-to-r from-rose-100/80 to-orange-100/80 border border-rose-200/50 rounded-3xl p-6 hover:shadow-2xl transition-all group shadow-lg"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 flex items-center justify-center shadow-lg shadow-rose-300/40">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-stone-900 font-semibold text-lg font-serif">
                  Try AI Virtual Fitting
                </h4>
                <p className="text-stone-600 text-sm mt-0.5">
                  Upload your photo and see how outfits look on you — powered by
                  AI
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-stone-400 group-hover:text-rose-600 transition-colors" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
