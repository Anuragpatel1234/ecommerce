import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import API_BASE_URL from '../../../config/api';
import './AboutManager.css';

const AboutManager = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    heading: '',
    subheading: '',
    description: '',
    image: '',
    btnText: '',
    btnUrl: '',
    stats: [
      { label: 'Years of Craft', value: '10+' },
      { label: 'Happy Customers', value: '5000+' },
      { label: 'Handcrafted Pieces', value: '12000+' },
    ]
  });
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

  const fetchAbout = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/sections/key/about_section`, {
        headers: { 'x-auth-token': token }
      });
      setSectionId(res.data._id);
      if (res.data.content) setData({ ...data, ...res.data.content });
    } catch (err) { /* use defaults */ }
    finally { setLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { fetchAbout(); }, [fetchAbout]);

  const update = (field, value) => {
    setData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const updateStat = (i, field, value) => {
    const stats = [...data.stats];
    stats[i] = { ...stats[i], [field]: value };
    update('stats', stats);
  };

  const addStat = () => update('stats', [...data.stats, { label: '', value: '' }]);
  const removeStat = (i) => update('stats', data.stats.filter((_, idx) => idx !== i));

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        sectionKey: 'about_section',
        sectionName: 'About Section',
        sectionType: 'about',
        isActive: !isDraft,
        isDraft,
        content: data
      };
      const url = sectionId ? `${API_BASE_URL}/api/admin/sections/${sectionId}` : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'About section published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  if (loading) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading...</p></div>;

  return (
    <div className="about-manager">
      <CMSActionBar
        title="About Section"
        breadcrumb={[{ label: 'Website CMS' }, { label: 'About Section' }]}
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

      <div className="about-manager__body">
        <div className="about-manager__grid">
          <div>
            <div className="cms-card">
              <h3 className="cms-card__title">Content</h3>
              <div className="cms-field">
                <label className="cms-label">Heading</label>
                <input type="text" className="cms-input" value={data.heading} placeholder="Our Story"
                  onChange={e => update('heading', e.target.value)} />
              </div>
              <div className="cms-field">
                <label className="cms-label">Subheading</label>
                <input type="text" className="cms-input" value={data.subheading} placeholder="Crafted with Love"
                  onChange={e => update('subheading', e.target.value)} />
              </div>
              <div className="cms-field">
                <label className="cms-label">Description</label>
                <textarea className="cms-textarea" rows={6} value={data.description}
                  placeholder="Tell your brand story..."
                  onChange={e => update('description', e.target.value)} />
              </div>
              <div className="cms-two-col">
                <div className="cms-field">
                  <label className="cms-label">Button Text</label>
                  <input type="text" className="cms-input" value={data.btnText} placeholder="Learn More"
                    onChange={e => update('btnText', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Button URL</label>
                  <input type="text" className="cms-input" value={data.btnUrl} placeholder="/about"
                    onChange={e => update('btnUrl', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="cms-card">
              <h3 className="cms-card__title">Statistics</h3>
              {data.stats.map((stat, i) => (
                <div key={i} className="about-stat-row">
                  <input type="text" className="cms-input" placeholder="Label e.g. Years"
                    value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} />
                  <input type="text" className="cms-input" placeholder="Value e.g. 10+"
                    value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} />
                  <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => removeStat(i)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
              <button type="button" className="cms-add-btn" onClick={addStat} style={{ marginTop: '12px' }}>
                <i className="fa-solid fa-plus"></i> Add Statistic
              </button>
            </div>
          </div>

          <div>
            <div className="cms-card">
              <h3 className="cms-card__title">Image</h3>
              <ImageUploader label="About Image" aspectHint="4:3 recommended"
                value={data.image} onChange={url => update('image', url)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutManager;
