import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Camera, Sparkles } from "lucide-react";
import Measurements from "../components/Measurement/Measurement.jsx";
import Header from "../components/Header.jsx";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:5000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data.user))
      .catch((err) => console.log(err));
  }, []);

  if (!user)
    return <div className="text-center py-20 text-lg text-stone-600">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-linear-to-b from-rose-100 via-rose-50 to-amber-100 p-0">
      <Header />
      {/* PROFILE HEADER */}
      <section className="text-center pt-12">
        <img
          src="https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
          alt="Profile"
          className="w-40 h-40 rounded-xl object-cover mx-auto shadow-xl border-4 border-white"
        />

        <h2 className="text-4xl font-bold mt-6 text-stone-900">{user.name}</h2>
        <p className="text-stone-600 mt-2 text-lg">
          Fashion enthusiast, exploring AI designs and perfect fits.
        </p>
      </section>

      {/* NAVIGATION TABS */}
      <div className="max-w-4xl mx-auto mt-10">
        <div className="flex justify-center gap-10 text-lg font-medium text-stone-700 border-b border-stone-300 pb-3">
          {["profile", "saved", "orders", "tryons"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 transition-all ${
                activeTab === tab
                  ? "text-rose-600 border-b-2 border-rose-600"
                  : "hover:text-stone-900"
              }`}
            >
              {tab === "profile" && "My Profile"}
              {tab === "saved" && "Saved Designs"}
              {tab === "orders" && "Orders"}
              {tab === "tryons" && "All Try-Ons"}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-8 py-12">

        {/* ===== LEFT CARD – PERSONAL DETAILS ===== */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-stone-200">
          <h3 className="text-xl font-semibold text-stone-900 mb-4">Personal Details</h3>

          <div className="space-y-4 text-stone-700">
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNo}</p>
            <p><strong>Role:</strong> {user.role}</p>
          </div>

          <button className="mt-6 w-full bg-stone-900 text-white py-3 rounded-lg hover:bg-stone-800 transition flex items-center justify-center gap-2">
            <Camera className="w-4 h-4" /> Update Profile
          </button>
        </div>

        {/* ===== MIDDLE CARD – MEASUREMENTS ===== */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-stone-200">
          <h3 className="text-xl font-semibold text-stone-900 mb-4">Measurements</h3>
          
          {/* AI Try-On CTA */}
          <Link 
            to="/ai-tryon"
            className="mb-6 block p-4 bg-linear-to-r from-rose-500 to-orange-500 text-white rounded-xl hover:from-rose-600 hover:to-orange-600 transition shadow-md"
          >
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <p className="font-semibold">Try AI Measurement</p>
                <p className="text-xs text-white/90">Get instant measurements with AI</p>
              </div>
            </div>
          </Link>

          <Measurements userId={user._id} />
        </div>

        {/* ===== RIGHT CARD – RECENT ACTIVITY ===== */}
        <div className="bg-white shadow-xl rounded-2xl p-8 border border-stone-200">
          <h3 className="text-xl font-semibold text-stone-900 mb-4">Recent Activity</h3>

          <div className="space-y-5">

            <div className="flex items-center gap-4 bg-stone-100 p-3 rounded-xl hover:bg-stone-200 transition">
              <img
                src="https://images.unsplash.com/photo-1544717302-de2939b7ef71"
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-stone-900">Try: Mohit Morya</p>
                <p className="text-sm text-stone-600">2 days ago</p>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-stone-100 p-3 rounded-xl hover:bg-stone-200 transition">
              <img
                src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb"
                className="w-14 h-14 rounded-xl object-cover"
              />
              <div>
                <p className="font-medium text-stone-900">AI Design Try-On</p>
                <p className="text-sm text-stone-600">1 week ago</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
