import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './Sections.css';

const Sections = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Ensure we have the auth token
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setError('Authentication required. Please login again.');
        setLoading(false);
        return;
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get(API_ENDPOINTS.ADMIN.SECTIONS, config);
      
      console.log('Sections API response:', res.data);
      
      if (res.data && res.data.sections) {
        setSections(res.data.sections);
      } else if (Array.isArray(res.data)) {
        setSections(res.data);
      } else {
        setSections([]);
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else if (error.response?.status === 403) {
        setError('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        setError('Sections endpoint not found. The server may need to be restarted to load new routes.');
      } else if (error.response?.status === 500) {
        const errorMsg = error.response?.data?.error || error.response?.data?.message || 'Server error';
        setError(`Server error: ${errorMsg}. Check server console for details.`);
      } else if (error.response) {
        const errorMsg = error.response?.data?.message || error.response?.data?.error || 'Failed to load sections';
        setError(`${errorMsg} (Status: ${error.response.status})`);
      } else if (error.request) {
        setError('Cannot connect to the server. Please check your internet connection or try again later.');
      } else {
        setError(error.message || 'Failed to load sections. Please try again.');
      }
      setSections([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id, currentStatus) => {
    try {
      setError('');
      setSuccess('');
      await axios.put(API_ENDPOINTS.ADMIN.SECTION_BY_ID(id), {
        isActive: !currentStatus
      });
      setSuccess('Section status updated successfully!');
      fetchSections();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error updating section:', error);
      setError(error.response?.data?.message || 'Failed to update section status.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await axios.delete(API_ENDPOINTS.ADMIN.SECTION_BY_ID(id));
      setSuccess('Section deleted successfully!');
      fetchSections();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting section:', error);
      setError(error.response?.data?.message || 'Failed to delete section. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const getSectionTypeBadge = (type) => {
    const badges = {
      hero: 'Hero',
      featured: 'Featured',
      testimonial: 'Testimonial',
      banner: 'Banner',
      text: 'Text',
      gallery: 'Gallery',
      custom: 'Custom'
    };
    return badges[type] || type;
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading sections...</p>
      </div>
    );
  }

  return (
    <div className="admin-sections">
      <Breadcrumbs items={[{ label: 'Website Sections' }]} />
      
      <div className="sections-header">
        <div>
          <h1>Website Sections</h1>
          <p>Manage content for different sections of your website</p>
        </div>
        <Link to="/admin/sections/new" className="btn-primary btn-compact">
          <i className="fa-solid fa-plus"></i>
          Add Section
        </Link>
      </div>

      {(error || success) && (
        <div className={`admin-message ${error ? 'admin-error-message' : 'admin-success-message'}`}>
          <i className={`fa-solid fa-${error ? 'exclamation-circle' : 'check-circle'}`}></i>
          <span>{error || success}</span>
          {error && (
            <button 
              onClick={fetchSections} 
              className="btn-retry"
              style={{ marginLeft: '10px', padding: '5px 12px', fontSize: '12px' }}
            >
              <i className="fa-solid fa-refresh"></i> Retry
            </button>
          )}
        </div>
      )}

      <div className="sections-grid">
        {sections.length > 0 ? (
          sections.map((section) => (
            <div key={section._id} className="section-card">
              <div className="section-card-header">
                <div>
                  <h3>{section.sectionName}</h3>
                  <span className={`section-type-badge section-type-${section.sectionType}`}>
                    {getSectionTypeBadge(section.sectionType)}
                  </span>
                </div>
                <div className="section-actions">
                  <button
                    onClick={() => handleToggleActive(section._id, section.isActive)}
                    className={`btn-toggle ${section.isActive ? 'active' : 'inactive'}`}
                    title={section.isActive ? 'Deactivate' : 'Activate'}
                  >
                    <i className={`fa-solid fa-${section.isActive ? 'eye' : 'eye-slash'}`}></i>
                  </button>
                </div>
              </div>
              
              <div className="section-card-body">
                <p className="section-key">
                  <strong>Key:</strong> {section.sectionKey}
                </p>
                {section.title && (
                  <p className="section-title">
                    <strong>Title:</strong> {section.title}
                  </p>
                )}
                {section.description && (
                  <p className="section-description">
                    {section.description.substring(0, 100)}
                    {section.description.length > 100 ? '...' : ''}
                  </p>
                )}
                {section.images && section.images.length > 0 && (
                  <p className="section-images-count">
                    <i className="fa-solid fa-image"></i> {section.images.length} image(s)
                  </p>
                )}
              </div>

              <div className="section-card-footer">
                <Link
                  to={`/admin/sections/${section._id}/edit`}
                  className="btn-edit"
                >
                  <i className="fa-solid fa-edit"></i> Edit
                </Link>
                <button
                  onClick={() => handleDelete(section._id)}
                  className="btn-delete"
                >
                  <i className="fa-solid fa-trash"></i> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-sections">
            <i className="fa-solid fa-folder-open"></i>
            <p>No sections found. Create your first section to get started!</p>
            <Link to="/admin/sections/new" className="btn-primary btn-compact">
              <i className="fa-solid fa-plus"></i> Add Section
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sections;

