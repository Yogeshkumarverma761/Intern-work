import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User, Search, Heart, ShoppingBag, Sparkles } from "lucide-react";
import { UserDataContext } from "../context/UserContext.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { user, setUser } = React.useContext(UserDataContext);
  const { getItemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

  const resolvedUser = useMemo(() => {
    if (user) return user;
    const cached = localStorage.getItem("user");
    if (!cached) return null;
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.error("Failed to parse cached user", error);
      return null;
    }
  }, [user]);

  const role = resolvedUser?.role || "user";
  const isLoggedIn = Boolean(token);

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="backdrop-blur-xl bg-white/50 border-b border-white/40 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white shadow">
            S
          </div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-wider">
            SmartStitch
          </h1>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`transition ${isActive("/") ? "text-rose-600" : "text-stone-700 hover:text-stone-900"}`}
          >
            Home
          </Link>
          <Link
            to="/shop"
            className={`transition ${isActive("/shop") ? "text-rose-600" : "text-stone-700 hover:text-stone-900"}`}
          >
            Shop
          </Link>
          <a href="#collections" className="text-stone-700 hover:text-stone-900 transition">
            New Works
          </a>
          <a href="#contact" className="text-stone-700 hover:text-stone-900 transition">
            Contact
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              {role === "admin" && (
                <>
                  <Link
                    to="/admin/cloths/new"
                    className="bg-stone-900 text-white px-4 py-2 rounded-full text-sm hover:bg-stone-700 transition"
                  >
                    Add Clothes
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm hover:bg-purple-700 transition"
                  >
                    Orders Dashboard
                  </Link>
                </>
              )}

              {role === "user" && (
                <>
                  <Link
                    to="/ai-tryon"
                    className="px-4 py-2 bg-linear-to-r from-rose-600 to-orange-600 text-white rounded-full text-sm font-medium hover:from-rose-700 hover:to-orange-700 transition flex items-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Try-On
                  </Link>
                  <Link to="/profile" className="p-2 rounded-full hover:bg-white/40 transition">
                    <User className="w-5 h-5 text-stone-700" />
                  </Link>
                  <button className="p-2 rounded-full hover:bg-white/40 transition">
                    <Search className="w-5 h-5 text-stone-700" />
                  </button>
                  <button className="p-2 rounded-full hover:bg-white/40 transition">
                    <Heart className="w-5 h-5 text-stone-700" />
                  </button>
                  <Link to="/cart" className="p-2 rounded-full hover:bg-white/40 transition relative">
                    <ShoppingBag className="w-5 h-5 text-stone-700" />
                    {getItemCount() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {getItemCount()}
                      </span>
                    )}
                  </Link>
                </>
              )}

              <button
                onClick={handleSignOut}
                className="ml-1 bg-rose-600 text-white px-4 py-2 rounded-full text-sm hover:bg-rose-700 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-white/70 backdrop-blur-md border border-white/40 text-stone-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-rose-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
