import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // Initialize profile data with user data
    setProfileData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phone: user.phone || '',
      address: {
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      }
    });
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.put('http://localhost:5000/api/auth/profile', profileData);
      setMessage('Profile updated successfully!');
    } catch (error) {
      setMessage('Error updating profile. Please try again.');
    } finally {
      setLoading(false);
    }

    // Clear message after 3 seconds
    setTimeout(() => setMessage(''), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-avatar">
            <div className="avatar-circle">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fa-solid fa-user"></i>
              Profile Information
            </button>
            <button 
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <i className="fa-solid fa-box"></i>
              Order History
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fa-solid fa-shield-halved"></i>
              Security
            </button>
            <button 
              className="nav-item logout-btn"
              onClick={handleLogout}
            >
              <i className="fa-solid fa-sign-out-alt"></i>
              Logout
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Profile Information</h2>
              
              {message && (
                <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="profile-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={profileData.email}
                    onChange={handleInputChange}
                    required
                    disabled
                  />
                  <small>Email cannot be changed</small>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={profileData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <h3>Address Information</h3>

                <div className="form-group">
                  <label htmlFor="address.street">Street Address</label>
                  <input
                    type="text"
                    id="address.street"
                    name="address.street"
                    value={profileData.address.street}
                    onChange={handleInputChange}
                    placeholder="Enter your street address"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address.city">City</label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      value={profileData.address.city}
                      onChange={handleInputChange}
                      placeholder="City"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address.state">State</label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      value={profileData.address.state}
                      onChange={handleInputChange}
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address.zipCode">ZIP Code</label>
                    <input
                      type="text"
                      id="address.zipCode"
                      name="address.zipCode"
                      value={profileData.address.zipCode}
                      onChange={handleInputChange}
                      placeholder="ZIP Code"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="address.country">Country</label>
                    <input
                      type="text"
                      id="address.country"
                      name="address.country"
                      value={profileData.address.country}
                      onChange={handleInputChange}
                      placeholder="Country"
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="save-btn"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="profile-section">
              <h2>Order History</h2>
              <div className="orders-placeholder">
                <i className="fa-solid fa-box"></i>
                <h3>No Orders Yet</h3>
                <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
                <button onClick={() => navigate('/shop')} className="shop-now-btn">
                  Explore The Collection
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section">
              <h2>Security Settings</h2>
              <div className="security-placeholder">
                <i className="fa-solid fa-shield-halved"></i>
                <h3>Change Password</h3>
                <p>Password change functionality will be available soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;