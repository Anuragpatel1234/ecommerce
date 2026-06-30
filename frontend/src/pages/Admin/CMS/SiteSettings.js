import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import { API_ENDPOINTS } from '../../../config/api';
import './SiteSettings.css';

const SiteSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('general');

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

  const saveSettings = async () => {
    setIsSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(API_ENDPOINTS.CMS.SETTINGS, settings, { headers: { 'x-auth-token': token } });
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification('Settings saved successfully!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally { setIsSaving(false); }
  };

  if (loading || !settings) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading Settings...</p></div>;

  const TABS = [
    { key: 'general', label: 'General', icon: 'fa-solid fa-gear' },
    { key: 'contact', label: 'Contact', icon: 'fa-solid fa-address-book' },
    { key: 'social', label: 'Social Media', icon: 'fa-brands fa-instagram' },
    { key: 'seo', label: 'SEO', icon: 'fa-solid fa-magnifying-glass' },
    { key: 'announcement', label: 'Announcement', icon: 'fa-solid fa-bullhorn' },
  ];

  return (
    <div className="site-settings">
      <CMSActionBar title="Site Settings" breadcrumb={[{ label: 'Website CMS' }, { label: 'Settings' }]}
        onPublish={saveSettings} onCancel={() => navigate('/admin/cms')}
        isPublishing={isSaving} isDirty={isDirty} lastSaved={lastSaved} publishLabel="Save Settings" />

      {notification && (
        <div className={`cms-notification cms-notification--${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}

      <div className="site-settings__body">
        <div className="site-settings__tabs">
          {TABS.map(tab => (
            <button key={tab.key} type="button"
              className={`site-settings__tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}>
              <i className={tab.icon}></i> {tab.label}
            </button>
          ))}
        </div>

        <div className="site-settings__content">
          {activeTab === 'general' && (
            <div className="cms-card">
              <h3 className="cms-card__title">General Settings</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px', alignItems: 'start' }}>
                <div>
                  <div className="cms-field">
                    <label className="cms-label">Website Name *</label>
                    <input type="text" className="cms-input" value={settings.siteName || ''}
                      onChange={e => update('siteName', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Tagline</label>
                    <input type="text" className="cms-input" value={settings.tagline || ''}
                      placeholder="e.g. Luxury Indian Ethnic Wear"
                      onChange={e => update('tagline', e.target.value)} />
                  </div>
                </div>
                <div>
                  <ImageUploader label="Logo" aspectHint="Transparent PNG" value={settings.logo || ''}
                    onChange={url => update('logo', url)} />
                  <div style={{ marginTop: '16px' }}>
                    <ImageUploader label="Favicon" aspectHint="32×32 or 64×64" value={settings.favicon || ''}
                      onChange={url => update('favicon', url)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="cms-card">
              <h3 className="cms-card__title">Contact Information</h3>
              <div className="cms-two-col">
                <div className="cms-field">
                  <label className="cms-label">Business Email</label>
                  <input type="email" className="cms-input" value={settings.contact?.email || ''}
                    onChange={e => update('contact.email', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Phone Number</label>
                  <input type="text" className="cms-input" value={settings.contact?.phone || ''}
                    onChange={e => update('contact.phone', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">WhatsApp Number</label>
                  <input type="text" className="cms-input" placeholder="+91 9876543210" value={settings.contact?.whatsapp || ''}
                    onChange={e => update('contact.whatsapp', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">Google Maps Link</label>
                  <input type="url" className="cms-input" value={settings.contact?.googleMapsLink || ''}
                    onChange={e => update('contact.googleMapsLink', e.target.value)} />
                </div>
              </div>
              <div className="cms-field">
                <label className="cms-label">Business Address</label>
                <textarea className="cms-textarea" rows={2} value={settings.contact?.address || ''}
                  onChange={e => update('contact.address', e.target.value)} />
              </div>
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
                  <input type="url" className="cms-input" placeholder={`https://${platform}.com/yourpage`}
                    value={settings.social?.[platform] || ''}
                    onChange={e => update(`social.${platform}`, e.target.value)} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="cms-card">
              <h3 className="cms-card__title">Default SEO Settings</h3>
              <div className="cms-field">
                <label className="cms-label">Default Meta Title</label>
                <input type="text" className="cms-input" value={settings.seo?.metaTitle || ''}
                  onChange={e => update('seo.metaTitle', e.target.value)} />
              </div>
              <div className="cms-field">
                <label className="cms-label">Default Meta Description</label>
                <textarea className="cms-textarea" rows={3} value={settings.seo?.metaDescription || ''}
                  onChange={e => update('seo.metaDescription', e.target.value)} />
              </div>
              <div className="cms-field">
                <label className="cms-label">Canonical URL</label>
                <input type="url" className="cms-input" placeholder="https://rangaara.com" value={settings.seo?.canonicalUrl || ''}
                  onChange={e => update('seo.canonicalUrl', e.target.value)} />
              </div>
              <div className="cms-field">
                <ImageUploader label="Default OG / Social Share Image" aspectHint="1200×630"
                  value={settings.seo?.ogImage || ''} onChange={url => update('seo.ogImage', url)} />
              </div>
              <div className="cms-field">
                <label className="cms-toggle">
                  <input type="checkbox" checked={settings.seo?.noIndex || false}
                    onChange={e => update('seo.noIndex', e.target.checked)} />
                  <span className="cms-toggle__track"></span>
                  <span className="cms-toggle__label">No Index (discourage search engines)</span>
                </label>
              </div>
            </div>
          )}

          {activeTab === 'announcement' && (
            <div className="cms-card">
              <h3 className="cms-card__title">Announcement Bar</h3>
              <div className="cms-field">
                <label className="cms-toggle">
                  <input type="checkbox" checked={settings.announcementBar?.enabled || false}
                    onChange={e => update('announcementBar.enabled', e.target.checked)} />
                  <span className="cms-toggle__track"></span>
                  <span className="cms-toggle__label">Show Announcement Bar</span>
                </label>
              </div>
              <div className="cms-field">
                <label className="cms-label">Announcement Text</label>
                <input type="text" className="cms-input" placeholder="Free shipping on orders above ₹1999!"
                  value={settings.announcementBar?.text || ''}
                  onChange={e => update('announcementBar.text', e.target.value)} />
              </div>
              <div className="cms-field">
                <label className="cms-label">Link (optional)</label>
                <input type="text" className="cms-input" placeholder="/shop" value={settings.announcementBar?.link || ''}
                  onChange={e => update('announcementBar.link', e.target.value)} />
              </div>
              <div className="cms-two-col">
                <div className="cms-field">
                  <label className="cms-label">Background Color</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="color" value={settings.announcementBar?.bgColor || '#5B1E23'}
                      onChange={e => update('announcementBar.bgColor', e.target.value)}
                      style={{ width: '44px', height: '38px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
                    <input type="text" className="cms-input" value={settings.announcementBar?.bgColor || '#5B1E23'}
                      onChange={e => update('announcementBar.bgColor', e.target.value)} />
                  </div>
                </div>
                <div className="cms-field">
                  <label className="cms-label">Text Color</label>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input type="color" value={settings.announcementBar?.textColor || '#ffffff'}
                      onChange={e => update('announcementBar.textColor', e.target.value)}
                      style={{ width: '44px', height: '38px', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', padding: '2px' }} />
                    <input type="text" className="cms-input" value={settings.announcementBar?.textColor || '#ffffff'}
                      onChange={e => update('announcementBar.textColor', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteSettings;
