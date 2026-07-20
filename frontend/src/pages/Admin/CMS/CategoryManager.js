import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CMSActionBar from '../../../components/Admin/CMS/CMSActionBar';
import ImageUploader from '../../../components/Admin/CMS/ImageUploader';
import API_BASE_URL from '../../../config/api';
import './CategoryManager.css';

const defaultCategory = () => ({
  id: Date.now() + Math.random(),
  name: '',
  slug: '',
  description: '',
  image: '',
  icon: '',
  displayOrder: 0,
  isActive: true
});

const slugify = (text) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const fallbackCategoriesData = [
  { id: 1, name: 'LEHENGAS', slug: 'lehengas', image: '/img/Untitled-4.webp', isActive: true, displayOrder: 0 },
  { id: 2, name: 'SHARARA SETS', slug: 'sharara-sets', image: '/img/0952.webp', isActive: true, displayOrder: 1 },
  { id: 3, name: 'ANARKALI SETS', slug: 'anarkali-sets', image: '/img/dupatta1.webp', isActive: true, displayOrder: 2 },
  { id: 4, name: 'KURTA SETS', slug: 'kurta-sets', image: '/img/SKIRTS1.jpg', isActive: true, displayOrder: 3 },
  { id: 5, name: 'COORD SETS', slug: 'coord-sets', image: '/img/traditional outfit 2.webp', isActive: true, displayOrder: 4 },
  { id: 6, name: 'KAFTAN SETS', slug: 'kaftan-sets', image: '/img/kids lehenga set.webp', isActive: true, displayOrder: 5 },
  { id: 7, name: 'DHOTI SETS', slug: 'dhoti-sets', image: '/img/Untitled-4.webp', isActive: true, displayOrder: 6 },
  { id: 8, name: 'LOUNGE WEAR', slug: 'lounge-wear', image: '/img/0952.webp', isActive: true, displayOrder: 7 }
];

const CategoryManager = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
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

  const fetchCategories = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/sections/key/site_categories`, {
        headers: { 'x-auth-token': token }
      });
      setSectionId(res.data._id);
      setCategories(res.data.content?.categories?.length > 0 ? res.data.content.categories : fallbackCategoriesData);
    } catch (err) {
      if (err.response?.status === 404) setCategories(fallbackCategoriesData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCategories(); }, [fetchCategories]);

  const markDirty = () => setIsDirty(true);

  const addCategory = () => {
    const cat = defaultCategory();
    setCategories(prev => [...prev, cat]);
    setEditingId(cat.id);
    markDirty();
  };

  const updateCategory = (id, field, value) => {
    setCategories(prev => prev.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, [field]: value };
      if (field === 'name') updated.slug = slugify(value);
      return updated;
    }));
    markDirty();
  };

  const removeCategory = (id) => {
    if (!window.confirm('Delete this category?')) return;
    setCategories(prev => prev.filter(c => c.id !== id));
    if (editingId === id) setEditingId(null);
    markDirty();
  };

  const moveCategory = (index, dir) => {
    const cats = [...categories];
    const target = index + dir;
    if (target < 0 || target >= cats.length) return;
    [cats[index], cats[target]] = [cats[target], cats[index]];
    setCategories(cats);
    markDirty();
  };

  const saveSection = async (isDraft = false) => {
    if (isDraft) setIsSaving(true); else setIsPublishing(true);
    try {
      const token = localStorage.getItem('adminToken');
      const payload = {
        sectionKey: 'site_categories',
        sectionName: 'Site Categories',
        sectionType: 'categories',
        isActive: !isDraft,
        isDraft,
        content: { categories: categories.map((c, i) => ({ ...c, displayOrder: i })) }
      };
      const url = sectionId
        ? `${API_BASE_URL}/api/admin/sections/${sectionId}`
        : `${API_BASE_URL}/api/admin/sections`;
      const method = sectionId ? 'put' : 'post';
      const res = await axios[method](url, payload, { headers: { 'x-auth-token': token } });
      if (!sectionId) setSectionId(res.data._id);
      setIsDirty(false);
      setLastSaved(new Date());
      showNotification(isDraft ? 'Draft saved!' : 'Categories published!');
    } catch (err) {
      showNotification(err.response?.data?.message || 'Save failed', 'error');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
    }
  };

  if (loading) return <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading Categories...</p></div>;

  return (
    <div className="category-manager">
      <CMSActionBar
        title="Category Manager"
        breadcrumb={[{ label: 'Website CMS' }, { label: 'Categories' }]}
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

      <div className="category-manager__body">
        <div className="category-manager__layout">
          {/* List */}
          <div className="category-manager__list">
            <div className="cms-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cms-card__title" style={{ margin: 0, borderBottom: 'none', paddingBottom: 0 }}>
                  Categories ({categories.length})
                </h3>
                <button type="button" className="cms-action-bar__btn cms-action-bar__btn--primary" style={{ padding: '8px 14px', fontSize: '13px' }} onClick={addCategory}>
                  <i className="fa-solid fa-plus"></i> Add Category
                </button>
              </div>

              {categories.length === 0 ? (
                <div className="category-manager__empty">
                  <i className="fa-solid fa-th-large"></i>
                  <p>No categories yet. Add your first category.</p>
                </div>
              ) : (
                <div className="category-list">
                  {categories.map((cat, i) => (
                    <div
                      key={cat.id}
                      className={`category-list__item ${editingId === cat.id ? 'editing' : ''} ${!cat.isActive ? 'inactive' : ''}`}
                      onClick={() => setEditingId(editingId === cat.id ? null : cat.id)}
                    >
                      {cat.image
                        ? <img src={cat.image} alt={cat.name} className="category-list__thumb" />
                        : <div className="category-list__thumb-placeholder">{cat.icon || '📁'}</div>
                      }
                      <div className="category-list__info">
                        <p className="category-list__name">{cat.name || 'Unnamed Category'}</p>
                        <p className="category-list__slug">/{cat.slug || 'slug'}</p>
                      </div>
                      <span className={`cms-badge ${cat.isActive ? 'cms-badge--active' : 'cms-badge--inactive'}`}>
                        {cat.isActive ? 'Active' : 'Hidden'}
                      </span>
                      <div className="category-list__controls" onClick={e => e.stopPropagation()}>
                        <button type="button" className="cms-icon-btn" onClick={() => moveCategory(i, -1)} disabled={i === 0} title="Move up">
                          <i className="fa-solid fa-arrow-up"></i>
                        </button>
                        <button type="button" className="cms-icon-btn" onClick={() => moveCategory(i, 1)} disabled={i === categories.length - 1} title="Move down">
                          <i className="fa-solid fa-arrow-down"></i>
                        </button>
                        <button type="button" className="cms-icon-btn cms-icon-btn--danger" onClick={() => removeCategory(cat.id)} title="Delete">
                          <i className="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Edit Panel */}
          {editingId && (() => {
            const cat = categories.find(c => c.id === editingId);
            if (!cat) return null;
            return (
              <div className="category-manager__editor">
                <div className="cms-card">
                  <h3 className="cms-card__title">Edit Category</h3>
                  <ImageUploader
                    label="Category Image"
                    aspectHint="1:1 or 4:3"
                    value={cat.image}
                    onChange={(url) => updateCategory(cat.id, 'image', url)}
                  />
                  <div className="cms-field" style={{ marginTop: '20px' }}>
                    <label className="cms-label">Category Name *</label>
                    <input type="text" className="cms-input" placeholder="e.g. Lehengas"
                      value={cat.name} onChange={(e) => updateCategory(cat.id, 'name', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">URL Slug</label>
                    <input type="text" className="cms-input" placeholder="lehengas"
                      value={cat.slug} onChange={(e) => updateCategory(cat.id, 'slug', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Icon / Emoji (optional)</label>
                    <input type="text" className="cms-input" placeholder="e.g. 👗"
                      value={cat.icon} onChange={(e) => updateCategory(cat.id, 'icon', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-label">Description</label>
                    <textarea className="cms-textarea" rows={2} placeholder="Short category description"
                      value={cat.description} onChange={(e) => updateCategory(cat.id, 'description', e.target.value)} />
                  </div>
                  <div className="cms-field">
                    <label className="cms-toggle">
                      <input type="checkbox" checked={cat.isActive}
                        onChange={(e) => updateCategory(cat.id, 'isActive', e.target.checked)} />
                      <span className="cms-toggle__track"></span>
                      <span className="cms-toggle__label">{cat.isActive ? 'Active (Visible)' : 'Hidden'}</span>
                    </label>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
