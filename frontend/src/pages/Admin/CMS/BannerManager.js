import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import API_BASE_URL from '../../../config/api';
import './BannerManager.css';

const defaultBanner = () => ({
  id: Date.now() + Math.random(),
  heading: '',
  description: '',
  image: '',
  mobileBanner: '',
  ctaText: '',
  ctaLink: '',
  displayOrder: 0,
  isActive: true,
  startDate: '',
  endDate: ''
});

const BannerManager = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [expandedBanner, setExpandedBanner] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchBanners = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/sections/key/promo_banners`, {
        headers: { 'x-auth-token': token }
      });
      const section = res.data;
      setSectionId(section._id);
      setBanners(section.content?.banners || []);
      if ((section.content?.banners || []).length > 0) {
        setExpandedBanner(section.content.banners[0].id);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        const newBanner = defaultBanner();
        setBanners([newBanner]);
        setExpandedBanner(newBanner.id);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBanners(); }, [fetchBanners]);

  const markDirty = () => setIsDirty(true);

  const updateBanner = (bannerId, field, value) => {
    setBanners(prev => prev.map(b => b.id === bannerId ? { ...b, [field]: value } : b));
    markDirty();
  };

  const addBanner = () => {
    const newBanner = defaultBanner();
    setBanners(prev => [...prev, newBanner]);
    setExpandedBanner(newBanner.id);
    markDirty();
  };

  const removeBanner = (bannerId) => {
    if (banners.length === 1) {
      showNotification('At least one banner is required', 'error');
      return;
    }
    if (!window.confirm('Delete this banner? This cannot be undone.')) return;
    setBanners(prev => prev.filter(b => b.id !== bannerId));
    markDirty();
  };

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        sectionKey: 'promo_banners',
        sectionName: 'Promotional Banners',
        sectionType: 'banner',
        isActive: !isDraft,
        isDraft,
        content: {
          banners: banners.map((b, i) => ({ ...b, displayOrder: i }))
        }
      };
      const url = sectionId
        ? `${API_BASE_URL}/api/admin/sections/${sectionId}`
        : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'Banners published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  if (loading) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading Banners...</p></div>;

  return (
    <div className="banner-manager">
      <CMSActionBar
        title="Promotional Banners"
        breadcrumb={[{ label: 'Website CMS' }, { label: 'Promotional Banners' }]}
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

      <div className="banner-manager__body">
        <div className="banner-manager__list">
          {banners.map((banner, index) => (
            <div key={banner.id} className={`banner-item ${expandedBanner === banner.id ? 'expanded' : ''} ${!banner.isActive ? 'inactive' : ''}`}>
              <div className="banner-item__header" onClick={() => setExpandedBanner(expandedBanner === banner.id ? null : banner.id)}>
                <div className="banner-item__preview">
                  {banner.image
                    ? <img src={banner.image} alt="" className="banner-item__thumb" />
                    : <div className="banner-item__thumb-placeholder"><i className="fa-solid fa-image"></i></div>
                  }
                  <div>
                    <p className="banner-item__title">{banner.heading || `Banner ${index + 1}`}</p>
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <span className={`cms-badge ${banner.isActive ? 'cms-badge--active' : 'cms-badge--inactive'}`}>
                        {banner.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {banner.startDate && <span className="cms-badge cms-badge--draft">Scheduled</span>}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="cms-icon-btn cms-icon-btn--danger"
                    onClick={(e) => { e.stopPropagation(); removeBanner(banner.id); }}
                    title="Delete banner"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <i className={`fa-solid fa-chevron-${expandedBanner === banner.id ? 'up' : 'down'}`} style={{ color: '#9ca3af', fontSize: '13px' }}></i>
                </div>
              </div>

              {expandedBanner === banner.id && (
                <div className="banner-item__body">
                  <div className="banner-editor__grid">
                    <div>
                      <ImageUploader
                        label="Banner Image (Desktop)"
                        aspectHint="Recommended 1440×500"
                        value={banner.image}
                        onChange={(url) => updateBanner(banner.id, 'image', url)}
                      />
                      <div style={{ marginTop: '16px' }}>
                        <ImageUploader
                          label="Mobile Banner (optional)"
                          aspectHint="Recommended 768×400"
                          value={banner.mobileBanner}
                          onChange={(url) => updateBanner(banner.id, 'mobileBanner', url)}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="cms-field">
                        <label className="cms-label">Heading</label>
                        <input type="text" className="cms-input" placeholder="Banner headline"
                          value={banner.heading} onChange={(e) => updateBanner(banner.id, 'heading', e.target.value)} />
                      </div>
                      <div className="cms-field">
                        <label className="cms-label">Description</label>
                        <textarea className="cms-textarea" rows={2} placeholder="Short description"
                          value={banner.description} onChange={(e) => updateBanner(banner.id, 'description', e.target.value)} />
                      </div>
                      <div className="cms-two-col">
                        <div className="cms-field">
                          <label className="cms-label">CTA Button Text</label>
                          <input type="text" className="cms-input" placeholder="e.g. Shop Now"
                            value={banner.ctaText} onChange={(e) => updateBanner(banner.id, 'ctaText', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-label">CTA Link</label>
                          <input type="text" className="cms-input" placeholder="/shop"
                            value={banner.ctaLink} onChange={(e) => updateBanner(banner.id, 'ctaLink', e.target.value)} />
                        </div>
                      </div>
                      <div className="cms-two-col">
                        <div className="cms-field">
                          <label className="cms-label">Start Date (optional)</label>
                          <input type="date" className="cms-input"
                            value={banner.startDate} onChange={(e) => updateBanner(banner.id, 'startDate', e.target.value)} />
                        </div>
                        <div className="cms-field">
                          <label className="cms-label">End Date (optional)</label>
                          <input type="date" className="cms-input"
                            value={banner.endDate} onChange={(e) => updateBanner(banner.id, 'endDate', e.target.value)} />
                        </div>
                      </div>
                      <div className="cms-field">
                        <label className="cms-toggle">
                          <input type="checkbox" checked={banner.isActive}
                            onChange={(e) => updateBanner(banner.id, 'isActive', e.target.checked)} />
                          <span className="cms-toggle__track"></span>
                          <span className="cms-toggle__label">{banner.isActive ? 'Active' : 'Inactive'}</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          <button type="button" className="cms-add-btn" onClick={addBanner}>
            <i className="fa-solid fa-plus"></i> Add New Banner
          </button>
        </div>
      </div>
    </div>
  );
};

export default BannerManager;
