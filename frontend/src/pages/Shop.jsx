import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Heart,
  ShoppingBag,
  Instagram,
  SlidersHorizontal,
  ChevronDown,
  Star,
  Scissors,
  Camera,
  Share2,
  Shirt
} from 'lucide-react';
import { fetchClothes, fetchShopMeta } from '../api/clothApi.js';
import Header from '../components/Header.jsx';
import { useCart } from '../context/CartContext.jsx';
import { dummyProducts } from '../data/dummyProducts.js';

const priceRanges = [
  { label: 'All', value: 'all' },
  { label: 'Under ₹2,000', value: 'under-2000' },
  { label: '₹2,000 - ₹5,000', value: '2000-5000' },
  { label: '₹5,000 - ₹10,000', value: '5000-10000' },
  { label: 'Above ₹10,000', value: 'above-10000' },
];

const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Popular', value: 'popular' },
];

const formatInr = (amount) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(amount || 0);

export default function Shop() {
  const { addToCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState(() => new Set());
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pageSize: 12, totalPages: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [meta, setMeta] = useState({ categories: [], priceRange: { minPrice: 0, maxPrice: 0 }, tags: [] });

  const categories = useMemo(() => ['All', ...(meta?.categories || [])], [meta]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [selectedCategory, priceRange, search, sortBy]);

  useEffect(() => {
    fetchShopMeta()
      .then((res) => {
        if (res?.success) setMeta(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const params = {
          sort: sortBy,
          page: pagination.page,
          limit: pagination.pageSize,
        };

        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (priceRange && priceRange !== 'all') {
          params.priceRange = priceRange;
        }
        if (search.trim()) {
          params.search = search.trim();
        }

        const res = await fetchClothes(params, { signal: controller.signal });
        let allProducts = res?.data || [];
        
        // Add dummy products to the first page if no filters are applied and no search
        if (pagination.page === 1 && !search.trim() && (selectedCategory === 'All' || !selectedCategory)) {
          allProducts = [...dummyProducts, ...allProducts];
        }
        
        setProducts(allProducts);
        if (res?.pagination) {
          setPagination(res.pagination);
        }
      } catch (err) {
        if (err.name !== 'CanceledError') {
          setError(err?.response?.data?.message || 'Failed to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    load();
    return () => controller.abort();
  }, [selectedCategory, priceRange, sortBy, search, pagination.page, pagination.pageSize]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handlePageChange = (direction) => {
    setPagination((prev) => {
      const nextPage = direction === 'next' ? prev.page + 1 : prev.page - 1;
      if (nextPage < 1 || (prev.totalPages && nextPage > prev.totalPages)) return prev;
      return { ...prev, page: nextPage };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 relative overflow-x-hidden">
      
      {/* Decorative Background Shapes */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-amber-200/40 rounded-full blur-[180px] pointer-events-none"></div>

      <Header />

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-16 pb-12 z-10">
        <div className="text-center mb-8">
          <h2 className="text-5xl md:text-6xl font-serif font-bold text-stone-900 leading-tight mb-4">
            Discover Your <span className="text-rose-600 italic">Perfect Style</span>
          </h2>
          <p className="text-lg text-stone-700 max-w-2xl mx-auto">
            Curated collections of elegant clothing and accessories, handpicked for the discerning fashionista.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
            <input
              type="text"
              placeholder="Search for dresses, accessories, styles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/70 backdrop-blur-xl border border-white/40 rounded-full text-stone-900 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-rose-600/50 shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* FILTERS & SORTING */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="flex flex-wrap gap-4 items-center justify-between bg-white/60 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-lg">
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-5 py-2 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Category Tabs */}
          <div className="hidden md:flex items-center gap-2 overflow-x-auto flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white'
                    : 'bg-white/70 text-stone-700 hover:bg-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none px-5 py-2 pr-10 bg-white/70 backdrop-blur-md border border-white/40 rounded-full text-sm text-stone-900 hover:bg-white transition cursor-pointer focus:outline-none"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-600 pointer-events-none" />
          </div>
        </div>

        {/* Expandable Filters Panel */}
        {showFilters && (
          <div className="mt-4 bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Price Range */}
              <div>
                <h4 className="font-bold text-stone-900 mb-3">Price Range</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label key={range.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="priceRange"
                        checked={priceRange === range.value}
                        onChange={() => setPriceRange(range.value)}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-600"
                      />
                      <span className="text-sm text-stone-700">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Categories */}
              <div className="md:hidden">
                <h4 className="font-bold text-stone-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-rose-600 focus:ring-rose-600"
                      />
                      <span className="text-sm text-stone-700">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-stone-700">
            Showing <span className="font-semibold text-stone-900">{products.length}</span> of {pagination.total + 3} products
          </p>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePageChange('prev')}
              disabled={pagination.page <= 1}
              className="px-3 py-2 rounded-full bg-white/70 border border-white/60 text-sm disabled:opacity-50"
            >
              Prev
            </button>
            <div className="text-sm text-stone-700">Page {pagination.page} / {pagination.totalPages || 1}</div>
            <button
              onClick={() => handlePageChange('next')}
              disabled={pagination.totalPages && pagination.page >= pagination.totalPages}
              className="px-3 py-2 rounded-full bg-white/70 border border-white/60 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-rose-100 border border-rose-200 text-rose-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-stone-600">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-stone-600">No products found for this selection.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
              const id = product._id || product.id;
              const image = product.images?.[0] || product.img || "https://placehold.co/600x800?text=SmartStitch";
              const rating = product.rating || 4.5;
              const reviews = product.reviewsCount ?? product.reviews ?? 0;
              const tag = product.tags?.[0] || (product.isFeatured ? 'Featured' : null);

              return (
                <div
                  key={id}
                  className="group rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:shadow-2xl transition"
                >
                  {/* Product Image */}
                  <div className="relative h-80 overflow-hidden">
                    <img
                      src={image}
                      alt={product.title || product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    
                    {/* Tag */}
                    {tag && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-rose-600 text-white text-xs font-semibold rounded-full">
                        {tag}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition">
                      <button 
                        onClick={() => toggleFavorite(id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition ${
                          favorites.has(id)
                            ? 'bg-rose-600 text-white'
                            : 'bg-white hover:bg-rose-600 hover:text-white'
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${favorites.has(id) ? 'fill-current' : ''}`} />
                      </button>
                      <button 
                        onClick={() => {
                          addToCart(product, 1, 'M', null, {});
                          alert('Added to cart!');
                        }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 hover:text-white transition"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="text-xs text-stone-600 mb-2">{product.category}</div>
                    <h3 className="font-bold text-stone-900 text-lg mb-2">{product.title || product.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-semibold text-stone-900">{rating.toFixed(1)}</span>
                      </div>
                      <span className="text-xs text-stone-600">({reviews} reviews)</span>
                    </div>

                    {/* Price & CTA */}
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-stone-900">₹{formatInr(product.price)}</div>
                      <Link
                        to={`/product/${id}`}
                        className="px-5 py-2 bg-stone-900 text-white rounded-full text-sm font-semibold hover:bg-stone-700 transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="bg-gradient-to-r from-rose-600 to-amber-500 rounded-3xl p-12 text-center text-white shadow-2xl">
          <h3 className="text-4xl font-serif font-bold mb-4">Not Sure What to Choose?</h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Try our AI-powered virtual try-on to see how clothes look on you before making a decision!
          </p>
          <button className="inline-flex items-center gap-3 px-8 py-4 bg-white text-rose-600 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition">
            <Camera className="w-5 h-5" />
            Try AI Virtual Try-On
          </button>
        </div>
      </section>

      {/* BOTTOM INFO BAR */}
      <section className="bg-stone-100 border-t border-stone-300 py-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6 text-xs uppercase tracking-wider text-stone-600 font-semibold">
            Why Shop With Us
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <Camera className="w-8 h-8" />, label: 'AI Try-On' },
              { icon: <Share2 className="w-8 h-8" />, label: 'Easy Returns' },
              { icon: <Shirt className="w-8 h-8" />, label: 'Premium Quality' },
              { icon: <Scissors className="w-8 h-8" />, label: 'Custom Fit' },
              { icon: <Instagram className="w-8 h-8" />, label: 'Style Inspiration' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-16 h-16 bg-white border border-stone-300 rounded-lg flex items-center justify-center mx-auto mb-3 hover:shadow-lg transition">
                  {item.icon}
                </div>
                <p className="text-xs text-stone-700 font-medium">{item.label}</p>
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
            <a href="#" className="text-sm text-stone-700 underline">Learn More</a>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 mb-4">QUICK LINKS</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><a href="#" className="hover:text-stone-900">Home</a></li>
              <li><a href="#" className="hover:text-stone-900">Shop</a></li>
              <li><a href="#" className="hover:text-stone-900">Try On</a></li>
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