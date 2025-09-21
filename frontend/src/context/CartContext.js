import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

// Create cart context
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalItems: 0, totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { currentUser } = useContext(AuthContext);

  // Fetch cart whenever user changes
  useEffect(() => {
    if (currentUser) {
      fetchCart();
    } else {
      // Clear cart when user logs out
      setCart({ items: [], totalItems: 0, totalPrice: 0 });
    }
  }, [currentUser]);

  // Fetch user's cart
  const fetchCart = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.get('/api/cart');
      if (data.success) {
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      setError('Failed to fetch cart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, size = null, color = null) => {
    if (!currentUser) {
      setError('Please login to add items to cart');
      return false;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.post('/api/cart', {
        productId,
        quantity,
        size,
        color
      });
      
      if (data.success) {
        setCart(data.cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Failed to add item to cart. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId, quantity, size = null, color = null) => {
    if (!currentUser) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.put(`/api/cart/${productId}`, {
        quantity,
        size,
        color
      });
      
      if (data.success) {
        setCart(data.cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating cart:', error);
      setError('Failed to update cart. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId, size = null, color = null) => {
    if (!currentUser) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.delete(`/api/cart/${productId}`, {
        data: { size, color }
      });
      
      if (data.success) {
        setCart(data.cart);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Failed to remove item from cart. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!currentUser) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await api.delete('/api/cart');
      
      if (data.success) {
        setCart({ items: [], totalItems: 0, totalPrice: 0 });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error clearing cart:', error);
      setError('Failed to clear cart. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

