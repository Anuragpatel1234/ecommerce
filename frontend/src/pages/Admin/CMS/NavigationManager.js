import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import API_BASE_URL from '../../../config/api';
import './NavigationManager.css';

const defaultItem = () => ({
  id: Date.now() + Math.random(),
  label: '',
  url: '',
  isActive: true,
  children: []
});

const fallbackNavData = [
  {
    id: 1, label: 'NEW ARRIVALS', url: '/shop?filter=newArrival', isActive: true,
    children: [
      { id: 101, label: 'Jameela', url: '/shop?collection=Jameela', isActive: true },
      { id: 102, label: 'Nur', url: '/shop?collection=Nur', isActive: true },
      { id: 103, label: 'Dilbaro Tissue', url: '/shop?collection=Dilbaro Tissue', isActive: true },
      { id: 104, label: 'Dilbaro Embroidered Velvets', url: '/shop?collection=Dilbaro Embroidered Velvets', isActive: true },
      { id: 105, label: 'Dilbaro', url: '/shop?collection=Dilbaro', isActive: true },
      { id: 106, label: 'Zoya', url: '/shop?collection=Zoya', isActive: true },
      { id: 107, label: 'Boond 3.0', url: '/shop?collection=Boond 3.0', isActive: true },
      { id: 108, label: 'Phillauri 2', url: '/shop?collection=Phillauri 2', isActive: true },
      { id: 109, label: 'Gulzaar', url: '/shop?collection=Gulzaar', isActive: true },
      { id: 110, label: 'Ishq', url: '/shop?collection=Ishq', isActive: true },
      { id: 111, label: 'Kapaas', url: '/shop?collection=Kapaas', isActive: true },
      { id: 112, label: 'Layla Florals', url: '/shop?collection=Layla Florals', isActive: true },
      { id: 113, label: 'Gulmohar Khari 25', url: '/shop?collection=Gulmohar Khari 25', isActive: true },
      { id: 114, label: 'Gulmohar Block Prints', url: '/shop?collection=Gulmohar Block Prints', isActive: true },
      { id: 115, label: 'Gulmohar', url: '/shop?collection=Gulmohar', isActive: true }
    ]
  },
  {
    id: 2, label: 'SHOP', url: '/shop', isActive: true,
    children: [
      { id: 201, label: 'Co-ord Sets', url: '/shop?category=Co-ord Sets', isActive: true },
      { id: 202, label: 'Lehengas', url: '/shop?category=Lehengas', isActive: true },
      { id: 203, label: 'Sarees', url: '/shop?category=Sarees', isActive: true },
      { id: 204, label: 'Anarkali Sets', url: '/shop?category=Anarkali Sets', isActive: true },
      { id: 205, label: 'Sharara Sets', url: '/shop?category=Sharara Sets', isActive: true },
      { id: 206, label: 'Kurta Sets', url: '/shop?category=Kurta Sets', isActive: true },
      { id: 207, label: 'Kaftan Sets', url: '/shop?category=Kaftan Sets', isActive: true },
      { id: 208, label: 'Dhoti Sets', url: '/shop?category=Dhoti Sets', isActive: true },
      { id: 209, label: 'Best Sellers', url: '/shop?filter=bestseller', isActive: true },
      { id: 210, label: 'Accessories', url: '/shop?category=Accessories', isActive: true },
      { id: 211, label: 'Home Edit', url: '/shop?category=Home Edit', isActive: true },
      { id: 212, label: 'Tote Bags', url: '/shop?category=Tote Bags', isActive: true },
      { id: 213, label: 'Potli Bags', url: '/shop?category=Potli Bags', isActive: true },
      { id: 214, label: 'Shawls', url: '/shop?category=Shawls', isActive: true },
      { id: 215, label: 'Caps', url: '/shop?category=Caps', isActive: true },
      { id: 216, label: 'Dupattas', url: '/shop?category=Dupattas', isActive: true }
    ]
  },
  { id: 3, label: 'OUR STORY', url: '/about', isActive: true, children: [] },
  { id: 4, label: 'READY TO SHIP', url: '/shop?filter=readyToShip', isActive: true, children: [] },
  { id: 5, label: 'LUXURY COLLECTION', url: '/shop?filter=luxury', isActive: true, children: [] },
  { id: 6, label: 'BESTSELLERS', url: '/shop?filter=bestseller', isActive: true, children: [] },
  { id: 7, label: 'ON SALE', url: '/shop?filter=onSale', isActive: true, children: [] },
  {
    id: 8, label: 'KIDS COLLECTION', url: '/category/KIDS OUTFITS', isActive: true,
    children: [
      { id: 801, label: 'Kids Lehengas', url: '/category/KIDS OUTFITS?type=Lehengas', isActive: true },
      { id: 802, label: 'Kids Anarkali', url: '/category/KIDS OUTFITS?type=Anarkali', isActive: true },
      { id: 803, label: 'Kids Kurta Sets', url: '/category/KIDS OUTFITS?type=Kurta Sets', isActive: true },
      { id: 804, label: 'Kids Co-ord Sets', url: '/category/KIDS OUTFITS?type=Co-ord Sets', isActive: true },
      { id: 805, label: 'Kids Party Wear', url: '/category/KIDS OUTFITS?type=Party Wear', isActive: true },
      { id: 806, label: 'Kids Casual Wear', url: '/category/KIDS OUTFITS?type=Casual Wear', isActive: true }
    ]
  }
];


const NavigationManager = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [notification, setNotification] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const showNotification = (msg, type = 'success') => {
    setNotification({ message: msg, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchNav = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/sections/key/main_navigation`, { headers: { 'x-auth-token': token } });
      setSectionId(res.data._id);
      setItems(res.data.content?.items?.length > 0 ? res.data.content.items : fallbackNavData);
    } catch (err) { if (err.response?.status === 404) setItems(fallbackNavData); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchNav(); }, [fetchNav]);

  const markDirty = () => setIsDirty(true);

  const addItem = () => {
    const item = defaultItem();
    setItems(prev => [...prev, item]);
    setEditingId(item.id);
    markDirty();
  };

  const updateItem = (id, field, value) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
    markDirty();
  };

  const removeItem = (id) => {
    if (!window.confirm('Remove this menu item?')) return;
    setItems(prev => prev.filter(item => item.id !== id));
    if (editingId === id) setEditingId(null);
    markDirty();
  };

  const moveItem = (index, dir) => {
    const arr = [...items];
    const target = index + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setItems(arr);
    markDirty();
  };

  const addChildItem = (parentId) => {
    const child = defaultItem();
    setItems(prev => prev.map(item => item.id === parentId
      ? { ...item, children: [...(item.children || []), child] }
      : item
    ));
    markDirty();
  };

  const updateChildItem = (parentId, childId, field, value) => {
    setItems(prev => prev.map(item => {
      if (item.id !== parentId) return item;
      return { ...item, children: (item.children || []).map(c => c.id === childId ? { ...c, [field]: value } : c) };
    }));
    markDirty();
  };

  const removeChildItem = (parentId, childId) => {
    setItems(prev => prev.map(item => {
      if (item.id !== parentId) return item;
      return { ...item, children: (item.children || []).filter(c => c.id !== childId) };
    }));
    markDirty();
  };

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = { sectionKey: 'main_navigation', sectionName: 'Main Navigation', sectionType: 'navigation', isActive: !isDraft, isDraft, content: { items } };
      const url = sectionId ? `${API_BASE_URL}/api/admin/sections/${sectionId}` : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'Navigation published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally { setIsSaving(false); setIsPublishing(false); }
  };

  if (loading) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading...</p></div>;

  const editing = items.find(i => i.id === editingId);

  return (
    <div className="nav-manager">
      <CMSActionBar title="Navigation Menu" breadcrumb={[{ label: 'Website CMS' }, { label: 'Navigation' }]}
        onSaveDraft={() => saveSection(true)} onPublish={() => saveSection(false)} onCancel={() => navigate('/admin/cms')}
        isSaving={isSaving} isPublishing={isPublishing} isDirty={isDirty} lastSaved={lastSaved} />

      {notification && (
        <div className={`cms-notification cms-notification--${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}

      <div className="nav-manager__body">
        <div className="nav-manager__layout">
          {/* Menu Items List */}
          <div>
            <div className="cms-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cms-card__title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>Menu Items</h3>
                <button type="button" className="cms-action-bar__btn cms-action-bar__btn--primary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={addItem}>
                  <i className="fa-solid fa-plus"></i> Add Item
                </button>
              </div>

              {items.length === 0 ? (
                <div className="category-manager__empty">
                  <i className="fa-solid fa-bars"></i>
                  <p>No menu items yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {items.map((item, i) => (
                    <div key={item.id}>
                      <div className={`nav-item-row ${editingId === item.id ? 'editing' : ''} ${!item.isActive ? 'inactive' : ''}`}
                        onClick={() => setEditingId(editingId === item.id ? null : item.id)}>
                        <i className="fa-solid fa-grip-vertical" style={{ color: '#d1d5db', fontSize: '13px' }}></i>
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600, fontSize: '14px', color: '#111827' }}>{item.label || 'Unnamed'}</span>
                          {item.url && <span style={{ fontSize: '12px', color: '#9ca3af', marginLeft: '8px' }}>{item.url}</span>}
                          {(item.children || []).length > 0 && <span style={{ fontSize: '11px', color: '#6b7280', marginLeft: '8px' }}>({item.children.length} sub)</span>}
                        </div>
                        <span className={`cms-badge ${item.isActive ? 'cms-badge--active' : 'cms-badge--inactive'}`}>
                          {item.isActive ? 'Active' : 'Hidden'}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }} onClick={e => e.stopPropagation()}>
                          <button type="button" className="cms-icon-btn" onClick={() => moveItem(i, -1)} disabled={i === 0}><i className="fa-solid fa-arrow-up"></i></button>
                          <button type="button" className="cms-icon-btn" onClick={() => moveItem(i, 1)} disabled={i === items.length - 1}><i className="fa-solid fa-arrow-down"></i></button>
                          <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => removeItem(item.id)}><i className="fa-solid fa-trash"></i></button>
                        </div>
                      </div>
                      {/* Sub-items preview */}
                      {(item.children || []).length > 0 && (
                        <div style={{ paddingLeft: '32px', display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                          {item.children.map(child => (
                            <div key={child.id} style={{ fontSize: '13px', color: '#6b7280', padding: '4px 8px', background: '#f9fafb', borderRadius: '6px' }}>
                              └ {child.label || 'Unnamed'} {child.url && <span style={{ color: '#9ca3af' }}>→ {child.url}</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit Panel */}
          {editing && (
            <div style={{ position: 'sticky', top: '80px' }}>
              <div className="cms-card">
                <h3 className="cms-card__title">Edit Menu Item</h3>
                <div className="cms-field">
                  <label className="cms-label">Label *</label>
                  <input type="text" className="cms-input" placeholder="e.g. New Arrivals"
                    value={editing.label} onChange={e => updateItem(editing.id, 'label', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-label">URL *</label>
                  <input type="text" className="cms-input" placeholder="/shop?filter=newArrival"
                    value={editing.url} onChange={e => updateItem(editing.id, 'url', e.target.value)} />
                </div>
                <div className="cms-field">
                  <label className="cms-toggle">
                    <input type="checkbox" checked={editing.isActive} onChange={e => updateItem(editing.id, 'isActive', e.target.checked)} />
                    <span className="cms-toggle__track"></span>
                    <span className="cms-toggle__label">{editing.isActive ? 'Visible' : 'Hidden'}</span>
                  </label>
                </div>

                <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '16px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <label className="cms-label" style={{ margin: 0 }}>Dropdown Sub-items</label>
                    <button type="button" className="cms-icon-btn" onClick={() => addChildItem(editing.id)} title="Add sub-item">
                      <i className="fa-solid fa-plus"></i>
                    </button>
                  </div>
                  {(editing.children || []).length === 0 ? (
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>No sub-items. Click + to add dropdown items.</p>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(editing.children || []).map(child => (
                        <div key={child.id} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input type="text" className="cms-input" placeholder="Sub label"
                            value={child.label} onChange={e => updateChildItem(editing.id, child.id, 'label', e.target.value)} />
                          <input type="text" className="cms-input" placeholder="/url"
                            value={child.url} onChange={e => updateChildItem(editing.id, child.id, 'url', e.target.value)} />
                          <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => removeChildItem(editing.id, child.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavigationManager;
