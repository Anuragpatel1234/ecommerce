import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './Users.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { search })
      });

      const res = await axios.get(`${API_ENDPOINTS.ADMIN.USERS}?${params}`);
      setUsers(res.data.users || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.response?.data?.message || 'Failed to load users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-users">
      <Breadcrumbs items={[{ label: 'Users' }]} />

      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>Manage customer accounts - View customer information</p>
        </div>
      </div>

      {error && (
        <div className="admin-error-message">
          <i className="fa-solid fa-exclamation-circle"></i>
          {error}
          <button
            onClick={fetchUsers}
            className="btn-retry"
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="users-filters">
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Loading users...</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Location</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <strong>{user.firstName} {user.lastName}</strong>
                      </td>
                      <td>{user.email}</td>
                      <td>{user.phone || '-'}</td>
                      <td>
                        {user.address?.city && user.address?.state
                          ? `${user.address.city}, ${user.address.state}`
                          : '-'}
                      </td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-data">
                      No users found
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

export default Users;

