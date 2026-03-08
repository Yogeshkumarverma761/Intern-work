import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Mail, Lock, ChevronRight } from "lucide-react";
import { UserDataContext } from '../context/UserContext.jsx';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setUser } = React.useContext(UserDataContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = `${API_BASE_URL}/users/login`;

      const payload = {
        email: form.email,
        password: form.password,
      };

      // ⭐ Important for cookies
      const res = await axios.post(endpoint, payload);

      if (res.status === 200) {
        const data = res.data;

        setUser(data.user);

        localStorage.setItem("token", data.token);

        navigate("/");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed!");
    }

    setLoading(false);
  };

  return (
    <>
      {/* ⭐ UI remains EXACTLY THE SAME BELOW THIS POINT ⭐ */}
      <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 flex items-center justify-center px-6 py-16 relative overflow-hidden">
        <Link
          to="/"
          className="absolute top-6 left-6 bg-white/70 backdrop-blur-md px-4 py-2 rounded-full shadow-md text-stone-800 hover:bg-white transition font-medium z-20"
        >
          ← Back to Home
        </Link>

        <div className="absolute top-10 left-20 w-72 h-72 bg-rose-300/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-20 w-80 h-80 bg-amber-300/20 rounded-full blur-3xl"></div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl w-full relative z-10">
          <div className="hidden md:flex flex-col justify-center p-8 rounded-3xl bg-gradient-to-br from-rose-200/60 to-amber-100/60 shadow-lg border border-white/40 backdrop-blur-xl">
            <h2 className="text-5xl font-bold text-stone-900 leading-snug">
              Welcome Back
            </h2>
            <p className="text-stone-700 mt-4 leading-relaxed text-lg">
              Login to continue exploring outfits, AI try-ons, and personalized
              stitching crafted beautifully for women.
            </p>

            <div className="mt-8">
              <img
                src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=900&q=60"
                alt="Login Fashion Art"
                className="rounded-2xl shadow-xl border border-white/50"
              />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-10 border border-stone-200/40">
            <h1 className="text-4xl font-bold text-stone-900 text-center tracking-wide mb-6">
              Login
            </h1>

            <form onSubmit={handleLogin} className="space-y-5">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-rose-600 text-white py-3 rounded-xl shadow-lg hover:bg-rose-700 flex items-center justify-center gap-2 transition-all text-lg font-semibold"
              >
                {loading ? "Logging in..." : "Login"}
                {!loading && <ChevronRight className="w-5 h-5" />}
              </button>
            </form>

            <p className="text-center text-sm text-stone-700 mt-6">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-rose-600 font-semibold cursor-pointer"
              >
                Signup
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
