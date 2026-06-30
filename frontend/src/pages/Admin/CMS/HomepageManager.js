import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import API_BASE_URL from '../../../config/api';
import './HomepageManager.css';

const DEFAULT_SECTIONS = [
  { key: 'hero', label: 'Hero Slider', icon: 'fa-solid fa-image', isActive: true, order: 0 },
  { key: 'promo_banner', label: 'Promotional Banner', icon: 'fa-solid fa-rectangle-ad', isActive: true, order: 1 },
  { key: 'categories', label: 'Shop by Category', icon: 'fa-solid fa-th-large', isActive: true, order: 2 },
  { key: 'new_arrivals', label: 'New Arrivals', icon: 'fa-solid fa-tags', isActive: true, order: 3 },
  { key: 'featured_collection', label: 'Featured Collection', icon: 'fa-solid fa-star', isActive: true, order: 4 },
  { key: 'handcraft', label: 'Handcraft Story', icon: 'fa-solid fa-hands', isActive: true, order: 5 },
  { key: 'shop_section', label: 'Shop Section', icon: 'fa-solid fa-bag-shopping', isActive: true, order: 6 },
  { key: 'testimonials', label: 'Testimonials', icon: 'fa-regular fa-star', isActive: true, order: 7 },
  { key: 'newsletter', label: 'Newsletter', icon: 'fa-solid fa-envelope', isActive: true, order: 8 },
];

const HomepageManager = () => {
  const navigate = useNavigate();
  const [sections, setSections] = useState(DEFAULT_SECTIONS);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sectionId, setSectionId] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchHomepage = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/sections/key/homepage_layout`, {
        headers: { 'x-auth-token': token }
      });
      setSectionId(res.data._id);
      if (res.data.content?.sections) {
        setSections(res.data.content.sections);
      }
    } catch (err) {
      // Use defaults if not saved yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchHomepage(); }, [fetchHomepage]);

  const toggleSection = (key) => {
    setSections(prev => prev.map(s => s.key === key ? { ...s, isActive: !s.isActive } : s));
    setIsDirty(true);
  };

  const moveSection = (index, dir) => {
    const next = [...sections];
    const target = index + dir;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next.map((s, i) => ({ ...s, order: i })));
    setIsDirty(true);
  };

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        sectionKey: 'homepage_layout',
        sectionName: 'Homepage Layout',
        sectionType: 'homepage',
        isActive: true,
        isDraft,
        content: { sections: sections.map((s, i) => ({ ...s, order: i })) }
      };
      const url = sectionId
        ? `${API_BASE_URL}/api/admin/sections/${sectionId}`
        : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'Homepage layout published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  if (loading) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading...</p></div>;

  return (
    <div className="homepage-manager">
      <CMSActionBar
        title="Homepage Sections"
        breadcrumb={[{ label: 'Website CMS' }, { label: 'Homepage' }]}
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

      <div className="homepage-manager__body">
        <div className="cms-card">
          <h3 className="cms-card__title">Section Visibility & Order</h3>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '20px', marginTop: '-8px' }}>
            Toggle sections on or off, or drag them to reorder. Changes are reflected on the live homepage when you publish.
          </p>

          <div className="homepage-sections-list">
            {sections.map((section, i) => (
              <div key={section.key} className={`homepage-section-item ${!section.isActive ? 'inactive' : ''}`}>
                <div className="homepage-section-item__drag">
                  <i className="fa-solid fa-grip-vertical"></i>
                </div>
                <div className="homepage-section-item__icon">
                  <i className={section.icon}></i>
                </div>
                <div className="homepage-section-item__info">
                  <span className="homepage-section-item__label">{section.label}</span>
                  <span className="homepage-section-item__order">Position {i + 1}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <button type="button" className="cms-icon-btn" onClick={() => moveSection(i, -1)} disabled={i === 0} title="Move up">
                    <i className="fa-solid fa-arrow-up"></i>
                  </button>
                  <button type="button" className="cms-icon-btn" onClick={() => moveSection(i, 1)} disabled={i === sections.length - 1} title="Move down">
                    <i className="fa-solid fa-arrow-down"></i>
                  </button>
                  <label className="cms-toggle">
                    <input type="checkbox" checked={section.isActive} onChange={() => toggleSection(section.key)} />
                    <span className="cms-toggle__track"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomepageManager;
