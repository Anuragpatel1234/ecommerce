import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(statusFilter && { status: statusFilter })
      });
      
      const res = await axios.get(`${API_ENDPOINTS.ADMIN.ORDERS}?${params}`);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.response?.data?.message || 'Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setError('');
      setSuccess('');
      await axios.put(API_ENDPOINTS.ADMIN.ORDER_STATUS(orderId), {
        status: newStatus
      });
      setSuccess('Order status updated successfully!');
      fetchOrders();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      setError(error.response?.data?.message || 'Failed to update order status. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatPrice = (price) => {
    const validPrice = price || 0;
    return `₹${validPrice.toLocaleString()}`;
  };

  return (
    <div className="admin-orders">
      <Breadcrumbs items={[{ label: 'Orders' }]} />
      
      <div className="orders-header">
        <div>
          <h1>Orders</h1>
          <p>Manage customer orders - View and update order status</p>
        </div>
      </div>

      {(error || success) && (
        <div className={`admin-message ${error ? 'admin-error-message' : 'admin-success-message'}`}>
          <i className={`fa-solid fa-${error ? 'exclamation-circle' : 'check-circle'}`}></i>
          {error || success}
        </div>
      )}

      <div className="orders-filters">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Loading orders...</p>
        </div>
      ) : (
        <>
          <div className="orders-table-container">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/admin/orders/${order._id}`} className="order-link">
                          #{order._id.slice(-8)}
                        </Link>
                      </td>
                      <td>
                        <div>
                          <strong>{order.user?.firstName} {order.user?.lastName}</strong>
                          <br />
                          <small>{order.user?.email}</small>
                        </div>
                      </td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>{order.items?.length || 0} items</td>
                      <td>{formatPrice(order.total)}</td>
                      <td>
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          className="status-select"
                        >
                          <option value="pending">Pending</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td>
                        <Link
                          to={`/admin/orders/${order._id}`}
                          className="btn-view"
                        >
                          <i className="fa-solid fa-eye"></i>
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Orders;

