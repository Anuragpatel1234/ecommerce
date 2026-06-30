import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import { API_ENDPOINTS } from '../../../config/api';
import './FooterManager.css';

const FooterManager = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('company');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchSettings = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(API_ENDPOINTS.CMS.SETTINGS, { headers: { 'x-auth-token': token } });
      setSettings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const update = (path, value) => {
    setSettings(prev => {
      const next = { ...prev };
      const keys = path.split('.');
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj[keys[i]] = { ...obj[keys[i]] };
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    setIsDirty(true);
  };

  const addQuickLink = () => {
    update('footer.quickLinks', [...(settings.footer?.quickLinks || []), { label: '', url: '', order: 0 }]);
  };

  const updateQuickLink = (i, field, value) => {
    const links = [...(settings.footer?.quickLinks || [])];
    links[i] = { ...links[i], [field]: value };
    update('footer.quickLinks', links);
  };

  const removeQuickLink = (i) => {
    update('footer.quickLinks', (settings.footer?.quickLinks || []).filter((_, idx) => idx !== i));
  };

  const saveSettings = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(API_ENDPOINTS.CMS.SETTINGS, settings, { headers: { 'x-auth-token': token } });
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'Footer published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally { setIsSaving(false); setIsPublishing(false); }
  };

  if (loading || !settings) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading Footer...</p></div>;

  const TABS = [
    { key: 'company', label: 'Company Info' },
    { key: 'links', label: 'Quick Links' },
    { key: 'social', label: 'Social Media' },
    { key: 'policies', label: 'Copyright & Policies' },
  ];

  return (
    <div className="footer-manager">
      <CMSActionBar title="Footer Management" breadcrumb={[{ label: 'Website CMS' }, { label: 'Footer' }]}
        onSaveDraft={() => saveSettings(true)} onPublish={() => saveSettings(false)} onCancel={() => navigate('/admin/cms')}
        isSaving={isSaving} isPublishing={isPublishing} isDirty={isDirty} lastSaved={lastSaved} />

      {notification && (
        <div className={`cms-notification cms-notification--${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}

      <div className="footer-manager__body">
        <div className="footer-manager__tabs">
          {TABS.map(tab => (
            <button key={tab.key} type="button"
              className={`footer-manager__tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'company' && (
          <div className="cms-card">
            <h3 className="cms-card__title">Company Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
              <div>
                <div className="cms-field">
                  <label className="cms-label">Footer Description</label>
                  <textarea className="cms-textarea" rows={3} value={settings.footer?.description || ''}
                    placeholder="A short brand description for the footer..."
                    onChange={e => update('footer.description', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Address</label>
                  <textarea className="cms-textarea" rows={2} value={settings.contact?.address || ''}
                    onChange={e => update('contact.address', e.target.value)} />
                </div>
                <div className="cms-two-col">
                  <div className="cms-field">
                    <label className="cms-label">Email</label>
                    <input type="email" className="cms-input" value={settings.contact?.email || ''}
                      onChange={e => update('contact.email', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Phone</label>
                    <input type="text" className="cms-input" value={settings.contact?.phone || ''}
                      onChange={e => update('contact.phone', e.target.value)} />
                  </div>
                </div>
                <div className="cms-two-col">
                  <div className="cms-field">
                    <label className="cms-label">WhatsApp</label>
                    <input type="text" className="cms-input" value={settings.contact?.whatsapp || ''} placeholder="+91 9876543210"
                      onChange={e => update('contact.whatsapp', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Google Maps Link</label>
                    <input type="text" className="cms-input" value={settings.contact?.googleMapsLink || ''}
                      onChange={e => update('contact.googleMapsLink', e.target.value)} />
                  </div>
                </div>
              </div>
              <div>
                <ImageUploader label="Footer Logo" value={settings.logo || ''}
                  onChange={url => update('logo', url)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'links' && (
          <div className="cms-card">
            <h3 className="cms-card__title">Quick Links</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '14px' }}>
              {(settings.footer?.quickLinks || []).map((link, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input type="text" className="cms-input" placeholder="Label e.g. About Us"
                    value={link.label} onChange={e => updateQuickLink(i, 'label', e.target.value)} />
                  <input type="text" className="cms-input" placeholder="URL e.g. /about"
                    value={link.url} onChange={e => updateQuickLink(i, 'url', e.target.value)} />
                  <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => removeQuickLink(i)}>
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              ))}
            </div>
            <button type="button" className="cms-add-btn" onClick={addQuickLink}>
              <i className="fa-solid fa-plus"></i> Add Link
            </button>
          </div>
        )}

        {activeTab === 'social' && (
          <div className="cms-card">
            <h3 className="cms-card__title">Social Media Links</h3>
            {['instagram', 'facebook', 'youtube', 'twitter', 'pinterest'].map(platform => (
              <div key={platform} className="cms-field">
                <label className="cms-label" style={{ textTransform: 'capitalize' }}>
                  <i className={`fa-brands fa-${platform}`} style={{ marginRight: '8px', color: '#6b7280' }}></i>
                  {platform}
                </label>
                <input type="url" className="cms-input" placeholder={`https://${platform}.com/rangaara`}
                  value={settings.social?.[platform] || ''}
                  onChange={e => update(`social.${platform}`, e.target.value)} />
              </div>
            ))}
          </div>
        )}

        {activeTab === 'policies' && (
          <div className="cms-card">
            <h3 className="cms-card__title">Copyright & Policies</h3>
            <div className="cms-field">
              <label className="cms-label">Copyright Text</label>
              <input type="text" className="cms-input" value={settings.footer?.copyright || ''}
                placeholder="© 2025 Rangaara. All rights reserved."
                onChange={e => update('footer.copyright', e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FooterManager;
