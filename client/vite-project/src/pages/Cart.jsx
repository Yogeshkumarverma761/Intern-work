import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowLeft, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import Header from '../components/Header.jsx';

const formatInr = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount || 0);

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getGST,
    getTotal,
    GST_RATE,
  } = useCart();
  
  const navigate = useNavigate();

  const handleConfirmOrder = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!');
      return;
    }
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
          <div className="container mx-auto px-4 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-white rounded-2xl shadow-lg p-12">
                <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Your Cart is Empty
                </h2>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added anything to your cart yet.
                  <br />
                  Start shopping to find the perfect outfit!
                </p>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <ShoppingBag className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-semibold mb-4 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
              <ShoppingBag className="w-10 h-10 text-purple-600" />
              Shopping Cart
            </h1>
            <p className="text-gray-600 mt-2">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.variantKey}
                  className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-grow">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                          {item.size && (
                            <p className="text-sm text-gray-600 mt-1">
                              Size: <span className="font-semibold">{item.size}</span>
                            </p>
                          )}
                          {(item.selectedFabric || item.selectedColor || item.selectedDesign) && (
                            <p className="text-xs text-gray-600 mt-1">
                              {item.selectedFabric && `Fabric: ${item.selectedFabric}`} 
                              {item.selectedColor && ` • Color: ${item.selectedColor}`} 
                              {item.selectedDesign && ` • Design: ${item.selectedDesign}`}
                            </p>
                          )}
                          {item.customMeasurements && (
                            <p className="text-xs text-purple-600 mt-1">
                              Custom measurements applied
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item.variantKey)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Price and Quantity */}
                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-2">
                          <button
                            onClick={() => updateQuantity(item.variantKey, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-purple-100 transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-12 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.variantKey, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-white rounded-lg hover:bg-purple-100 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Price per item</p>
                          <p className="text-xl font-bold text-purple-600">
                            {formatInr(item.price)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">{formatInr(getSubtotal())}</span>
                  </div>

                  <div className="flex justify-between text-gray-600">
                    <span>GST ({Math.round(GST_RATE * 100)}%)</span>
                    <span className="font-semibold">{formatInr(getGST())}</span>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800">Total</span>
                      <span className="text-2xl font-bold text-purple-600">
                        {formatInr(getTotal())}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleConfirmOrder}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout powered by SmartStitch
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
