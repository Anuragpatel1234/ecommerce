import { getImageUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setError('');
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(API_ENDPOINTS.ADMIN.DASHBOARD_STATS, {
        headers: { 'x-auth-token': token }
      });
      setStats(res.data.stats);
      setRecentOrders(res.data.recentOrders || []);
      setTopProducts(res.data.topProducts || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.response?.data?.message || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const validPrice = price || 0;
    return `₹${validPrice.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <Breadcrumbs items={[{ label: 'Dashboard' }]} />
      
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's what's happening with your store.</p>
      </div>

      {error && (
        <div className="admin-error-message" style={{ marginBottom: '20px' }}>
          <i className="fa-solid fa-exclamation-circle"></i>
          {error}
          <button 
            onClick={fetchDashboardData} 
            className="btn-retry"
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dbeafe' }}>
            <i className="fa-solid fa-shirt" style={{ color: '#3b82f6' }}></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.totalProducts || 0}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#dcfce7' }}>
            <i className="fa-solid fa-shopping-bag" style={{ color: '#10b981' }}></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.totalOrders || 0}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#fef3c7' }}>
            <i className="fa-solid fa-users" style={{ color: '#f59e0b' }}></i>
          </div>
          <div className="stat-content">
            <h3>{stats?.totalUsers || 0}</h3>
            <p>Total Users</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#e0e7ff' }}>
            <i className="fa-solid fa-rupee-sign" style={{ color: '#6366f1' }}></i>
          </div>
          <div className="stat-content">
            <h3>{formatPrice(stats?.totalRevenue || 0)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all-link">
              View All <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <div className="orders-table">
            {recentOrders.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{order.user?.firstName} {order.user?.lastName}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`status-badge status-${order.orderStatus}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>{formatPrice(order.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="no-data">No orders yet</p>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2>Top Products</h2>
            <Link to="/admin/products" className="view-all-link">
              View All <i className="fa-solid fa-arrow-right"></i>
            </Link>
          </div>
          <div className="products-grid">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <div key={product._id} className="product-mini-card">
                  <img 
                    src={getImageUrl(product.images?.[0])} 
                    alt={product.name}
                  />
                  <div className="product-mini-info">
                    <h4>{product.name}</h4>
                    <p>{formatPrice(product.price)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No products yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

