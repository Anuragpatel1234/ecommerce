import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_ENDPOINTS.ADMIN.ORDER_BY_ID(id));
      setOrder(res.data);
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error.response?.data?.message || 'Failed to load order details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      setError('');
      setSuccess('');
      await axios.put(API_ENDPOINTS.ADMIN.ORDER_STATUS(id), {
        status: newStatus
      });
      setSuccess('Order status updated successfully!');
      fetchOrder();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error.response?.data?.message || 'Failed to update order status. Please try again.');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUpdating(false);
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#3b82f6',
      shipped: '#8b5cf6',
      delivered: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="admin-order-detail">
        <Breadcrumbs items={[
          { label: 'Orders', path: '/admin/orders' },
          { label: 'Order Details' }
        ]} />
        <div className="admin-error-message">
          <i className="fa-solid fa-exclamation-circle"></i>
          {error}
          <button
            onClick={() => navigate('/admin/orders')}
            className="btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="admin-order-detail">
        <Breadcrumbs items={[
          { label: 'Orders', path: '/admin/orders' },
          { label: 'Order Details' }
        ]} />
        <div className="admin-error-message">
          Order not found
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-detail">
      <Breadcrumbs items={[
        { label: 'Orders', path: '/admin/orders' },
        { label: `Order #${order._id.slice(-8)}` }
      ]} />

      <div className="order-detail-header">
        <div>
          <h1>Order #{order._id.slice(-8)}</h1>
          <p>Order placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <Link to="/admin/orders" className="btn-secondary">
          <i className="fa-solid fa-arrow-left"></i> Back to Orders
        </Link>
      </div>

      {(error || success) && (
        <div className={`admin-message ${error ? 'admin-error-message' : 'admin-success-message'}`}>
          <i className={`fa-solid fa-${error ? 'exclamation-circle' : 'check-circle'}`}></i>
          {error || success}
        </div>
      )}

      <div className="order-detail-content">
        <div className="order-detail-section">
          <h2>Order Status</h2>
          <div className="status-control">
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="status-select-large"
              disabled={updating}
              style={{ borderColor: getStatusColor(order.status) }}
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            {updating && <span className="updating-text">Updating...</span>}
          </div>
        </div>

        <div className="order-detail-grid">
          <div className="order-detail-section">
            <h2>Customer Information</h2>
            <div className="info-card">
              <div className="info-row">
                <strong>Name:</strong>
                <span>{order.user?.firstName} {order.user?.lastName}</span>
              </div>
              <div className="info-row">
                <strong>Email:</strong>
                <span>{order.user?.email}</span>
              </div>
              {order.user?.phone && (
                <div className="info-row">
                  <strong>Phone:</strong>
                  <span>{order.user.phone}</span>
                </div>
              )}
              {order.user?.address && (
                <>
                  <div className="info-row">
                    <strong>Address:</strong>
                    <span>
                      {order.user.address.street && `${order.user.address.street}, `}
                      {order.user.address.city && `${order.user.address.city}, `}
                      {order.user.address.state && `${order.user.address.state} `}
                      {order.user.address.zipCode && order.user.address.zipCode}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="order-detail-section">
            <h2>Order Summary</h2>
            <div className="info-card">
              <div className="info-row">
                <strong>Order ID:</strong>
                <span>#{order._id.slice(-8)}</span>
              </div>
              <div className="info-row">
                <strong>Date:</strong>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
              </div>
              <div className="info-row">
                <strong>Status:</strong>
                <span
                  className="status-badge"
                  style={{
                    backgroundColor: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status)
                  }}
                >
                  {order.status}
                </span>
              </div>
              <div className="info-row">
                <strong>Subtotal:</strong>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="info-row total-row">
                <strong>Total:</strong>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-detail-section">
          <h2>Order Items</h2>
          <div className="order-items-table">
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th>Color</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className="product-info-cell">
                          {item.product?.images?.[0] && (
                            <img
                              src={item.product.images[0]}
                              alt={item.product.name}
                              className="product-thumb-small"
                            />
                          )}
                          <div>
                            <strong>{item.product?.name || 'Product'}</strong>
                            {item.product && (
                              <small>{item.product.category}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{item.size || '-'}</td>
                      <td>{item.color || '-'}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.price)}</td>
                      <td><strong>{formatPrice(item.price * item.quantity)}</strong></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">No items found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;

