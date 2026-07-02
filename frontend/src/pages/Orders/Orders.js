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

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1 className="common-heading">Order History</h1>
        <p className="orders-count">{orders.length} order{orders.length !== 1 ? 's' : ''} found</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3 className="order-number">Order #{order.orderNumber}</h3>
                <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
              </div>
              <div className="order-status">
                <span 
                  className="status-badge"
                  style={{ backgroundColor: getStatusColor(order.orderStatus) }}
                >
                  {order.orderStatus.toUpperCase()}
                </span>
                <span 
                  className="payment-status"
                  style={{ color: getPaymentStatusColor(order.paymentStatus) }}
                >
                  Payment: {order.paymentStatus.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <img 
                    src={getImageUrl(item.product?.images?.[0])} 
                    alt={item.product?.name || 'Product'} 
                  />
                  <div className="item-details">
                    <h4>{item.product?.name || 'Product'}</h4>
                    <div className="item-variants">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                      <span>Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="item-price">
                    {formatPrice(item.price || 0)}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? 'FREE' : formatPrice(order.shipping || 0)}</span>
              </div>
              <div className="summary-row">
                <span>Tax:</span>
                <span>{formatPrice(order.tax || 0)}</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{formatPrice(order.total || 0)}</span>
              </div>
            </div>

            <div className="order-actions">
              <button className="track-order-btn">
                <i className="fa-solid fa-truck"></i>
                Track Order
              </button>
              {order.orderStatus === 'delivered' && (
                <button className="reorder-btn">
                  <i className="fa-solid fa-repeat"></i>
                  Reorder
                </button>
              )}
              {order.orderStatus === 'pending' && (
                <button className="cancel-order-btn">
                  <i className="fa-solid fa-times"></i>
                  Cancel Order
                </button>
              )}
            </div>

            {order.shippingAddress && (
              <div className="shipping-address">
                <h5>Shipping Address:</h5>
                <p>
                  {order.shippingAddress.firstName} {order.shippingAddress.lastName}<br />
                  {order.shippingAddress.street}<br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                  {order.shippingAddress.country}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;