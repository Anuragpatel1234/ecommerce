import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: null,
  token: null,
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

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock login for now
    setTimeout(() => {
      dispatch({ type: 'SET_USER', payload: { firstName: 'Test', lastName: 'User', email } });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
    return { success: true };
  };

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    // Mock register for now
    setTimeout(() => {
      dispatch({ type: 'SET_USER', payload: userData });
      dispatch({ type: 'SET_LOADING', payload: false });
    }, 1000);
    return { success: true };
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const loadCart = async () => {
    // Mock function
  };

  const addToCart = async (productId, quantity = 1, size, color) => {
    // Mock function
    return { success: true };
  };

  const loadWishlist = async () => {
    // Mock function
  };

  const addToWishlist = async (productId) => {
    // Mock function
    return { success: true };
  };

  const removeFromWishlist = async (productId) => {
    // Mock function
    return { success: true };
  };

  const subscribeNewsletter = async (email) => {
    // Mock function
    return { success: true, message: 'Successfully subscribed!' };
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