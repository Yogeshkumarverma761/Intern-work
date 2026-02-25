// Soft Luxury Edition Home Page — Complete
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/UserContext.jsx';
import Header from '../components/Header.jsx';
import {
  Share2,
  ChevronLeft,
  ChevronRight,
  Camera,
  Scissors,
  Shirt,
  Instagram,
  MapPin
} from 'lucide-react';

export default function Home() {
  // removed local-only isSignedIn state; use global user context
  const { user, setUser } = useContext(UserDataContext);
  const navigate = useNavigate();

  // consider user signed in when we have user.email or a stored token
  const isSignedIn = Boolean(user && localStorage.getItem('token'));


  const handleSignOut = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const categories = [
    {
      title: 'Casual Wear',
      img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Elegant Dresses',
      img: 'https://images.unsplash.com/photo-1520975698519-59c07a1ffdfb?auto=format&fit=crop&w=900&q=80'
    },
    {
      title: 'Accessories',
      img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80'
    }
  ];

  const products = [
    {
      name: 'Floral Satin Dress',
      img: 'https://images.unsplash.com/photo-1520975918319-7c55f0e8b2ac?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Pastel Pink Kurti',
      img: 'https://images.unsplash.com/photo-1542060749-829c5fbda293?auto=format&fit=crop&w=1000&q=80'
    },
    {
      name: 'Chiffon Evening Gown',
      img: 'https://images.unsplash.com/photo-1487412912498-0447578fcca8?auto=format&fit=crop&w=1200&q=80'
    }
  ];

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
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight">Try Before You Stitch — <span className="text-rose-600 italic">Powered by AI</span></h2>
          <p className="text-lg text-stone-700 max-w-md">Upload your picture, try outfits instantly using our AI try-on, then place your order for a perfect fit. Luxury meets precision.</p>

          <div className="flex gap-4 items-center">
            <Link to="/tryon" className="inline-flex items-center gap-3 px-6 py-3 bg-rose-600 text-white rounded-full shadow-lg hover:bg-rose-700 transition">Try On Now</Link>
            <a href="#collections" className="inline-flex items-center gap-3 px-6 py-3 bg-white/70 backdrop-blur-md border border-white/40 text-stone-900 rounded-full shadow transition">Explore Collection</a>
          </div>
        </div>

        {/* Right: wide editorial image */}
        <div className="rounded-3xl overflow-hidden shadow-2xl">
          <img src="https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1600&q=80" alt="editorial" className="w-full h-full object-cover" />
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

      {/* CATEGORIES / CLOTH SECTION */}
      <section id="categories" className="py-12 px-6">
        <div className="max-w-7xl mx-auto text-center mb-8">
          <h3 className="text-3xl font-serif font-bold text-stone-900">Shop By Category</h3>
          <p className="text-stone-700 mt-2">From casual days to special evenings — find your perfect style.</p>
        </div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <div key={idx} className="group rounded-3xl overflow-hidden bg-white/60 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl transition">
              <div className="h-64 overflow-hidden">
                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="p-6 text-center">
                <h4 className="font-bold text-stone-900 text-xl">{cat.title}</h4>
                <p className="text-sm text-stone-700 mt-2">Explore curated styles</p>
                <button className="mt-4 px-5 py-2 bg-rose-600 text-white rounded-full text-sm hover:bg-rose-700 transition">Shop {cat.title.split(' ')[0]}</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* COLLECTIONS SECTION — show products */}
      <section id="collections" className="py-20 px-6 bg-gradient-to-br from-amber-50/60 to-rose-50/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900">Spring Collection</h2>
            <p className="text-stone-700 mt-3">Selected pieces from our latest drop — curated for elegance.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature large */}
            <div className="md:col-span-1 md:row-span-2 rounded-3xl overflow-hidden shadow-2xl">
              <img src={products[2].img} alt={products[2].name} className="w-full h-full object-cover" />
            </div>

            {/* Product cards */}
            {products.slice(0,2).map((p, idx) => (
              <div key={idx} className="rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl shadow-lg hover:shadow-2xl transition">
                <div className="h-64 overflow-hidden">
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover hover:scale-105 transition duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-stone-900 mb-2">{p.name}</h3>
                  <p className="text-stone-600 text-sm">Premium Couture Collection</p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm font-semibold text-stone-900">₹2,499</div>
                    <button className="px-4 py-2 bg-stone-900 text-white rounded-full text-sm hover:bg-stone-700 transition">Shop</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Shop feature area */}
            <div className="md:col-span-2 bg-white/70 backdrop-blur-xl rounded-3xl p-10 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-3xl font-serif font-bold text-stone-900 mb-3">Shop Your Elegant, Intermitrol & Alike</h3>
                <p className="text-stone-700 mb-6">Natural your look — stylish pieces and couture-ready craftsmanship to make your wardrobe exceptional.</p>
                <div className="flex gap-4">
                  <button className="px-6 py-3 bg-rose-600 text-white rounded-full hover:bg-rose-700 transition">Visit Shop</button>
                  <button className="px-6 py-3 bg-white/70 border border-white/40 rounded-full">View All</button>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-3">
                <button className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center shadow"><ChevronLeft className="w-4 h-4" /></button>
                <div className="text-xs text-stone-600">All Posts</div>
                <button className="w-10 h-10 bg-white/70 rounded-full flex items-center justify-center shadow"><ChevronRight className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DESIGNER / FEATURE CARDS */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-serif font-bold text-stone-900 text-center mb-8">Featured Designers</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[{
              name: 'João Petoleur',
              desc: 'Characteristic Elemental Elempton',
              img: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80'
            },{
              name: 'Elit Ackaour',
              desc: 'Definitivous nictlit, UI EU',
              img: 'https://images.unsplash.com/photo-1520975918319-7c55f0e8b2ac?auto=format&fit=crop&w=800&q=80'
            },{
              name: 'Eight Unique',
              desc: 'Eleistic in visual built Majorus',
              img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'
            }].map((d, i)=> (
              <div key={i} className="bg-white/70 backdrop-blur-xl rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
                <div className="h-48 overflow-hidden">
                  <img src={d.img} alt={d.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4 text-center">
                  <h4 className="font-bold text-stone-900">{d.name}</h4>
                  <p className="text-xs text-stone-700 mt-1">{d.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM INFO BAR */}
      <section className="bg-stone-100 border-t border-stone-300 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6 text-xs uppercase tracking-wider text-stone-600 font-semibold">EMPRENDED FASHION</div>
          <div className="grid grid-cols-5 gap-6">
            {[{icon:<Camera className="w-8 h-8"/>, label:'Experiencia Smart'}, {icon:<Share2 className="w-8 h-8"/>, label:'Sencillez e Intuitiva'}, {icon:<Shirt className="w-8 h-8"/>, label:'Rendimiento y dificulta'}, {icon:<Scissors className="w-8 h-8"/>, label:'Designative Interface'}, {icon:<Instagram className="w-8 h-8"/>, label:'Eficacia e Interfaz'}].map((it, idx)=>(
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
            <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mb-4"><Scissors className="w-6 h-6 text-white"/></div>
            <h3 className="font-bold text-stone-900 mb-2">Información</h3>
            <p className="text-sm text-stone-600 mb-3">FASHION recibir noticias</p>
            <a href="#" className="text-sm text-stone-700 underline">Descargar ahora</a>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">BÚSQUEDA FÁCIL</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>Estos sobre Sply articles</li>
              <li>Entre dissenthuts gratis</li>
              <li className="flex items-center gap-2"><MapPin className="w-3 h-3"/>Entitius magnisculos</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">ACCOUNT DETAILS</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>Business terms fácil garantizadas</li>
              <li>Deseable términos finales</li>
              <li>Consumo selecta Habilitate</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">GUSTO PARA OCULEAR. 🔍</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>M Consentired major Andalucía</li>
              <li>Revistamos Conto Colateral</li>
              <li className="text-teal-600">Descartar ahora gratis</li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}
