import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import API_BASE_URL, { API_ENDPOINTS } from '../../../config/api';
import './HeroManager.css';

const defaultSlide = () => ({
  id: Date.now(),
  heading: '',
  subheading: '',
  description: '',
  image: '',
  mobileImage: '',
  primaryBtnText: '',
  primaryBtnUrl: '',
  secondaryBtnText: '',
  secondaryBtnUrl: '',
  overlayOpacity: 0.3,
  isActive: true
});

const HeroManager = () => {
  const navigate = useNavigate();
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [sectionId, setSectionId] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchHeroSection = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(API_ENDPOINTS.CMS.SECTION_BY_KEY('hero_section'), {
        headers: { 'x-auth-token': token }
      });
      const section = res.data;
      setSectionId(section._id);
      if (section.content?.slides?.length > 0) {
        setSlides(section.content.slides.map((s, i) => ({ ...s, id: s.id || i })));
      } else {
        setSlides([defaultSlide()]);
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setSlides([defaultSlide()]);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHeroSection(); }, [fetchHeroSection]);

  const markDirty = () => setIsDirty(true);

  const updateSlide = (index, field, value) => {
    setSlides(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
    markDirty();
  };

  const addSlide = () => {
    setSlides(prev => [...prev, defaultSlide()]);
    setActiveSlide(slides.length);
    markDirty();
  };

  const removeSlide = (index) => {
    if (slides.length === 1) return showNotification('At least one slide is required', 'error');
    setSlides(prev => prev.filter((_, i) => i !== index));
    setActiveSlide(Math.max(0, activeSlide - 1));
    markDirty();
  };

  const moveSlide = (index, direction) => {
    const newSlides = [...slides];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= newSlides.length) return;
    [newSlides[index], newSlides[targetIndex]] = [newSlides[targetIndex], newSlides[index]];
    setSlides(newSlides);
    setActiveSlide(targetIndex);
    markDirty();
  };

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        sectionKey: 'hero_section',
        sectionName: 'Hero Section',
        sectionType: 'hero',
        isActive: !isDraft,
        isDraft,
        content: { slides }
      };
      const url = sectionId
        ? `${API_BASE_URL}/api/admin/sections/${sectionId}`
        : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved successfully' : 'Hero section published!', 'success');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  if (loading) return (
    <div className="cms-page-loading">
      <div className="cms-spinner"></div>
      <p>Loading Hero Section...</p>
    </div>
  );

  return (
    <div className="hero-manager">
      <CMSActionBar
        title="Hero Section"
        breadcrumb={[{ label: 'Website CMS' }, { label: 'Hero Section' }]}
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

      <div className="hero-manager__body">
        {/* Slide Tabs */}
        <div className="hero-manager__tabs">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`hero-manager__tab ${activeSlide === i ? 'active' : ''} ${!slide.isActive ? 'inactive' : ''}`}
              onClick={() => setActiveSlide(i)}
            >
              <span>Slide {i + 1}</span>
              {!slide.isActive && <span className="hero-manager__tab-inactive">Hidden</span>}
            </button>
          ))}
          <button type="button" className="hero-manager__add-tab" onClick={addSlide}>
            <i className="fa-solid fa-plus"></i> Add Slide
          </button>
        </div>

        {slides[activeSlide] && (
          <div className="hero-manager__editor">
            {/* Slide Controls */}
            <div className="hero-manager__slide-controls">
              <div className="hero-manager__slide-label">Slide {activeSlide + 1} of {slides.length}</div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <label className="cms-toggle">
                  <input
                    type="checkbox"
                    checked={slides[activeSlide].isActive}
                    onChange={(e) => updateSlide(activeSlide, 'isActive', e.target.checked)}
                  />
                  <span className="cms-toggle__track"></span>
                  <span className="cms-toggle__label">{slides[activeSlide].isActive ? 'Active' : 'Hidden'}</span>
                </label>
                <button
                  type="button"
                  className="cms-icon-btn"
                  onClick={() => moveSlide(activeSlide, -1)}
                  disabled={activeSlide === 0}
                  title="Move left"
                >
                  <i className="fa-solid fa-arrow-left"></i>
                </button>
                <button
                  type="button"
                  className="cms-icon-btn"
                  onClick={() => moveSlide(activeSlide, 1)}
                  disabled={activeSlide === slides.length - 1}
                  title="Move right"
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
                <button
                  type="button"
                  className="cms-icon-btn cms-icon-btn--danger"
                  onClick={() => removeSlide(activeSlide)}
                  title="Delete slide"
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </div>

            <div className="hero-manager__grid">
              {/* Left: Images */}
              <div className="hero-manager__col">
                <div className="cms-card">
                  <h3 className="cms-card__title">Images</h3>
                  <ImageUploader
                    label="Desktop Image"
                    aspectHint="16:9 or wider"
                    value={slides[activeSlide].image}
                    onChange={(url) => updateSlide(activeSlide, 'image', url)}
                  />
                  <div style={{ marginTop: '20px' }}>
                    <ImageUploader
                      label="Mobile Image (optional)"
                      aspectHint="9:16"
                      value={slides[activeSlide].mobileImage}
                      onChange={(url) => updateSlide(activeSlide, 'mobileImage', url)}
                    />
                  </div>
                </div>

                <div className="cms-card">
                  <h3 className="cms-card__title">Overlay</h3>
                  <label className="cms-label">Overlay Opacity ({Math.round((slides[activeSlide].overlayOpacity || 0) * 100)}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="0.9"
                    step="0.05"
                    value={slides[activeSlide].overlayOpacity || 0}
                    onChange={(e) => updateSlide(activeSlide, 'overlayOpacity', parseFloat(e.target.value))}
                    className="cms-range"
                  />
                </div>
              </div>

              {/* Right: Content */}
              <div className="hero-manager__col">
                <div className="cms-card">
                  <h3 className="cms-card__title">Content</h3>
                  <div className="cms-field">
                    <label className="cms-label">Heading</label>
                    <input
                      type="text"
                      className="cms-input"
                      placeholder="e.g. New Arrivals — Festive 2025"
                      value={slides[activeSlide].heading}
                      onChange={(e) => updateSlide(activeSlide, 'heading', e.target.value)}
                    />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Subheading</label>
                    <input
                      type="text"
                      className="cms-input"
                      placeholder="e.g. Luxury Ethnic Wear"
                      value={slides[activeSlide].subheading}
                      onChange={(e) => updateSlide(activeSlide, 'subheading', e.target.value)}
                    />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Description</label>
                    <textarea
                      className="cms-textarea"
                      rows={3}
                      placeholder="A short description for the hero slide..."
                      value={slides[activeSlide].description}
                      onChange={(e) => updateSlide(activeSlide, 'description', e.target.value)}
                    />
                  </div>
                </div>

                <div className="cms-card">
                  <h3 className="cms-card__title">Call to Action Buttons</h3>
                  <div className="cms-two-col">
                    <div className="cms-field">
                      <label className="cms-label">Primary Button Text</label>
                      <input
                        type="text"
                        className="cms-input"
                        placeholder="e.g. Shop Now"
                        value={slides[activeSlide].primaryBtnText}
                        onChange={(e) => updateSlide(activeSlide, 'primaryBtnText', e.target.value)}
                      />
                    </div>
                    <div className="cms-field">
                      <label className="cms-label">Primary Button URL</label>
                      <input
                        type="text"
                        className="cms-input"
                        placeholder="/shop"
                        value={slides[activeSlide].primaryBtnUrl}
                        onChange={(e) => updateSlide(activeSlide, 'primaryBtnUrl', e.target.value)}
                      />
                    </div>
                    <div className="cms-field">
                      <label className="cms-label">Secondary Button Text</label>
                      <input
                        type="text"
                        className="cms-input"
                        placeholder="e.g. Explore Collections"
                        value={slides[activeSlide].secondaryBtnText}
                        onChange={(e) => updateSlide(activeSlide, 'secondaryBtnText', e.target.value)}
                      />
                    </div>
                    <div className="cms-field">
                      <label className="cms-label">Secondary Button URL</label>
                      <input
                        type="text"
                        className="cms-input"
                        placeholder="/shop?filter=newArrival"
                        value={slides[activeSlide].secondaryBtnUrl}
                        onChange={(e) => updateSlide(activeSlide, 'secondaryBtnUrl', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeroManager;
