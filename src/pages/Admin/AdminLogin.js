import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import './AdminLogin.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password
      });

      // Store token first
      localStorage.setItem('adminToken', res.data.token);
      axios.defaults.headers.common['x-auth-token'] = res.data.token;

      // Check if user is admin
      const userRes = await axios.get(API_ENDPOINTS.AUTH.PROFILE);

      if (userRes.data.role !== 'admin') {
        localStorage.removeItem('adminToken');
        delete axios.defaults.headers.common['x-auth-token'];
        setError('Access denied. Admin privileges required.');
        setLoading(false);
        return;
      }

      // Navigate to admin dashboard
      navigate('/admin/dashboard');
    } catch (err) {
      console.error('Admin login error:', err);
      let errorMessage = 'Login failed';
      
      if (err.response) {
        // Server responded with error
        errorMessage = err.response.data?.message || err.response.data?.errors?.[0]?.msg || 'Login failed';
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = 'Cannot connect to server. Please make sure the backend server is running on port 5000.';
      } else {
        // Something else happened
        errorMessage = err.message || 'Login failed';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        <div className="admin-login-card">
          <div className="admin-login-header">
            <h1>RANGAARA</h1>
            <h2>Admin Panel</h2>
            <p>Sign in to manage your website</p>
          </div>

          <form onSubmit={handleSubmit} className="admin-login-form">
            {error && (
              <div className="admin-error-message">
                {error}
              </div>
            )}

            <div className="admin-form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@rangaara.com"
                required
              />
            </div>

            <div className="admin-form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="admin-login-btn"
              disabled={loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="admin-login-footer">
            <p>Default Admin Credentials:</p>
            <p><strong>Email:</strong> admin@rangaara.com</p>
            <p><strong>Password:</strong> admin123</p>
            <div className="admin-login-divider">
              <span>or</span>
            </div>
            <p>
              <Link to="/login" className="admin-back-link">
                <i className="fa-solid fa-arrow-left"></i> Back to User Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

