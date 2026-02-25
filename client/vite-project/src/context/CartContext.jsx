import React, { createContext, useState, useEffect, useContext } from 'react';

export const CartContext = createContext();

const GST_RATE = 0.18; // 18% GST

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        const normalized = Array.isArray(parsed)
          ? parsed.map((item) => {
              if (item.variantKey) return item;
              const key = [
                item.id,
                item.size || '',
                item.selectedFabric || '',
                item.selectedColor || '',
                item.selectedDesign || '',
              ].join('|');
              return { ...item, variantKey: key };
            })
          : [];
        setCartItems(normalized);
      } catch (error) {
        console.error('Error parsing stored cart:', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cartItems]);

  // Add item to cart
  const addToCart = (
    product,
    quantity = 1,
    size = '',
    customMeasurements = null,
    options = {}
  ) => {
    const { selectedFabric = '', selectedColor = '', selectedDesign = '' } = options;
    const variantKey = [product._id, size, selectedFabric, selectedColor, selectedDesign].join('|');

    setCartItems((prevItems) => {
      // Check if item already exists
      const existingIndex = prevItems.findIndex(
        (item) => item.variantKey === variantKey
      );

      if (existingIndex !== -1) {
        // Update quantity if item exists
        const updatedItems = [...prevItems];
        updatedItems[existingIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        return [
          ...prevItems,
          {
            id: product._id,
            variantKey,
            name: product.title || product.name,
            price: product.price,
            image: product.images?.[0] || 'https://placehold.co/400x400?text=Product',
            quantity,
            size,
            customMeasurements,
            selectedFabric,
            selectedColor,
            selectedDesign,
            category: product.category,
          },
        ];
      }
    });
  };

  // Remove item from cart
  const removeFromCart = (variantKey) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.variantKey !== variantKey)
    );
  };

  // Update quantity
  const updateQuantity = (variantKey, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(variantKey);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.variantKey === variantKey
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Calculate subtotal
  const getSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  // Calculate GST
  const getGST = () => {
    return getSubtotal() * GST_RATE;
  };

  // Calculate total
  const getTotal = () => {
    return getSubtotal() + getGST();
  };

  // Get cart item count
  const getItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getGST,
    getTotal,
    getItemCount,
    GST_RATE,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;
