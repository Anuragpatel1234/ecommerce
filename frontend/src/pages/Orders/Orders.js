import { getImageUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import axios from 'axios';
import './Orders.css';

const Orders = () => {
  const { user, currency } = useApp();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const currencySymbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      SGD: 'S$'
    };
    
    const rates = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      CAD: 0.016,
      AUD: 0.018,
      SGD: 0.016
    };
    
    const convertedPrice = Math.round(price * rates[currency]);
    return `${currencySymbols[currency]}${convertedPrice.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      confirmed: '#3B82F6',
      processing: '#8B5CF6',
      shipped: '#10B981',
      delivered: '#059669',
      cancelled: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: '#F59E0B',
      paid: '#10B981',
      failed: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="orders-page">
        <div className="orders-loading">
          <div className="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="orders-empty">
          <i className="fa-solid fa-box"></i>
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your order history here.</p>
          <Link to="/shop" className="shop-btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  const handleFilterChange = (filter) => {
    setSelectedFilters(prev => 
      prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
    );
  };

  const getFilteredOrders = () => {
    let filtered = orders;

    // Apply Search
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => {
        const matchId = order.orderNumber?.toLowerCase().includes(query);
        const matchItem = order.items.some(item => item.product?.name?.toLowerCase().includes(query));
        return matchId || matchItem;
      });
    }

    // Apply Filters
    if (selectedFilters.length > 0) {
      filtered = filtered.filter(order => {
        const st = order.orderStatus;
        if (selectedFilters.includes('On the way') && ['pending', 'confirmed', 'processing', 'shipped'].includes(st)) return true;
        if (selectedFilters.includes('Delivered') && st === 'delivered') return true;
        if (selectedFilters.includes('Cancelled') && st === 'cancelled') return true;
        if (selectedFilters.includes('Returned') && st === 'returned') return true;
        return false;
      });
    }

    return filtered;
  };

  const filteredOrders = getFilteredOrders();

  return (
    <div className="orders-page" style={{ background: '#f1f3f6', padding: '20px 0', minHeight: '100vh' }}>
      <div className="orders-container" style={{ display: 'flex', gap: '15px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        
        {/* Left Sidebar Filters */}
        <div className="orders-sidebar" style={{ width: '250px', background: '#fff', padding: '20px', borderRadius: '2px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', alignSelf: 'flex-start' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px', paddingBottom: '15px', borderBottom: '1px solid #f0f0f0' }}>Filters</h2>
          <div className="filter-section">
            <h3 style={{ fontSize: '12px', fontWeight: '500', color: '#212121', marginBottom: '15px', textTransform: 'uppercase' }}>ORDER STATUS</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#212121', cursor: 'pointer', marginBottom: '15px' }}>
              <input type="checkbox" checked={selectedFilters.includes('On the way')} onChange={() => handleFilterChange('On the way')} style={{ width: '16px', height: '16px', accentColor: '#4e322d' }} /> On the way
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#212121', cursor: 'pointer', marginBottom: '15px' }}>
              <input type="checkbox" checked={selectedFilters.includes('Delivered')} onChange={() => handleFilterChange('Delivered')} style={{ width: '16px', height: '16px', accentColor: '#4e322d' }} /> Delivered
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#212121', cursor: 'pointer', marginBottom: '15px' }}>
              <input type="checkbox" checked={selectedFilters.includes('Cancelled')} onChange={() => handleFilterChange('Cancelled')} style={{ width: '16px', height: '16px', accentColor: '#4e322d' }} /> Cancelled
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: '#212121', cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedFilters.includes('Returned')} onChange={() => handleFilterChange('Returned')} style={{ width: '16px', height: '16px', accentColor: '#4e322d' }} /> Returned
            </label>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="orders-main-content" style={{ flex: 1 }}>
          <div className="breadcrumb" style={{ fontSize: '12px', color: '#878787', marginBottom: '15px' }}>
            <Link to="/" style={{ color: '#878787', textDecoration: 'none' }}>Home</Link> &gt; <Link to="/profile" style={{ color: '#878787', textDecoration: 'none' }}>My Account</Link> &gt; My Orders
          </div>
          
          <div className="orders-search-bar" style={{ display: 'flex', marginBottom: '20px' }}>
            <input 
              type="text" 
              placeholder="Search your orders here" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1, padding: '12px 15px', border: '1px solid #e0e0e0', borderRight: 'none', borderRadius: '2px 0 0 2px', outline: 'none', fontSize: '14px', color: '#212121' }} 
            />
            <button style={{ background: '#4e322d', color: '#fff', border: 'none', padding: '0 30px', fontSize: '14px', fontWeight: '500', borderRadius: '0 2px 2px 0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-magnifying-glass"></i> Search Orders
            </button>
          </div>

          <h3 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '15px', color: '#212121' }}>
            {filteredOrders.length === 0 ? 'No orders match your filters.' : 'Are you looking for these orders?'}
          </h3>

          <div className="orders-list-modern">
            {filteredOrders.map((order) => (
              <React.Fragment key={order._id}>
                {order.items.map((item, index) => (
                  <div key={`${order._id}-${index}`} className="modern-order-card" onClick={() => navigate(`/orders/${order._id}`)}>
                    <div className="modern-order-image">
                      <img 
                        src={getImageUrl(item.product?.images?.[0])} 
                        alt={item.product?.name || 'Product'} 
                      />
                    </div>
                    
                    <div className="modern-order-details">
                      <div style={{ fontSize: '12px', color: '#878787', marginBottom: '6px' }}>
                        Order ID: <span style={{ color: '#212121', fontWeight: '500' }}>{order.orderNumber}</span>
                      </div>
                      <h4 className="modern-product-title">{item.product?.name || 'Product'}</h4>
                      <div className="modern-product-variants">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    </div>

                    <div className="modern-order-price">
                      {formatPrice(item.price || 0)}
                    </div>

                    <div className="modern-order-status">
                      <div className="status-indicator">
                        <span 
                          className="status-dot" 
                          style={{ 
                            backgroundColor: getStatusColor(order.orderStatus),
                            boxShadow: `0 0 0 2px white, 0 0 0 4px ${getStatusColor(order.orderStatus)}33`
                          }}
                        ></span>
                        <span className="status-text">
                          {order.orderStatus === 'delivered' ? 'Delivered on' : order.orderStatus === 'pending' ? 'Ordered on' : order.orderStatus === 'shipped' ? 'Shipped on' : order.orderStatus === 'cancelled' ? 'Cancelled on' : 'Processing from'} {formatDate(order.createdAt)}
                        </span>
                      </div>
                      <p className="status-description">
                        {order.orderStatus === 'delivered' ? 'Your item has been delivered' : 
                         order.orderStatus === 'pending' ? 'Seller is preparing your item' :
                         order.orderStatus === 'shipped' ? 'Your item is on the way' :
                         order.orderStatus === 'cancelled' ? 'Your order has been cancelled' :
                         'Your item is being processed'}
                      </p>
                      
                      {order.orderStatus === 'delivered' && (
                        <button className="rate-review-btn">
                          <i className="fa-solid fa-star"></i> Rate & Review Product
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orders;