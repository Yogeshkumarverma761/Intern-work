import React, { useContext, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, MapPin, CreditCard, Banknote, Landmark } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { UserDataContext } from '../context/UserContext.jsx';
import Header from '../components/Header.jsx';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const formatInr = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function Checkout() {
  const { cartItems, getSubtotal, getGST, getTotal, clearCart } = useCart();
  const { user } = useContext(UserDataContext);
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [gettingLocation, setGettingLocation] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');

  const totalAmount = getTotal();
  const payableNow = useMemo(() => Math.round((totalAmount || 0) * 0.4), [totalAmount]);
  const payableLater = useMemo(() => Math.max((totalAmount || 0) - payableNow, 0), [totalAmount, payableNow]);

  const handleGetLocation = () => {
    setGettingLocation(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setGettingLocation(false);
      },
      (error) => {
        setError('Unable to retrieve your location. Please try again.');
        setGettingLocation(false);
      }
    );
  };

  const handleConfirmOrder = async () => {
    if (!user) {
      setError('Please login to place an order');
      setTimeout(() => navigate('/login'), 2000);
      return;
    }

    if (!paymentMethod) {
      setError('Please choose a payment method to proceed');
      return;
    }

    if (!location.lat || !location.lng) {
      setError('Please share your location to proceed');
      return;
    }

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');

      // Handle dummy products locally (no server-side order creation needed)
      const hasDummyItems = cartItems.some((item) => item.id?.startsWith('dummy-'));
      if (hasDummyItems) {
        clearCart();
        alert('Payment confirmed! Your order has been placed successfully.');
        navigate('/');
        return;
      }
      
      // Create order with cart items
      const orderData = {
        items: cartItems.map((item) => ({
          clothId: item.id,
          quantity: item.quantity,
          size: item.size,
          selectedFabric: item.selectedFabric,
          selectedColor: item.selectedColor,
          selectedDesign: item.selectedDesign,
          customMeasurements: item.customMeasurements,
          price: item.price,
        })),
        lat: location.lat,
        lng: location.lng,
        subtotal: getSubtotal(),
        gst: getGST(),
        total: totalAmount,
        paymentMethod,
        paidAmount: payableNow,
        remainingAmount: payableLater,
      };

      const response = await axios.post(
        `${API_BASE_URL}/orders/create-cart-order`,
        orderData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        clearCart();
        alert('Payment confirmed! Your order has been sent to the admin.');
        navigate('/');
      } else {
        setError(response.data.message || 'Failed to create order');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Checkout</h1>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6">
                {error}
              </div>
            )}

            {/* Order Items Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-purple-600" />
                Order Items ({cartItems.length})
              </h2>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div
                    key={item.variantKey}
                    className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600">
                          {item.size && `Size: ${item.size} • `}Qty: {item.quantity}
                        </p>
                        {(item.selectedFabric || item.selectedColor || item.selectedDesign) && (
                          <p className="text-xs text-gray-500">
                            {item.selectedFabric && `Fabric: ${item.selectedFabric}`}
                            {item.selectedColor && ` • Color: ${item.selectedColor}`}
                            {item.selectedDesign && ` • Design: ${item.selectedDesign}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <p className="font-bold text-purple-600">
                      {formatInr(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6 text-purple-600" />
                Delivery Location
              </h2>
              <p className="text-gray-600 mb-4">
                We need your location to confirm delivery availability
              </p>
              {location.lat && location.lng ? (
                <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-lg">
                  <Check className="w-5 h-5" />
                  <span>Location captured successfully</span>
                </div>
              ) : (
                <button
                  onClick={handleGetLocation}
                  disabled={gettingLocation}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gettingLocation ? 'Getting Location...' : 'Share My Location'}
                </button>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold">{formatInr(getSubtotal())}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (18%)</span>
                  <span className="font-semibold">{formatInr(getGST())}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total</span>
                    <span className="text-2xl font-bold text-purple-600">
                      {formatInr(totalAmount)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment</h2>
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-5">
                <div className="flex justify-between text-sm text-indigo-900">
                  <span>Pay now (40%)</span>
                  <span className="font-semibold">{formatInr(payableNow)}</span>
                </div>
                <div className="flex justify-between text-sm text-indigo-900 mt-2">
                  <span>Pay on delivery</span>
                  <span className="font-semibold">{formatInr(payableLater)}</span>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`border rounded-xl p-4 text-left transition-all ${
                    paymentMethod === 'upi'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <Banknote className="w-5 h-5 text-indigo-600" />
                    UPI
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Pay using UPI ID or QR (demo only).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`border rounded-xl p-4 text-left transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <CreditCard className="w-5 h-5 text-indigo-600" />
                    Card
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    Debit/Credit card (demo only).
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`border rounded-xl p-4 text-left transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="flex items-center gap-2 text-gray-800 font-semibold">
                    <Landmark className="w-5 h-5 text-indigo-600" />
                    Bank Transfer
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    NEFT/IMPS/RTGS (demo only).
                  </p>
                </button>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmOrder}
              disabled={loading || !location.lat || !location.lng || !paymentMethod}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Confirming Payment...' : `Confirm Payment (${formatInr(payableNow)})`}
            </button>

            <p className="text-sm text-gray-600 text-center mt-4">
              By confirming, you agree to our terms and conditions
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
