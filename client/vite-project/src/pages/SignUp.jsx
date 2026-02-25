import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, Lock, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { UserDataContext } from "../context/UserContext.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = React.useContext(UserDataContext);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ⭐ REGISTER USER
  const registerUser = async () => {
    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phoneNo: form.phoneNo,
    };

    const res = await axios.post("http://localhost:5000/users/register", payload);

    if (res.status === 201) {
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    }
  };

  // ⭐ MAIN SIGNUP HANDLER
  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await registerUser();
      setLoading(false);
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Signup failed.");
      setLoading(false);
    }
  };

  return (
    <>
      {/** ⭐ YOUR ENTIRE JSX/Design BELOW REMAINS 100% UNCHANGED ⭐ */}
      {/** I did not modify UI — only logic above changed. */}

      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 flex items-center justify-center px-6 py-16 relative overflow-hidden">
        <Link
          to="/"
          className="absolute top-6 left-6 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-stone-800 hover:bg-white transition font-medium z-20"
        >
          ← Back to Home
        </Link>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full relative z-10">
          {/* Left Beauty Section */}
          <div className="hidden md:flex flex-col justify-center p-8 rounded-3xl bg-gradient-to-br from-rose-200/60 to-amber-100/60 shadow-lg border border-white/40 backdrop-blur-xl">
            <h2 className="text-5xl font-bold text-stone-900 leading-snug">
              Welcome to <span className="text-rose-600">SmartStitch</span>
            </h2>
            <p className="text-stone-700 mt-4 leading-relaxed text-lg">
              Your personalized stitching and AI outfit try-on companion.
              Experience elegance, accuracy and beauty stitched perfectly for
              women.
            </p>

            <div className="mt-8">
              <img
                src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f"
                alt="Fashion Art"
                className="rounded-2xl shadow-xl border border-white/50"
              />
            </div>
          </div>

          {/* Signup Card */}
          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-stone-200/40">
            <h1 className="text-4xl font-bold text-stone-900 text-center tracking-wide mb-6">
              Create Account
            </h1>

            <form onSubmit={handleSignup} className="space-y-5">
              {/* ALL YOUR UI SAME */}
              {/* Name */}
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Full Name
                </label>
                <div className="flex items-center bg-white border border-stone-300 rounded-xl px-4 py-3 mt-1 shadow-sm">
                  <User className="w-5 h-5 text-rose-500 mr-2" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="flex-1 outline-none text-stone-800"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Email Address
                </label>
                <div className="flex items-center bg-white border border-stone-300 rounded-xl px-4 py-3 mt-1 shadow-sm">
                  <Mail className="w-5 h-5 text-rose-500 mr-2" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    className="flex-1 outline-none text-stone-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Password
                </label>
                <div className="flex items-center bg-white border border-stone-300 rounded-xl px-4 py-3 mt-1 shadow-sm">
                  <Lock className="w-5 h-5 text-rose-500 mr-2" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className="flex-1 outline-none text-stone-800"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-stone-700">
                  Phone Number
                </label>
                <div className="flex items-center bg-white border border-stone-300 rounded-xl px-4 py-3 mt-1 shadow-sm">
                  <Phone className="w-5 h-5 text-rose-500 mr-2" />
                  <input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter your phone number"
                    value={form.phoneNo}
                    onChange={handleChange}
                    required
                    className="flex-1 outline-none text-stone-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 text-white py-3 rounded-xl shadow-lg hover:bg-rose-700 flex items-center justify-center gap-2 transition-all text-lg font-semibold"
              >
                {loading ? "Creating..." : "Create Account"}
                {!loading && <ChevronRight className="w-5 h-5" />}
              </button>
            </form>

            <p className="text-center text-sm text-stone-700 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-rose-600 font-semibold cursor-pointer">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
