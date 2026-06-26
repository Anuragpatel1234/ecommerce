import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext();

const getInitialToken = () => {
  try {
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  } catch (error) {
    return null;
  }
};

const initialState = {
  user: null,
  token: getInitialToken(),
  cart: { items: [], totalAmount: 0 },
  wishlist: [],
  currency: 'INR',
  loading: false,
  error: null
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error removing token from localStorage:', error);
      }
      return { ...state, user: null, token: null, cart: { items: [], totalAmount: 0 }, wishlist: [] };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Set axios default headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['x-auth-token'] = state.token;
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', state.token);
        }
      } catch (error) {
        console.error('Error setting token in localStorage:', error);
      }
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Error removing token from localStorage:', error);
      }
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    }
  }, []);

  const loadUser = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get('http://localhost:5000/api/auth/profile');
      dispatch({ type: 'SET_USER', payload: res.data });
      loadCart();
      loadWishlist();
    } catch (error) {
      console.error('Error loading user:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      dispatch({ type: 'SET_TOKEN', payload: res.data.token });
      dispatch({ type: 'SET_USER', payload: res.data.user });
      loadCart();
      loadWishlist();
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.post('http://localhost:5000/api/auth/register', userData);
      dispatch({ type: 'SET_TOKEN', payload: res.data.token });
      dispatch({ type: 'SET_USER', payload: res.data.user });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const loadCart = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/cart');
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const addToCart = async (productId, quantity = 1, size, color) => {
    try {
      const res = await axios.post('http://localhost:5000/api/cart/add', {
        productId,
        quantity,
        size,
        color
      });
      dispatch({ type: 'SET_CART', payload: res.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      return { success: false, message };
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/wishlist');
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const res = await axios.post(`http://localhost:5000/api/wishlist/add/${productId}`);
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      return { success: false, message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.delete(`http://localhost:5000/api/wishlist/remove/${productId}`);
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      return { success: false, message };
    }
  };

  const subscribeNewsletter = async (email) => {
    try {
      await axios.post('http://localhost:5000/api/newsletter/subscribe', { email });
      return { success: true, message: 'Successfully subscribed to newsletter!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Subscription failed';
      return { success: false, message };
    }
  };

  const setCurrency = (currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  };

  const clearError = () => {
    dispatch({ type: 'SET_ERROR', payload: null });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    loadCart,
    addToCart,
    loadWishlist,
    addToWishlist,
    removeFromWishlist,
    subscribeNewsletter,
    setCurrency,
    clearError
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};