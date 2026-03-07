import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Heart,
  ShoppingBag,
  Star,
  Ruler,
  User,
  Check,
  Scissors,
  Camera,
  Share2,
  Shirt,
  Instagram,
  Info,
  Sparkles,
  CheckCircle
} from 'lucide-react';
import { fetchClothById } from '../api/clothApi.js';
import Header from '../components/Header.jsx';
import { useCart } from '../context/CartContext.jsx';
import { dummyProducts } from '../data/dummyProducts.js';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedFabric, setSelectedFabric] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('');
  const [measurementType, setMeasurementType] = useState('standard');
  const [customMeasurements, setCustomMeasurements] = useState({
    neck: '',
    chest: '',
    waist: '',
    hips: '',
    sleeve: '',
    inseam: ''
  });
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savedMeasurements, setSavedMeasurements] = useState(null);
  const [measurementsLoaded, setMeasurementsLoaded] = useState(false);

  const token = localStorage.getItem('token');

  // Fetch saved measurements on mount
  useEffect(() => {
    if (!token) return;
    axios
      .get(`${API_BASE_URL}/measurements/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data?.data;
        if (data && data.length > 0) {
          setSavedMeasurements(data[0]);
        }
      })
      .catch(() => {});
  }, [token]);

  // Load saved measurements into custom fields
  const loadSavedMeasurements = () => {
    if (!savedMeasurements) return;
    setCustomMeasurements({
      neck: savedMeasurements.neck || '',
      chest: savedMeasurements.chest || '',
      waist: savedMeasurements.waist || '',
      hips: savedMeasurements.hips || '',
      sleeve: savedMeasurements.sleeve || '',
      inseam: savedMeasurements.inseam || '',
    });
    setMeasurementsLoaded(true);
    setTimeout(() => setMeasurementsLoaded(false), 3000);
  };

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError('');

    // Check if it's a dummy product
    const dummyProduct = dummyProducts.find(p => p._id === id);
    
    if (dummyProduct) {
      // Use dummy product data
      if (active) {
        setProduct(dummyProduct);
        setSelectedImage(0);
        setSelectedSize('');
        setSelectedFabric('');
        setSelectedColor('');
        setSelectedDesign('');
        setLoading(false);
      }
      return;
    }

    // Otherwise fetch from API
    fetchClothById(id)
      .then((res) => {
        if (!active) return;
        if (res?.success) {
          setProduct(res.data);
          setSelectedImage(0);
          setSelectedSize('');
          setSelectedFabric('');
          setSelectedColor('');
          setSelectedDesign('');
        } else {
          setError('Product not found');
        }
      })
      .catch((err) => {
        if (!active) return;
        setError(err?.response?.data?.message || 'Failed to load product');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  const displayedImages = useMemo(() => {
    // If a design is selected and has an image, show design images
    if (selectedDesign && product?.designs?.length) {
      const designObj = product.designs.find(d => 
        typeof d === 'object' ? d.name === selectedDesign : d === selectedDesign
      );
      if (designObj && designObj.image) {
        return [designObj.image];
      }
    }
    
    if (product?.images?.length) return product.images;
    return ['https://placehold.co/1200x800?text=SmartStitch'];
  }, [product, selectedDesign]);

  const rating = product?.rating ?? 4.5;
  const reviews = product?.reviewsCount ?? 0;
  const price = product?.price ?? 0;
  const originalPrice = product?.originalPrice || Math.round(price * 1.2);
  const features = product?.tags?.length ? product.tags : [
    'Made to fit you',
    'Premium materials',
    'Quality assured'
  ];

  const productName = product?.title || product?.name || 'Product';
  const categoryLabel = product?.category || 'Fashion';
  const description = product?.description || 'Made-to-fit fashion crafted with care by SmartStitch.';
  const availableFabrics = product?.fabrics || [];
  const availableColors = product?.colors || [];
  
  // Convert design objects to display names
  const availableDesigns = useMemo(() => {
    if (!product?.designs?.length) return [];
    return product.designs.map(d => typeof d === 'object' ? d.name : d);
  }, [product]);

  const standardSizes = [
    { 
      size: 'XS', 
      label: 'Extra Small',
      measurements: { neck: 12, chest: 32, waist: 24, hips: 34, sleeve: 22, inseam: 28 }
    },
    { 
      size: 'S', 
      label: 'Small',
      measurements: { neck: 13, chest: 34, waist: 26, hips: 36, sleeve: 23, inseam: 29 }
    },
    { 
      size: 'M', 
      label: 'Medium',
      measurements: { neck: 14, chest: 36, waist: 28, hips: 38, sleeve: 24, inseam: 30 }
    },
    { 
      size: 'L', 
      label: 'Large',
      measurements: { neck: 15, chest: 38, waist: 30, hips: 40, sleeve: 25, inseam: 31 }
    },
    { 
      size: 'XL', 
      label: 'Extra Large',
      measurements: { neck: 16, chest: 40, waist: 32, hips: 42, sleeve: 26, inseam: 32 }
    },
    { 
      size: 'XXL', 
      label: '2X Large',
      measurements: { neck: 17, chest: 44, waist: 36, hips: 46, sleeve: 27, inseam: 33 }
    }
  ];

  const handleCustomMeasurementChange = (field, value) => {
    setCustomMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateSelections = () => {
    if (availableFabrics.length && !selectedFabric) {
      alert('Please select a fabric option');
      return false;
    }
    if (availableColors.length && !selectedColor) {
      alert('Please select a color option');
      return false;
    }
    if (availableDesigns.length && !selectedDesign) {
      alert('Please select a design option');
      return false;
    }
    return true;
  };

  const handleAddToCart = () => {
    if (!product) {
      alert('Product information not available');
      return;
    }

    if (!validateSelections()) return;

    // Validate selections
    if (measurementType === 'standard' && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (measurementType === 'custom') {
      const allFieldsFilled = Object.values(customMeasurements).every(val => val !== '');
      if (!allFieldsFilled) {
        alert('Please fill in all custom measurements');
        return;
      }
    }

    // Add to cart
    addToCart(
      product,
      quantity,
      measurementType === 'standard' ? selectedSize : 'Custom',
      measurementType === 'custom' ? customMeasurements : null,
      {
        selectedFabric,
        selectedColor,
        selectedDesign,
      }
    );

    alert('Added to cart successfully!');
  };

  const handleBuyNow = () => {
    if (!product) {
      alert('Product information not available');
      return;
    }

    if (!validateSelections()) return;

    // Validate selections
    if (measurementType === 'standard' && !selectedSize) {
      alert('Please select a size');
      return;
    }

    if (measurementType === 'custom') {
      const allFieldsFilled = Object.values(customMeasurements).every(val => val !== '');
      if (!allFieldsFilled) {
        alert('Please fill in all custom measurements');
        return;
      }
    }

    // Add to cart
    addToCart(
      product,
      quantity,
      measurementType === 'standard' ? selectedSize : 'Custom',
      measurementType === 'custom' ? customMeasurements : null,
      {
        selectedFabric,
        selectedColor,
        selectedDesign,
      }
    );

    // Navigate to cart
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-rose-50 to-amber-100 relative overflow-x-hidden">
      
      {/* Decorative Background */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-rose-200/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] bg-amber-200/40 rounded-full blur-[180px] pointer-events-none"></div>

      <Header />

      {/* PRODUCT SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center text-stone-700">Loading product...</div>
        ) : error ? (
          <div className="bg-rose-100 border border-rose-200 rounded-2xl p-6 text-rose-700 text-center">
            <p className="mb-3">{error}</p>
            <Link to="/shop" className="text-rose-700 font-semibold underline">Back to Shop</Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* LEFT: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="rounded-3xl overflow-hidden bg-white/70 backdrop-blur-xl border border-white/40 shadow-2xl">
                <img 
                  src={displayedImages[selectedImage]} 
                  alt={productName}
                  className="w-full h-[600px] object-cover"
                />
              </div>

              {/* Thumbnail Gallery */}
              <div className="grid grid-cols-3 gap-4">
                {displayedImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-2xl overflow-hidden border-2 transition ${
                      selectedImage === idx 
                        ? 'border-rose-600' 
                        : 'border-white/40 hover:border-rose-300'
                    }`}
                  >
                    <img src={img} alt={`View ${idx + 1}`} className="w-full h-32 object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT: Product Info & Measurements */}
            <div className="space-y-6">
              
              {/* Product Header */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-stone-600 uppercase tracking-wide">{categoryLabel}</span>
                  <button 
                    onClick={() => setIsFavorite(!isFavorite)}
                    className="p-2 rounded-full bg-white/70 hover:bg-rose-600 hover:text-white transition"
                  >
                    <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
                  </button>
                </div>
                
                <h2 className="text-4xl font-serif font-bold text-stone-900 mb-3">{productName}</h2>
                
                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-stone-700">{rating.toFixed(1)} ({reviews} reviews)</span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-stone-900">₹{price.toLocaleString()}</span>
                  <span className="text-xl text-stone-500 line-through">₹{originalPrice.toLocaleString()}</span>
                  <span className="px-3 py-1 bg-rose-600 text-white text-sm font-semibold rounded-full">
                    {Math.max(0, Math.round((1 - price / originalPrice) * 100))}% OFF
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-6 border border-white/40">
                <p className="text-stone-700 leading-relaxed">{description}</p>
                <ul className="mt-4 space-y-2">
                  {features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-stone-700">
                      <Check className="w-4 h-4 text-rose-600" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customization */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <Scissors className="w-5 h-5 text-rose-600" />
                  <h3 className="text-lg font-bold text-stone-900">Customize Fabric, Color & Design</h3>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-semibold text-stone-800 mb-2">Fabric</p>
                    {availableFabrics.length ? (
                      <div className="flex flex-wrap gap-2">
                        {availableFabrics.map((fabric) => (
                          <button
                            key={fabric}
                            onClick={() => setSelectedFabric(fabric)}
                            className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                              selectedFabric === fabric
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white/70 text-stone-700 border-stone-200 hover:bg-white'
                            }`}
                          >
                            {fabric}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-500">Standard fabric</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-stone-800 mb-2">Color</p>
                    {availableColors.length ? (
                      <div className="flex flex-wrap gap-2">
                        {availableColors.map((color) => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                              selectedColor === color
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white/70 text-stone-700 border-stone-200 hover:bg-white'
                            }`}
                          >
                            {color}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-500">Standard color</p>
                    )}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-stone-800 mb-2">Design</p>
                    {availableDesigns.length ? (
                      <div className="flex flex-wrap gap-2">
                        {availableDesigns.map((design) => (
                          <button
                            key={design}
                            onClick={() => setSelectedDesign(design)}
                            className={`px-3 py-2 rounded-full text-xs font-semibold border transition ${
                              selectedDesign === design
                                ? 'bg-stone-900 text-white border-stone-900'
                                : 'bg-white/70 text-stone-700 border-stone-200 hover:bg-white'
                            }`}
                          >
                            {design}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-stone-500">Standard design</p>
                    )}
                  </div>
                </div>
              </div>

              {/* MEASUREMENT SELECTION */}
              <div className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 border border-white/40 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Ruler className="w-5 h-5 text-rose-600" />
                    <h3 className="text-lg font-bold text-stone-900">Select Size & Measurements</h3>
                  </div>
                  {savedMeasurements && (
                    <span className="text-xs text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded-full font-medium">
                      ✓ Saved measurements available
                    </span>
                  )}
                </div>

                {/* Measurement Type Toggle — 3 tabs */}
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <button
                    onClick={() => setMeasurementType('standard')}
                    className={`px-3 py-3 rounded-xl font-medium text-sm transition ${
                      measurementType === 'standard'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/70 text-stone-700 hover:bg-white'
                    }`}
                  >
                    Standard Sizes
                  </button>
                  <button
                    onClick={() => {
                      setMeasurementType('custom');
                      if (savedMeasurements && !customMeasurements.chest) loadSavedMeasurements();
                    }}
                    className={`px-3 py-3 rounded-xl font-medium text-sm transition ${
                      measurementType === 'custom'
                        ? 'bg-rose-600 text-white'
                        : 'bg-white/70 text-stone-700 hover:bg-white'
                    }`}
                  >
                    Custom Fit
                  </button>
                  <button
                    onClick={() => navigate('/ai-tryon')}
                    className="px-3 py-3 rounded-xl font-medium text-sm transition flex items-center justify-center gap-1.5 bg-white/70 text-stone-700 hover:bg-white"
                  >
                    <Sparkles className="w-4 h-4" />
                    AI Measure
                  </button>
                </div>

                {/* Success banner when measurements loaded */}
                {measurementsLoaded && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-700 font-medium">Measurements loaded successfully!</span>
                  </div>
                )}

                {/* STANDARD SIZES */}
                {measurementType === 'standard' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-3">
                      {standardSizes.map(({ size, label }) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-3 rounded-xl font-semibold transition ${
                            selectedSize === size
                              ? 'bg-stone-900 text-white'
                              : 'bg-white/70 text-stone-700 hover:bg-white border border-stone-200'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>

                    {/* Size Guide */}
                    {selectedSize && (
                      <div className="bg-amber-50/80 rounded-xl p-4 border border-amber-200">
                        <h4 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Size {selectedSize} Measurements (inches)
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          {Object.entries(standardSizes.find(s => s.size === selectedSize)?.measurements || {}).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-stone-600 capitalize">{key}:</span>
                              <span className="font-semibold text-stone-900">{value}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* CUSTOM MEASUREMENTS */}
                {measurementType === 'custom' && (
                  <div className="space-y-4">
                    <div className="bg-blue-50/80 rounded-xl p-4 border border-blue-200 mb-4">
                      <p className="text-sm text-blue-900 flex items-start gap-2">
                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>Enter your measurements in inches for a perfect custom fit. Your garment is created using these exact specifications.</span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { key: 'neck', label: 'Neck', placeholder: 'e.g., 14' },
                        { key: 'chest', label: 'Chest', placeholder: 'e.g., 36' },
                        { key: 'waist', label: 'Waist', placeholder: 'e.g., 28' },
                        { key: 'hips', label: 'Hips', placeholder: 'e.g., 38' },
                        { key: 'sleeve', label: 'Sleeve', placeholder: 'e.g., 24' },
                        { key: 'inseam', label: 'Inseam', placeholder: 'e.g., 30' }
                      ].map(({ key, label, placeholder }) => (
                        <div key={key}>
                          <label className="block text-sm font-medium text-stone-700 mb-2">
                            {label}
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              step="0.5"
                              placeholder={placeholder}
                              value={customMeasurements[key]}
                              onChange={(e) => handleCustomMeasurementChange(key, e.target.value)}
                              className="w-full px-4 py-2 pr-10 bg-white/70 border border-stone-200 rounded-xl text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-600/50"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm">in</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {savedMeasurements && (
                      <button
                        onClick={loadSavedMeasurements}
                        className="w-full py-2 text-sm text-rose-600 hover:text-rose-700 font-medium flex items-center justify-center gap-2"
                      >
                        <User className="w-4 h-4" />
                        Load Saved Measurements
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 bg-white/70 border border-stone-200 rounded-full flex items-center justify-center hover:bg-white transition"
                    >
                      -
                    </button>
                    <span className="w-12 text-center font-semibold text-stone-900">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 bg-white/70 border border-stone-200 rounded-full flex items-center justify-center hover:bg-white transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="px-6 py-4 bg-white/70 border border-stone-300 text-stone-900 rounded-full font-semibold hover:bg-white transition flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5" />
                    Add to Wishlist
                  </button>
                  <button 
                    onClick={handleAddToCart}
                    className="px-6 py-4 bg-rose-600 text-white rounded-full font-semibold hover:bg-rose-700 transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </button>
                </div>

                <button 
                  onClick={handleBuyNow}
                  className="w-full px-6 py-4 bg-stone-900 text-white rounded-full font-semibold hover:bg-stone-700 transition shadow-lg"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* BOTTOM INFO BAR */}
      <section className="bg-stone-100 border-t border-stone-300 py-10 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-6 text-xs uppercase tracking-wider text-stone-600 font-semibold">
            Why Choose SmartStitch
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
      <footer className="bg-gradient-to-br from-rose-100 to-amber-100 py-12 px-6 border-t border-white/40">
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