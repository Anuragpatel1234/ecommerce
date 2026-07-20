import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import API_BASE_URL from '../../../config/api';
import './TestimonialManager.css';

const defaultTestimonial = () => ({
  id: Date.now() + Math.random(),
  customerName: '',
  designation: '',
  image: '',
  rating: 5,
  testimonial: '',
  isActive: true
});

const fallbackTestimonialsData = [
  {
    id: 1,
    testimonial: "The quality and craftsmanship are exceptional. Every piece tells a story and I feel confident wearing RANGAARA designs.",
    customerName: "Priya Sharma",
    designation: "Mumbai",
    rating: 5,
    image: "",
    isActive: true
  },
  {
    id: 2,
    testimonial: "Absolutely love the handcraft designs! The attention to detail is amazing and the fit is perfect. Highly recommend!",
    customerName: "Ananya Patel",
    designation: "Delhi",
    rating: 5,
    image: "",
    isActive: true
  },
  {
    id: 3,
    testimonial: "RANGAARA has become my go-to brand for traditional elegance. The designs beautifully blend heritage craftsmanship with modern style.",
    customerName: "Riya Mehta",
    designation: "Bangalore",
    rating: 5,
    image: "",
    isActive: true
  }
];


const StarRating = ({ value, onChange }) => (
  <div className="star-rating">
    {[1,2,3,4,5].map(n => (
      <button key={n} type="button"
        className={`star-rating__btn ${n <= value ? 'filled' : ''}`}
        onClick={() => onChange(n)}>
        <i className={`fa-${n <= value ? 'solid' : 'regular'} fa-star`}></i>
      </button>
    ))}
  </div>
);

const TestimonialManager = () => {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchTestimonials = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/sections/key/testimonials_section`, {
        headers: { 'x-auth-token': token }
      });
      setSectionId(res.data._id);
      setTestimonials(res.data.content?.testimonials?.length > 0 ? res.data.content.testimonials : fallbackTestimonialsData);
    } catch (err) { if (err.response?.status === 404) setTestimonials(fallbackTestimonialsData); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchTestimonials(); }, [fetchTestimonials]);

  const markDirty = () => setIsDirty(true);

  const addTestimonial = () => {
    const t = defaultTestimonial();
    setTestimonials(prev => [...prev, t]);
    setEditingId(t.id);
    markDirty();
  };

  const updateTestimonial = (id, field, value) => {
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
    markDirty();
  };

  const removeTestimonial = (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    setTestimonials(prev => prev.filter(t => t.id !== id));
    if (editingId === id) setEditingId(null);
    markDirty();
  };

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        sectionKey: 'testimonials_section',
        sectionName: 'Testimonials',
        sectionType: 'testimonial',
        isActive: !isDraft,
        isDraft,
        content: { testimonials }
      };
      const url = sectionId ? `${API_BASE_URL}/api/admin/sections/${sectionId}` : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'Testimonials published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  if (loading) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading...</p></div>;

  const editing = testimonials.find(t => t.id === editingId);

  return (
    <div className="testimonial-manager">
      <CMSActionBar
        title="Testimonials"
        breadcrumb={[{ label: 'Website CMS' }, { label: 'Testimonials' }]}
        onSaveDraft={() => saveSection(true)}
        onPublish={() => saveSection(false)}
        onCancel={() => navigate('/admin/cms')}
        isSaving={isSaving}
        isPublishing={isPublishing}
        isDirty={isDirty}
        lastSaved={lastSaved}
      />

      {notification && (
        <div className={`cms-notification cms-notification--${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}

      <div className="testimonial-manager__body">
        <div className="testimonial-manager__layout">
          {/* List */}
          <div>
            <div className="cms-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cms-card__title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                  Testimonials ({testimonials.length})
                </h3>
                <button type="button" className="cms-action-bar__btn cms-action-bar__btn--primary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={addTestimonial}>
                  <i className="fa-solid fa-plus"></i> Add
                </button>
              </div>

              {testimonials.length === 0 ? (
                <div className="category-manager__empty">
                  <i className="fa-regular fa-star"></i>
                  <p>No testimonials yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {testimonials.map(t => (
                    <div
                      key={t.id}
                      className={`testimonial-list-item ${editingId === t.id ? 'editing' : ''} ${!t.isActive ? 'inactive' : ''}`}
                      onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                    >
                      {t.image
                        ? <img src={t.image} alt={t.customerName} className="testimonial-list-item__avatar" />
                        : <div className="testimonial-list-item__avatar-placeholder"><i className="fa-solid fa-user"></i></div>
                      }
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: '#111827' }}>{t.customerName || 'Unnamed'}</p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af' }}>{t.designation}</p>
                        <div>
                          {[1,2,3,4,5].map(n => (
                            <i key={n} className={`fa-${n <= t.rating ? 'solid' : 'regular'} fa-star`} style={{ fontSize: '11px', color: '#f59e0b' }}></i>
                          ))}
                        </div>
                      </div>
                      <span className={`cms-badge ${t.isActive ? 'cms-badge--active' : 'cms-badge--inactive'}`}>
                        {t.isActive ? 'Active' : 'Hidden'}
                      </span>
                      <button type="button" className="cms-icon-btn cms-icon-btn--danger"
                        onClick={(e) => { e.stopPropagation(); removeTestimonial(t.id); }}>
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit Panel */}
          {editing && (
            <div className="testimonial-manager__editor">
              <div className="cms-card">
                <h3 className="cms-card__title">Edit Testimonial</h3>
                <ImageUploader label="Customer Photo (optional)" aspectHint="1:1"
                  value={editing.image} onChange={(url) => updateTestimonial(editing.id, 'image', url)} />
                <div className="cms-field" style={{ marginTop: '16px' }}>
                  <label className="cms-label">Customer Name *</label>
                  <input type="text" className="cms-input" placeholder="e.g. Priya Sharma"
                    value={editing.customerName} onChange={e => updateTestimonial(editing.id, 'customerName', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Designation</label>
                  <input type="text" className="cms-input" placeholder="e.g. Fashion Enthusiast, Mumbai"
                    value={editing.designation} onChange={e => updateTestimonial(editing.id, 'designation', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Rating</label>
                  <StarRating value={editing.rating} onChange={v => updateTestimonial(editing.id, 'rating', v)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Testimonial *</label>
                  <textarea className="cms-textarea" rows={4} placeholder="What did the customer say?"
                    value={editing.testimonial} onChange={e => updateTestimonial(editing.id, 'testimonial', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-toggle">
                    <input type="checkbox" checked={editing.isActive}
                      onChange={e => updateTestimonial(editing.id, 'isActive', e.target.checked)} />
                    <span className="cms-toggle__track"></span>
                    <span className="cms-toggle__label">{editing.isActive ? 'Active' : 'Hidden'}</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestimonialManager;
