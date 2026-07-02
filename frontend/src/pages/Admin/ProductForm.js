import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './ProductForm.css';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    category: '',
    material: '',
    careInstructions: '',
    inStock: true,
    newArrival: false,
    bestseller: false,
    onSale: false,
    featured: false,
    sizes: [{ size: '', stock: 0 }],
    colors: []
  });

  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPreview, setShowPreview] = useState(true);
  const [draggedImageIndex, setDraggedImageIndex] = useState(null);

  useEffect(() => {
    if (isEdit) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setError('');
      const res = await axios.get(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(id));
      const product = res.data;
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        category: product.category || '',
        material: product.material || '',
        careInstructions: product.careInstructions || '',
        inStock: product.inStock !== false,
        newArrival: product.newArrival || false,
        bestseller: product.bestseller || false,
        onSale: product.onSale || false,
        featured: product.featured || false,
        sizes: product.sizes && product.sizes.length > 0 
          ? product.sizes 
          : [{ size: '', stock: 0 }],
        colors: product.colors || []
      });
      setExistingImages(product.images || []);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.response?.data?.message || 'Failed to load product. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSizeChange = (index, field, value) => {
    const newSizes = [...formData.sizes];
    newSizes[index] = {
      ...newSizes[index],
      [field]: field === 'stock' ? parseInt(value) || 0 : value
    };
    setFormData(prev => ({ ...prev, sizes: newSizes }));
  };

  const addSize = () => {
    setFormData(prev => ({
      ...prev,
      sizes: [...prev.sizes, { size: '', stock: 0 }]
    }));
  };

  const removeSize = (index) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index)
    }));
  };

  const handleColorChange = (e) => {
    const colors = e.target.value.split(',').map(c => c.trim()).filter(c => c);
    setFormData(prev => ({ ...prev, colors }));
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));
      
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(API_ENDPOINTS.ADMIN.UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      
      if (res.data.urls && res.data.urls.length > 0) {
        setExistingImages(prev => [...prev, ...res.data.urls]);
      }
    } catch (err) {
      console.error('Failed to upload images', err);
      setError('Failed to upload images. Please try again.');
    }
    
    // Clear input
    e.target.value = '';
  };

  const removeExistingImage = (indexToRemove) => {
    setExistingImages(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleDragStart = (e, index) => {
    setDraggedImageIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    setTimeout(() => {
      if (e.target) e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    if (e.target) e.target.style.opacity = '1';
    setDraggedImageIndex(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedImageIndex === null || draggedImageIndex === targetIndex) return;

    const newImages = [...existingImages];
    const draggedItem = newImages[draggedImageIndex];
    newImages.splice(draggedImageIndex, 1);
    newImages.splice(targetIndex, 0, draggedItem);
    
    setExistingImages(newImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (!formData.name.trim()) {
      setError('Product name is required');
      setLoading(false);
      return;
    }
    if (!formData.category) {
      setError('Category is required');
      setLoading(false);
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Valid price is required');
      setLoading(false);
      return;
    }
    if (formData.sizes.length === 0 || !formData.sizes.some(s => s.size && s.stock > 0)) {
      setError('At least one size with stock is required');
      setLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'sizes' || key === 'colors') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      submitData.append('existingImages', JSON.stringify(existingImages));

      if (isEdit) {
        await axios.put(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(id), submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await axios.post(API_ENDPOINTS.ADMIN.PRODUCTS, submitData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.errors?.[0]?.msg || 
                          'Failed to save product. Please check all fields and try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    if (!price) return '₹0';
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  const getDiscount = () => {
    if (!formData.originalPrice || !formData.price) return 0;
    const original = parseFloat(formData.originalPrice);
    const current = parseFloat(formData.price);
    if (original <= current) return 0;
    return Math.round(((original - current) / original) * 100);
  };

  const totalStock = formData.sizes.reduce((sum, size) => sum + (parseInt(size.stock) || 0), 0);

  return (
    <div className="product-form-page">
      <Breadcrumbs items={[
        { label: 'Products', path: '/admin/products' },
        { label: isEdit ? 'Edit Product' : 'Add New Product' }
      ]} />
      
      <div className="form-header">
        <div>
          <h1>{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="form-subtitle">
            {isEdit ? 'Update product information below' : 'Fill in the details to create a new product'}
          </p>
        </div>
        <div className="form-header-actions">
          <button 
            onClick={() => setShowPreview(!showPreview)} 
            className="btn-preview-toggle"
            type="button"
          >
            <i className={`fa-solid fa-${showPreview ? 'eye-slash' : 'eye'}`}></i>
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </button>
          <button onClick={() => navigate('/admin/products')} className="btn-secondary">
            <i className="fa-solid fa-times"></i> Cancel
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <i className="fa-solid fa-exclamation-circle"></i> {error}
        </div>
      )}

      <div className="form-layout">
        <form onSubmit={handleSubmit} className="product-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="LEHENGAS">LEHENGAS</option>
                <option value="BLOUSES">BLOUSES</option>
                <option value="DUPATTA">DUPATTA</option>
                <option value="SKIRTS">SKIRTS</option>
                <option value="TRADITIONAL OUTFIT">TRADITIONAL OUTFIT</option>
                <option value="KIDS OUTFITS">KIDS OUTFITS</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label>Original Price (₹)</label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Product Details</h2>
          
          <div className="form-row">
            <div className="form-group">
              <label>Material</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Care Instructions</label>
              <input
                type="text"
                name="careInstructions"
                value={formData.careInstructions}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Colors (comma-separated)</label>
            <input
              type="text"
              value={formData.colors.join(', ')}
              onChange={handleColorChange}
              placeholder="Red, Blue, Green"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Sizes & Stock</h2>
          
          {formData.sizes.map((size, index) => (
            <div key={index} className="size-row">
              <input
                type="text"
                placeholder="Size (e.g., S, M, L)"
                value={size.size}
                onChange={(e) => handleSizeChange(index, 'size', e.target.value)}
              />
              <input
                type="number"
                placeholder="Stock"
                value={size.stock}
                onChange={(e) => handleSizeChange(index, 'stock', e.target.value)}
                min="0"
              />
              {formData.sizes.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSize(index)}
                  className="btn-remove"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              )}
            </div>
          ))}
          
          <button type="button" onClick={addSize} className="btn-add-size">
            <i className="fa-solid fa-plus"></i> Add Size
          </button>
        </div>

        <div className="form-section">
          <h2>
            Images
            <span className="info-tooltip" title="Upload product images. First image will be the main product image.">
              <i className="fa-solid fa-circle-info"></i>
            </span>
          </h2>
          
          {existingImages.length > 0 && (
            <div className="existing-images">
              <p className="image-section-label">All Images (Drag to reorder):</p>
              {existingImages.map((img, index) => (
                <div 
                  key={index} 
                  className="image-preview draggable"
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragEnd={handleDragEnd}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  <img src={getImageUrl(img)} alt={`Image ${index + 1}`} />
                  <span className="image-badge">Image {index + 1}</span>
                  <button 
                    type="button" 
                    className="btn-remove-image" 
                    onClick={() => removeExistingImage(index)}
                    title="Remove Image"
                  >
                    <i className="fa-solid fa-times"></i>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="form-group">
            <label>
              Upload New Images
              <span className="field-hint">(You can select multiple images)</span>
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="file-input"
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Product Flags</h2>
          
          <div className="checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
              />
              In Stock
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="newArrival"
                checked={formData.newArrival}
                onChange={handleChange}
              />
              New Arrival
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="bestseller"
                checked={formData.bestseller}
                onChange={handleChange}
              />
              Bestseller
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="onSale"
                checked={formData.onSale}
                onChange={handleChange}
              />
              On Sale
            </label>
            
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
              />
              Featured
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Saving...
              </>
            ) : (
              <>
                <i className={`fa-solid fa-${isEdit ? 'save' : 'plus'}`}></i>
                {isEdit ? 'Update Product' : 'Create Product'}
              </>
            )}
          </button>
        </div>
      </form>

      {showPreview && (
        <div className="product-preview-panel">
          <div className="preview-header">
            <h3>
              <i className="fa-solid fa-eye"></i> Live Preview
            </h3>
            <p className="preview-note">This is how your product will appear to customers</p>
          </div>
          
          <div className="preview-card">
            <div className="preview-image">
              {existingImages.length > 0 ? (
                <img src={getImageUrl(existingImages[0])} alt="Preview" />
              ) : (
                <div className="preview-placeholder">
                  <i className="fa-solid fa-image"></i>
                  <p>No image</p>
                </div>
              )}
              {formData.onSale && (
                <span className="preview-badge sale">SALE</span>
              )}
              {formData.newArrival && (
                <span className="preview-badge new">NEW</span>
              )}
            </div>
            
            <div className="preview-content">
              <h4 className="preview-title">
                {formData.name || 'Product Name'}
              </h4>
              
              <div className="preview-price">
                {formData.originalPrice && parseFloat(formData.originalPrice) > parseFloat(formData.price || 0) && (
                  <span className="preview-original-price">
                    {formatPrice(formData.originalPrice)}
                  </span>
                )}
                <span className="preview-current-price">
                  {formatPrice(formData.price || '0')}
                </span>
                {getDiscount() > 0 && (
                  <span className="preview-discount">{getDiscount()}% OFF</span>
                )}
              </div>
              
              <p className="preview-description">
                {formData.description || 'Product description will appear here...'}
              </p>
              
              <div className="preview-details">
                {formData.category && (
                  <div className="preview-detail-item">
                    <strong>Category:</strong> {formData.category}
                  </div>
                )}
                {formData.material && (
                  <div className="preview-detail-item">
                    <strong>Material:</strong> {formData.material}
                  </div>
                )}
                {formData.colors.length > 0 && (
                  <div className="preview-detail-item">
                    <strong>Colors:</strong> {formData.colors.join(', ')}
                  </div>
                )}
                {formData.sizes.some(s => s.size) && (
                  <div className="preview-detail-item">
                    <strong>Sizes:</strong> {formData.sizes.filter(s => s.size).map(s => s.size).join(', ')}
                  </div>
                )}
                <div className="preview-detail-item">
                  <strong>Stock:</strong> {totalStock} units
                </div>
              </div>
              
              <div className="preview-badges">
                {formData.bestseller && (
                  <span className="preview-tag">Bestseller</span>
                )}
                {formData.featured && (
                  <span className="preview-tag">Featured</span>
                )}
                {formData.inStock ? (
                  <span className="preview-tag in-stock">In Stock</span>
                ) : (
                  <span className="preview-tag out-of-stock">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ProductForm;

