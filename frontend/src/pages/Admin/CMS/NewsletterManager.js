import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import API_BASE_URL from '../../../config/api';

const NewsletterManager = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({ heading: '', description: '', backgroundImage: '', buttonText: 'Subscribe Now', placeholderText: 'Enter your email address' });
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

  const fetchSection = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/sections/key/newsletter_section`, { headers: { 'x-auth-token': token } });
      setSectionId(res.data._id);
      if (res.data.content) setData(prev => ({ ...prev, ...res.data.content }));
    } catch (err) { /* use defaults */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSection(); }, [fetchSection]);

  const update = (field, value) => { setData(prev => ({ ...prev, [field]: value })); setIsDirty(true); };

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = { sectionKey: 'newsletter_section', sectionName: 'Newsletter Section', sectionType: 'newsletter', isActive: !isDraft, isDraft, content: data };
      const url = sectionId ? `${API_BASE_URL}/api/admin/sections/${sectionId}` : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'Newsletter section published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally { setIsSaving(false); setIsPublishing(false); }
  };

  if (loading) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading...</p></div>;

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <CMSActionBar title="Newsletter Section" breadcrumb={[{ label: 'Website CMS' }, { label: 'Newsletter' }]}
        onSaveDraft={() => saveSection(true)} onPublish={() => saveSection(false)} onCancel={() => navigate('/admin/cms')}
        isSaving={isSaving} isPublishing={isPublishing} isDirty={isDirty} lastSaved={lastSaved} />

      {notification && (
        <div className={`cms-notification cms-notification--${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}

      <div style={{ padding: '24px 32px', maxWidth: '900px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>
          <div>
            <div className="cms-card">
              <h3 className="cms-card__title">Content</h3>
              <div className="cms-field">
                <label className="cms-label">Heading</label>
                <input type="text" className="cms-input" value={data.heading} placeholder="Join Our Community"
                  onChange={e => update('heading', e.target.value)} />
              </div>
              <div className="cms-field">
                <label className="cms-label">Description</label>
                <textarea className="cms-textarea" rows={3} value={data.description}
                  placeholder="Subscribe for exclusive offers and new arrivals..."
                  onChange={e => update('description', e.target.value)} />
              </div>
              <div className="cms-two-col">
                <div className="cms-field">
                  <label className="cms-label">Button Text</label>
                  <input type="text" className="cms-input" value={data.buttonText}
                    onChange={e => update('buttonText', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Input Placeholder</label>
                  <input type="text" className="cms-input" value={data.placeholderText}
                    onChange={e => update('placeholderText', e.target.value)} />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="cms-card">
              <h3 className="cms-card__title">Background</h3>
              <ImageUploader label="Background Image" aspectHint="Wide banner"
                value={data.backgroundImage} onChange={url => update('backgroundImage', url)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterManager;
