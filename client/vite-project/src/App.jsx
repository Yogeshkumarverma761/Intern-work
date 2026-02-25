import React from "react";
import { Routes, Route } from "react-router-dom";

import { Home, SignUp, Login, UserProfile, Shop, ProductDetail, AdminClothForm, AITryOn } from "./index.js";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";

import UserContext from "./context/UserContext.jsx";
import CartProvider from "./context/CartContext.jsx";
import UserProtectedWrapper from "./pages/UserProtectedWrapper.jsx";

export default function App() {
  return (
    <UserContext>
      <CartProvider>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin/cloths/new" element={<AdminClothForm />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* USER-PROTECTED ROUTES */}
          <Route
            path="/profile"
            element={
              <UserProtectedWrapper>
                <UserProfile />
              </UserProtectedWrapper>
            }
          />
          
          <Route
            path="/checkout"
            element={
              <UserProtectedWrapper>
                <Checkout />
              </UserProtectedWrapper>
            }
          />
          
          <Route
            path="/ai-tryon"
            element={
              <UserProtectedWrapper>
                <AITryOn />
              </UserProtectedWrapper>
            }
          />

        </Routes>
      </CartProvider>
    </UserContext>
  );
}
