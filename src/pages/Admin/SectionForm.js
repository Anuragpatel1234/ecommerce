import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './SectionForm.css';

const SectionForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    sectionKey: '',
    sectionName: '',
    sectionType: 'custom',
    title: '',
    subtitle: '',
    description: '',
    content: {},
    images: [],
    links: [],
    isActive: true,
    order: 0,
    metadata: {}
  });

  const [newImage, setNewImage] = useState({ url: '', alt: '' });
  const [newLink, setNewLink] = useState({ text: '', url: '', type: 'internal' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isEdit) {
      fetchSection();
    }
  }, [id]);

  const fetchSection = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_ENDPOINTS.ADMIN.SECTION_BY_ID(id));
      const section = res.data;
      setFormData({
        sectionKey: section.sectionKey || '',
        sectionName: section.sectionName || '',
        sectionType: section.sectionType || 'custom',
        title: section.title || '',
        subtitle: section.subtitle || '',
        description: section.description || '',
        content: section.content || {},
        images: section.images || [],
        links: section.links || [],
        isActive: section.isActive !== false,
        order: section.order || 0,
        metadata: section.metadata || {}
      });
    } catch (error) {
      console.error('Error fetching section:', error);
      setError('Failed to load section. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // handleContentChange is defined for future use with custom content fields
  // eslint-disable-next-line no-unused-vars
  const handleContentChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        [key]: value
      }
    }));
  };

  const addImage = () => {
    if (newImage.url.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, { ...newImage, order: prev.images.length }]
      }));
      setNewImage({ url: '', alt: '' });
    }
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const addLink = () => {
    if (newLink.text.trim() && newLink.url.trim()) {
      setFormData(prev => ({
        ...prev,
        links: [...prev.links, newLink]
      }));
      setNewLink({ text: '', url: '', type: 'internal' });
    }
  };

  const removeLink = (index) => {
    setFormData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!formData.sectionKey.trim() || !formData.sectionName.trim()) {
        setError('Section key and name are required');
        setLoading(false);
        return;
      }

      if (isEdit) {
        await axios.put(API_ENDPOINTS.ADMIN.SECTION_BY_ID(id), formData);
      } else {
        await axios.post(API_ENDPOINTS.ADMIN.SECTIONS, formData);
      }

      navigate('/admin/sections');
    } catch (error) {
      console.error('Error saving section:', error);
      setError(error.response?.data?.message || 'Failed to save section. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
        <p>Loading section...</p>
      </div>
    );
  }

  return (
    <div className="section-form-page">
      <Breadcrumbs items={[
        { label: 'Website Sections', path: '/admin/sections' },
        { label: isEdit ? 'Edit Section' : 'Add New Section' }
      ]} />

      <div className="form-header">
        <div>
          <h1>{isEdit ? 'Edit Section' : 'Add New Section'}</h1>
          <p className="form-subtitle">
            {isEdit ? 'Update section information below' : 'Fill in the details to create a new website section'}
          </p>
        </div>
        <button onClick={() => navigate('/admin/sections')} className="btn-secondary">
          <i className="fa-solid fa-times"></i> Cancel
        </button>
      </div>

      {error && (
        <div className="error-message">
          <i className="fa-solid fa-exclamation-circle"></i> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="section-form">
        <div className="form-section">
          <h2>Basic Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Section Key *</label>
              <input
                type="text"
                name="sectionKey"
                value={formData.sectionKey}
                onChange={handleChange}
                placeholder="hero-slider"
                required
                disabled={isEdit}
                className={isEdit ? 'disabled' : ''}
              />
              <small>Unique identifier (lowercase, no spaces). Cannot be changed after creation.</small>
            </div>

            <div className="form-group">
              <label>Section Name *</label>
              <input
                type="text"
                name="sectionName"
                value={formData.sectionName}
                onChange={handleChange}
                placeholder="Hero Slider"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Section Type *</label>
              <select
                name="sectionType"
                value={formData.sectionType}
                onChange={handleChange}
                required
              >
                <option value="hero">Hero</option>
                <option value="featured">Featured</option>
                <option value="testimonial">Testimonial</option>
                <option value="banner">Banner</option>
                <option value="text">Text</option>
                <option value="gallery">Gallery</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            <div className="form-group">
              <label>Order</label>
              <input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                min="0"
              />
              <small>Display order (lower numbers appear first)</small>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Content</h2>

          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Section Title"
            />
          </div>

          <div className="form-group">
            <label>Subtitle</label>
            <input
              type="text"
              name="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              placeholder="Section Subtitle"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="Section description..."
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Images</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={newImage.url}
                onChange={(e) => setNewImage({ ...newImage, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="form-group">
              <label>Alt Text</label>
              <input
                type="text"
                value={newImage.alt}
                onChange={(e) => setNewImage({ ...newImage, alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
              <button type="button" onClick={addImage} className="btn-add">
                <i className="fa-solid fa-plus"></i> Add Image
              </button>
            </div>
          </div>

          {formData.images.length > 0 && (
            <div className="images-list">
              {formData.images.map((image, index) => (
                <div key={index} className="image-item">
                  <img src={image.url} alt={image.alt || 'Section image'} onError={(e) => e.target.style.display = 'none'} />
                  <div className="image-info">
                    <p><strong>URL:</strong> {image.url}</p>
                    <p><strong>Alt:</strong> {image.alt || 'No alt text'}</p>
                  </div>
                  <button type="button" onClick={() => removeImage(index)} className="btn-remove">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Links</h2>

          <div className="form-row">
            <div className="form-group">
              <label>Link Text</label>
              <input
                type="text"
                value={newLink.text}
                onChange={(e) => setNewLink({ ...newLink, text: e.target.value })}
                placeholder="Button Text"
              />
            </div>
            <div className="form-group">
              <label>Link URL</label>
              <input
                type="text"
                value={newLink.url}
                onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
                placeholder="/shop or https://example.com"
              />
            </div>
            <div className="form-group">
              <label>Link Type</label>
              <select
                value={newLink.type}
                onChange={(e) => setNewLink({ ...newLink, type: e.target.value })}
              >
                <option value="internal">Internal</option>
                <option value="external">External</option>
              </select>
            </div>
            <div className="form-group">
              <label>&nbsp;</label>
              <button type="button" onClick={addLink} className="btn-add">
                <i className="fa-solid fa-plus"></i> Add Link
              </button>
            </div>
          </div>

          {formData.links.length > 0 && (
            <div className="links-list">
              {formData.links.map((link, index) => (
                <div key={index} className="link-item">
                  <span><strong>{link.text}</strong> - {link.url} ({link.type})</span>
                  <button type="button" onClick={() => removeLink(index)} className="btn-remove">
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-section">
          <h2>Settings</h2>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
              />
              Active (Show on website)
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className={`fa-solid fa-${isEdit ? 'save' : 'plus'}`}></i>
                {isEdit ? 'Update Section' : 'Create Section'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SectionForm;

