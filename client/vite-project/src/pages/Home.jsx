// SmartStitch Home Page — Traditional Indian Wear Edition
import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext.jsx';
import Header from '../components/Header.jsx';
import { fetchClothes } from '../api/clothApi.js';
import {
  Share2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Scissors,
  Shirt,
  Instagram,
  MapPin,
  Star
} from 'lucide-react';

const formatInr = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount || 0);

export default function Home() {
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();
  const isSignedIn = Boolean(user && localStorage.getItem('token'));

  // Real products & categories from API
  const [featuredProducts, setFeaturedProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);



  useEffect(() => {

    // Fetch featured/latest products for the home page
    const loadProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetchClothes({ limit: 3, sort: 'newest' });
        setFeaturedProducts(res?.data || []);
      } catch {
        setFeaturedProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };
    loadProducts();
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 relative overflow-x-hidden">

      {/* Decorative Background Shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-amber-200/40 rounded-full blur-[180px] pointer-events-none"></div>

      <Header />

      {/* HERO SECTION — editorial image + AI try-on card */}
      <section id="hero" className="relative max-w-7xl mx-auto px-6 pt-12 pb-24 grid md:grid-cols-2 gap-12 items-center z-10">
        {/* Left copy + CTA + AI preview link */}
        <div className="space-y-6">
          <h2 className="text-5xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">Your Style. Your Fit. <span className="text-rose-600 italic">Your Way.</span></h2>
          <p className="text-lg text-stone-700 max-w-md">SmartStitch transforms traditional tailoring into a smart digital experience.
Browse designs, personalize your outfit, preview it instantly, and get clothing stitched to your exact measurements.</p>

          <div className="flex gap-4 items-center">
            <Link to="/ai-tryon" className="inline-flex items-center gap-3 px-6 py-3 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition">Try It On Now 🪄</Link>
            <a href="#collections" className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-md border border-white/40 text-stone-900 rounded-full shadow transition">Explore Collection</a>
          </div>
        </div>

        {/* Right: wide editorial image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img src="/home/hero.png" alt="Traditional Indian Fashion" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* ADMIN QUICK ACTION */}
      {user?.role === 'admin' && localStorage.getItem('token') && (
        <section className="max-w-7xl mx-auto px-6 pb-12">
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-wide text-rose-600 font-semibold">Admin</p>
              <h3 className="text-2xl font-serif font-bold text-stone-900 mt-1">Add a new cloth to the shop</h3>
              <p className="text-stone-600 mt-2 text-sm">Create listings with price, images, tags, stock, and featured flags. Changes appear instantly in Shop.</p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/admin/cloths/new"
                className="px-5 py-3 rounded-full bg-rose-600 text-white font-semibold hover:bg-rose-700 transition shadow"
              >
                Open Add Cloth Form
              </Link>
            </div>
          </div>
        </section>
      )}



      {/* FEATURED PRODUCTS — Real products from API */}
      <section id="collections" className="py-20 px-6 bg-gradient-to-br from-amber-50/60 to-rose-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900">Our Collection</h2>
            <p className="text-stone-700 mt-3">Handpicked traditional wear — crafted for elegance and perfect fit.</p>
          </div>

          {loadingProducts ? (
            <div className="text-center text-stone-600 py-12">Loading products...</div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product) => {
                const id = product._id || product.id;
                const image = product.images?.[0] || 'https://placehold.co/600x800?text=SmartStitch';
                const rating = product.rating || 4.5;

                return (
                  <Link
                    key={id}
                    to={`/product/${id}`}
                    className="group rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition block"
                  >
                    <div className="h-72 overflow-hidden">
                      <img src={image} alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    </div>
                    <div className="p-6">
                      <div className="text-xs text-stone-500 mb-1">{product.category}</div>
                      <h3 className="font-bold text-stone-900 mb-2">{product.title || product.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-stone-900">{rating.toFixed?.(1) || rating}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-stone-900">₹{formatInr(product.price)}</div>
                        <span className="px-4 py-2 bg-stone-900 text-white rounded-full text-sm hover:bg-stone-700 transition">View Details</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center text-stone-600 py-12">
              <p className="mb-4">No products in the shop yet.</p>
              <Link to="/shop" className="px-6 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition">Visit Shop</Link>
            </div>
          )}

          {/* View All CTA */}
          {featuredProducts.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/shop" className="inline-flex items-center gap-3 px-8 py-4 bg-rose-600 text-white rounded-full text-lg font-semibold shadow-lg hover:bg-rose-700 hover:shadow-xl transition">
                View All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* VIRTUAL FITTING ROOM CTA */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-lg flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h3 className="text-3xl font-serif font-bold text-stone-900 mb-3">Virtual Fitting Room</h3>
              <p className="text-stone-700 mb-6">Upload your photo and digitally try on any outfit before you buy. Explore our curated collection of high-quality, sustainable apparel with confidence in every click.</p>
              <div className="flex gap-4">
                <Link to="/ai-tryon" className="px-6 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition">Try It On</Link>
                <Link to="/shop" className="px-6 py-3 bg-white/70 border border-white/40 rounded-full">Visit Shop</Link>
              </div>
            </div>
            <div className="w-full md:w-80 h-64 rounded-2xl overflow-hidden shadow-xl">
              <img src="/home/designer_1.png" alt="Traditional Indian Saree" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED DESIGNERS */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-stone-900 text-center mb-8">Traditional Inspirations</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              name: 'Saree Collection',
              desc: 'Timeless elegance in every drape',
              img: '/home/designer_1.png'
            },{
              name: 'Suit Collection',
              desc: 'Modern cuts with traditional charm',
              img: '/home/designer_2.png'
            },{
              name: 'Kurta Collection',
              desc: 'Comfort meets sophisticated style',
              img: '/home/designer_3.png'
            }].map((d, i)=> (
              <Link key={i} to="/shop" className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition block">
                <div className="h-48 overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-stone-900">{d.name}</h4>
                  <p className="text-xs text-stone-700 mt-1">{d.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM INFO BAR */}
      <section className="bg-stone-100 border-t border-stone-300 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6 text-xs uppercase tracking-wider text-stone-600 font-semibold">Why Choose SmartStitch</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[{icon:<Camera className="w-8 h-8"/>, label:'AI Try-On'}, {icon:<Share2 className="w-8 h-8"/>, label:'Easy Returns'}, {icon:<Shirt className="w-8 h-8"/>, label:'Premium Quality'}, {icon:<Scissors className="w-8 h-8"/>, label:'Custom Fit'}, {icon:<Instagram className="w-8 h-8"/>, label:'Style Inspiration'}].map((it, idx)=>(
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white border border-stone-300 rounded-lg flex items-center justify-center mx-auto mb-3 hover:shadow-lg transition">{it.icon}</div>
                <p className="text-xs text-stone-700 font-medium">{it.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-gradient-to-br from-rose-100 to-amber-100 py-12 px-6 border-t border-white/40">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8">
          <div className="bg-amber-200/50 rounded-2xl p-6">
            <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mb-4">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-stone-900 mb-2">SmartStitch</h3>
            <p className="text-sm text-stone-600 mb-3">Your fashion destination</p>
            <Link to="/" className="text-sm text-stone-700 underline">Learn More</Link>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link to="/" className="hover:text-stone-900">Home</Link></li>
              <li><Link to="/shop" className="hover:text-stone-900">Shop</Link></li>
              <li><Link to="/ai-tryon" className="hover:text-stone-900">Try On</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">CUSTOMER SERVICE</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>Contact Us</li>
              <li>Shipping Info</li>
              <li>Returns & Exchange</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">STAY CONNECTED</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-center gap-2"><Instagram className="w-4 h-4" />Follow Us</li>
              <li>Newsletter</li>
              <li className="text-teal-600">Download App</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
