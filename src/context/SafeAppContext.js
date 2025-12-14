import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const AppContext = createContext();

// Safe localStorage operations
const safeLocalStorage = {
  getItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch (error) {
      console.warn('localStorage getItem failed:', error);
    }
    return null;
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn('localStorage setItem failed:', error);
    }
  },
  removeItem: (key) => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn('localStorage removeItem failed:', error);
    }
  }
};

const initialState = {
  user: null,
  token: safeLocalStorage.getItem('token'),
  location: JSON.parse(safeLocalStorage.getItem('location') || 'null'),
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
      // If user has address, sync it to location state
      let userLocation = state.location;
      if (action.payload && action.payload.address && action.payload.address.zipCode) {
        userLocation = {
          pincode: action.payload.address.zipCode,
          city: action.payload.address.city,
          state: action.payload.address.state
        };
        safeLocalStorage.setItem('location', JSON.stringify(userLocation));
      }
      return { ...state, user: action.payload, location: userLocation, loading: false };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'LOGOUT':
      safeLocalStorage.removeItem('token');
      // We might want to keep location even after logout, or clear it. 
      // Let's keep it for better UX, or revert to localStorage value if it was overwritten
      return { ...state, user: null, token: null, cart: { items: [], totalAmount: 0 }, wishlist: [] };
    case 'SET_CART':
      return { ...state, cart: action.payload };
    case 'SET_WISHLIST':
      return { ...state, wishlist: action.payload };
    case 'SET_CURRENCY':
      return { ...state, currency: action.payload };
    case 'SET_LOCATION':
      return { ...state, location: action.payload };
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { showToast } = useToast();

  // Set axios default headers
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['x-auth-token'] = state.token;
      safeLocalStorage.setItem('token', state.token);
    } else {
      delete axios.defaults.headers.common['x-auth-token'];
      safeLocalStorage.removeItem('token');
    }
  }, [state.token]);

  const loadCart = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/cart`);
      dispatch({ type: 'SET_CART', payload: res.data });
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  };

  const loadWishlist = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/wishlist`);
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  };

  const loadUser = useCallback(async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const res = await axios.get(`${API_BASE_URL}/api/auth/profile`);
      dispatch({ type: 'SET_USER', payload: res.data });
      loadCart();
      loadWishlist();
    } catch (error) {
      console.error('Error loading user:', error);
      dispatch({ type: 'LOGOUT' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load user on app start
  useEffect(() => {
    if (state.token) {
      loadUser();
    }
  }, [state.token, loadUser]);

  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null }); // Clear previous errors
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
      dispatch({ type: 'SET_TOKEN', payload: res.data.token });
      dispatch({ type: 'SET_USER', payload: res.data.user });
      loadCart();
      loadWishlist();
      showToast(`Welcome back, ${res.data.user.firstName}!`, 'success');
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      let message = 'Login failed';

      if (error.response) {
        // Server responded with error
        message = error.response.data?.message || error.response.data?.errors?.[0]?.msg || 'Login failed';
      } else if (error.request) {
        // Request was made but no response received
        message = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else {
        // Something else happened
        message = error.message || 'Login failed';
      }

      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null }); // Clear previous errors
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, userData);
      dispatch({ type: 'SET_TOKEN', payload: res.data.token });
      dispatch({ type: 'SET_USER', payload: res.data.user });
      loadCart();
      loadWishlist();
      showToast('Registration successful! Welcome to Rangaara.', 'success');
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      let message = 'Registration failed';

      if (error.response) {
        // Server responded with error
        message = error.response.data?.message || error.response.data?.errors?.[0]?.msg || 'Registration failed';
      } else if (error.request) {
        // Request was made but no response received
        message = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else {
        // Something else happened
        message = error.message || 'Registration failed';
      }

      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({ type: 'SET_LOADING', payload: false });
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
    showToast('You have been logged out.', 'info');
  };

  const addToCart = async (productId, quantity = 1, size, color) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/cart/add`, {
        productId,
        quantity,
        size,
        color
      });
      dispatch({ type: 'SET_CART', payload: res.data });
      showToast('Added to cart successfully!', 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to cart';
      dispatch({ type: 'SET_ERROR', payload: message });
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/wishlist/add/${productId}`);
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
      showToast('Added to wishlist!', 'success');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add to wishlist';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await axios.delete(`${API_BASE_URL}/api/wishlist/remove/${productId}`);
      dispatch({ type: 'SET_WISHLIST', payload: res.data });
      showToast('Removed from wishlist.', 'info');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to remove from wishlist';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const subscribeNewsletter = async (email) => {
    try {
      await axios.post(`${API_BASE_URL}/api/newsletter/subscribe`, { email });
      showToast('Successfully subscribed to newsletter!', 'success');
      return { success: true, message: 'Successfully subscribed to newsletter!' };
    } catch (error) {
      const message = error.response?.data?.message || 'Subscription failed';
      showToast(message, 'error');
      return { success: false, message };
    }
  };

  const setCurrency = (currency) => {
    dispatch({ type: 'SET_CURRENCY', payload: currency });
  };

  const updateLocation = async (locationData) => {
    try {
      // Always update local state
      dispatch({ type: 'SET_LOCATION', payload: locationData });
      safeLocalStorage.setItem('location', JSON.stringify(locationData));

      // If logged in, also update backend profile
      if (state.token) {
        const { pincode, city, state: locState } = locationData;
        await axios.put(`${API_BASE_URL}/api/auth/profile`, {
          address: {
            zipCode: pincode,
            city: city,
            state: locState,
            country: 'India' // Defaulting to India for now based on context
          }
        });
        // Reload user to sync
        loadUser();
      }
      return { success: true };
    } catch (error) {
      console.error('Failed to update location:', error);
      showToast('Failed to update location', 'error');
      return { success: false, message: error.message };
    }
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
    updateLocation,
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