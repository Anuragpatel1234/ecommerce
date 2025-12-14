import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  
  const { login, user, loading, error, clearError } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear field error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Use context login function which handles everything
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      // Check if user is admin and redirect accordingly
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const tempAxios = axios.create();
          tempAxios.defaults.headers.common['x-auth-token'] = token;
          const userRes = await tempAxios.get(API_ENDPOINTS.AUTH.PROFILE);
          
          if (userRes.data.role === 'admin') {
            localStorage.setItem('adminToken', token);
            navigate('/admin/dashboard');
            return;
          }
        } catch (profileErr) {
          console.error('Error checking user role:', profileErr);
        }
      }
      // Regular user - redirect to home
      navigate('/');
    }
    // Error is already set in context if login fails
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="auth-header">
            <h2 className="auth-title">Welcome Back</h2>
            <p className="auth-subtitle">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? 'error' : ''}
                placeholder="Enter your email"
              />
              {errors.email && <span className="field-error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <button 
              type="submit" 
              className="auth-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? 
              <Link to="/register" className="auth-link"> Create one</Link>
            </p>
            <div className="auth-divider">
              <span>or</span>
            </div>
            <p>
              <Link to="/admin/login" className="admin-link">
                <i className="fa-solid fa-shield-halved"></i> Admin Login
              </Link>
            </p>
          </div>

          <div className="test-credentials">
            <h4>Test Credentials</h4>
            <div className="credentials-list">
              <div className="credential-item">
                <strong>Regular User:</strong>
                <p>Email: test@rangaara.com</p>
                <p>Password: test123</p>
              </div>
              <div className="credential-item">
                <strong>Admin User:</strong>
                <p>Email: admin@rangaara.com</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;