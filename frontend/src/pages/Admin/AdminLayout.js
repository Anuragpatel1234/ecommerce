import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import MenuToggle from '../../components/ui/MenuToggle';
import './AdminLayout.css';

const AdminLayout = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      axios.defaults.headers.common['x-auth-token'] = token;
      const res = await axios.get(API_ENDPOINTS.AUTH.PROFILE);

      if (res.data.role !== 'admin') {
        localStorage.removeItem('adminToken');
        delete axios.defaults.headers.common['x-auth-token'];
        setError('Access denied. Admin privileges required.');
        navigate('/admin/login');
        return;
      }

      setAdmin(res.data);
      setError('');
    } catch (error) {
      console.error('Admin auth error:', error);
      localStorage.removeItem('adminToken');
      delete axios.defaults.headers.common['x-auth-token'];

      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to verify admin access.');
      }

      navigate('/admin/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['x-auth-token'];
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-error-container">
        <div className="admin-error-message">
          <i className="fa-solid fa-exclamation-circle"></i>
          {error}
        </div>
      </div>
    );
  }

  const isActive = (path) => location.pathname === path;

  return (
    <div className="admin-layout">
      <div className="admin-sidebar-toggle-wrapper">
        <MenuToggle
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          isOpen={sidebarOpen}
          className="admin-menu-toggle"
        />
      </div>

      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="admin-sidebar-header">
          <div className="admin-logo-section">
            {sidebarOpen && (
              <>
                <h2>RANGAARA</h2>
                <p>Admin Panel</p>
              </>
            )}
            {!sidebarOpen && (
              <h2 className="admin-logo-collapsed">R</h2>
            )}
          </div>
          <button
            className="admin-sidebar-toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            <i className={`fa-solid fa-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
          </button>
        </div>

        <nav className="admin-nav">
          <Link
            to="/admin/dashboard"
            className={`admin-nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
            title="Dashboard"
          >
            <i className="fa-solid fa-chart-line"></i>
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link
            to="/admin/products"
            className={`admin-nav-item ${isActive('/admin/products') || location.pathname.startsWith('/admin/products') ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
            title="Products"
          >
            <i className="fa-solid fa-shirt"></i>
            {sidebarOpen && <span>Products</span>}
          </Link>

          <Link
            to="/admin/orders"
            className={`admin-nav-item ${isActive('/admin/orders') || location.pathname.startsWith('/admin/orders') ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
            title="Orders"
          >
            <i className="fa-solid fa-shopping-bag"></i>
            {sidebarOpen && <span>Orders</span>}
          </Link>

          <Link
            to="/admin/users"
            className={`admin-nav-item ${isActive('/admin/users') || location.pathname.startsWith('/admin/users') ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
            title="Users"
          >
            <i className="fa-solid fa-users"></i>
            {sidebarOpen && <span>Users</span>}
          </Link>

          <Link
            to="/admin/sections"
            className={`admin-nav-item ${isActive('/admin/sections') || location.pathname.startsWith('/admin/sections') ? 'active' : ''}`}
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
            title="Website Sections"
          >
            <i className="fa-solid fa-pen-to-square"></i>
            {sidebarOpen && <span>Website Sections</span>}
          </Link>

          {sidebarOpen && <div className="admin-nav-divider"></div>}

          <Link
            to="/"
            className="admin-nav-item admin-nav-external"
            onClick={() => window.innerWidth < 768 && setSidebarOpen(false)}
            target="_blank"
            title="View Website"
          >
            <i className="fa-solid fa-external-link-alt"></i>
            {sidebarOpen && <span>View Website</span>}
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          {sidebarOpen ? (
            <>
              <div className="admin-user-info">
                <i className="fa-solid fa-user-circle"></i>
                <div>
                  <p className="admin-user-name">{admin?.firstName} {admin?.lastName}</p>
                  <p className="admin-user-email">{admin?.email}</p>
                </div>
              </div>
              <button onClick={handleLogout} className="admin-logout-btn">
                <i className="fa-solid fa-sign-out-alt"></i>
                Logout
              </button>
            </>
          ) : (
            <div className="admin-user-info-collapsed">
              <button
                onClick={handleLogout}
                className="admin-logout-btn-collapsed"
                title="Logout"
              >
                <i className="fa-solid fa-sign-out-alt"></i>
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className={`admin-main ${sidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

