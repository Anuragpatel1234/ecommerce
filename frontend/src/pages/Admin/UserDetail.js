import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './OrderDetail.css'; // Reusing OrderDetail styles for consistency

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await axios.get(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
      setUser(res.data);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError(error.response?.data?.message || 'Failed to load user details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const validPrice = price || 0;
    return `₹${validPrice.toLocaleString()}`;
  };

  const handleBlockUser = async () => {
    try {
      if (!window.confirm(`Are you sure you want to ${user.isBlocked ? 'unblock' : 'block'} this user?`)) return;
      
      setUpdating(true);
      setError('');
      setSuccess('');
      
      const res = await axios.put(API_ENDPOINTS.ADMIN.USER_BLOCK(id));
      setUser({ ...user, isBlocked: !user.isBlocked });
      setSuccess(res.data.message);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error blocking user:', err);
      setError(err.response?.data?.message || 'Failed to block user');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteUser = async () => {
    try {
      if (!window.confirm('WARNING: Are you absolutely sure you want to delete this user? This will permanently erase their account and all associated order data.')) return;
      
      setUpdating(true);
      setError('');
      
      await axios.delete(API_ENDPOINTS.ADMIN.USER_BY_ID(id));
      alert('User successfully deleted');
      navigate('/admin/users');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Failed to delete user');
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading user details...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="admin-order-detail">
        <Breadcrumbs items={[
          { label: 'Users', path: '/admin/users' },
          { label: 'User Details' }
        ]} />
        <div className="admin-error-message">
          <i className="fa-solid fa-exclamation-circle"></i>
          {error || 'User not found'}
          <button
            onClick={() => navigate('/admin/users')}
            className="btn-secondary"
            style={{ marginLeft: '10px' }}
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-order-detail">
      <Breadcrumbs items={[
        { label: 'Users', path: '/admin/users' },
        { label: `${user.firstName} ${user.lastName}` }
      ]} />

      <div className="order-detail-header">
        <div>
          <h1>
            {user.firstName} {user.lastName}
            {user.isBlocked && <span style={{ marginLeft: '10px', fontSize: '14px', color: '#dc2626', backgroundColor: '#fef2f2', padding: '4px 8px', borderRadius: '4px', border: '1px solid #fecaca' }}>Blocked</span>}
          </h1>
          <p>Joined on {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {user.role !== 'admin' && (
            <>
              <button onClick={handleBlockUser} disabled={updating} className="btn-secondary" style={{ color: user.isBlocked ? '#059669' : '#dc2626', borderColor: user.isBlocked ? '#059669' : '#dc2626' }}>
                <i className={`fa-solid ${user.isBlocked ? 'fa-unlock' : 'fa-ban'}`}></i> {user.isBlocked ? 'Unblock' : 'Block'}
              </button>
              <button onClick={handleDeleteUser} disabled={updating} className="btn-secondary" style={{ color: 'white', backgroundColor: '#dc2626', borderColor: '#dc2626' }}>
                <i className="fa-solid fa-trash"></i> Delete
              </button>
            </>
          )}
          <Link to="/admin/users" className="btn-secondary">
            <i className="fa-solid fa-arrow-left"></i> Back to Users
          </Link>
        </div>
      </div>

      {(error || success) && (
        <div className={`admin-message ${error ? 'admin-error-message' : 'admin-success-message'}`} style={{ marginBottom: '20px' }}>
          <i className={`fa-solid fa-${error ? 'exclamation-circle' : 'check-circle'}`}></i>
          {error || success}
        </div>
      )}

      <div className="order-detail-content">
        <div className="order-detail-grid">
          <div className="order-detail-section">
            <h2>Contact Information</h2>
            <div className="info-card">
              <div className="info-row">
                <strong>Name:</strong>
                <span>{user.firstName} {user.lastName}</span>
              </div>
              <div className="info-row">
                <strong>Email:</strong>
                <span>{user.email}</span>
              </div>
              <div className="info-row">
                <strong>Phone:</strong>
                <span>{user.phone || '-'}</span>
              </div>
              {user.address && (
                <div className="info-row" style={{ alignItems: 'flex-start' }}>
                  <strong>Address:</strong>
                  <span style={{ textAlign: 'right' }}>
                    {user.address.street && <div>{user.address.street}</div>}
                    {user.address.city && <div>{user.address.city}, {user.address.state} {user.address.zipCode}</div>}
                    {user.address.country && <div>{user.address.country}</div>}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="order-detail-section">
            <h2>Account Summary</h2>
            <div className="info-card">
              <div className="info-row">
                <strong>User ID:</strong>
                <span>#{user._id.slice(-8)}</span>
              </div>
              <div className="info-row">
                <strong>Total Orders:</strong>
                <span>{user.orders?.length || 0}</span>
              </div>
              <div className="info-row">
                <strong>Role:</strong>
                <span style={{ textTransform: 'capitalize' }}>{user.role}</span>
              </div>
              <div className="info-row">
                <strong>Status:</strong>
                <span style={{ color: user.isBlocked ? '#dc2626' : '#059669', fontWeight: 'bold' }}>
                  {user.isBlocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="order-detail-section">
          <h2>Order History</h2>
          <div className="order-items-table">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {user.orders && user.orders.length > 0 ? (
                  user.orders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.slice(-8)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <span style={{ textTransform: 'capitalize', fontWeight: '600' }}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td><strong>{formatPrice(order.total)}</strong></td>
                      <td>
                        <Link to={`/admin/orders/${order._id}`} style={{ color: '#4e322d', fontWeight: 'bold', textDecoration: 'none' }}>
                          View <i className="fa-solid fa-arrow-right"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">No orders found for this user.</td>
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

export default UserDetail;
