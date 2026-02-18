import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  // Load cart from localStorage or server
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Use localStorage for guest cart
      const localCart = localStorage.getItem('guestCart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      }
    }
  }, [isAuthenticated]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated && cartItems.length > 0) {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  }, [cartItems, isAuthenticated]);

  const handleAuthError = (error) => {
    if (error.message && (
      error.message.includes('Not authorized') ||
      error.message.includes('user not found') ||
      error.message.includes('jwt expired')
    )) {
      logout();
      return true;
    }
    return false;
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const cart = await cartAPI.get();
      setCartItems(cart.items || []);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!product || !product._id) {
      console.error('Attempted to add invalid product to cart:', product);
      return;
    }

    if (isAuthenticated) {
      try {
        const cart = await cartAPI.addItem(product._id, quantity);
        setCartItems(cart.items || []);
      } catch (error) {
        console.error('Failed to add to cart:', error);
        if (!handleAuthError(error)) {
          throw error;
        }
      }
    } else {
      // Guest cart logic
      setCartItems((prevItems) => {
        // Filter out invalid items first
        const validItems = prevItems.filter(item => item && item.product);

        const existingItem = validItems.find(
          (item) => item.product._id === product._id
        );

        if (existingItem) {
          return validItems.map((item) =>
            item.product._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        return [...validItems, { product, quantity }];
      });
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (isAuthenticated) {
      try {
        const cart = await cartAPI.updateItem(productId, quantity);
        setCartItems(cart.items || []);
      } catch (error) {
        console.error('Failed to update quantity:', error);
        if (!handleAuthError(error)) {
          throw error;
        }
      }
    } else {
      if (quantity <= 0) {
        removeFromCart(productId);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item && item.product && item.product._id === productId
              ? { ...item, quantity }
              : item
          )
        );
      }
    }
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const cart = await cartAPI.removeItem(productId);
        setCartItems(cart.items || []);
      } catch (error) {
        console.error('Failed to remove from cart:', error);
        if (!handleAuthError(error)) {
          throw error;
        }
      }
    } else {
      setCartItems((prevItems) =>
        prevItems.filter(
          (item) => item.product?._id !== productId && item.product !== productId
        )
      );
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartAPI.clear();
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        if (!handleAuthError(error)) {
          throw error;
        }
      }
    } else {
      setCartItems([]);
      localStorage.removeItem('guestCart');
    }
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.product?.price || 0;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  const value = {
    cartItems,
    loading,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
