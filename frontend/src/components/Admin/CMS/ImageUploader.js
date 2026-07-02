import React, { useState, useRef, useCallback } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../../config/api';
import './ImageUploader.css';

/**
 * ImageUploader — Reusable drag-and-drop image upload component for CMS
 * Props:
 *   value: string (current image URL)
 *   onChange: fn(url) called when image changes
 *   label: string
 *   aspectHint: string (e.g. "16:9", "1:1")
 *   required: bool
 */
const ImageUploader = ({ value, onChange, label = 'Image', aspectHint = '', required = false, onError }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaFiles, setMediaFiles] = useState([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const fileInputRef = useRef(null);

  const uploadFile = useCallback(async (file) => {
    setIsUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('images', file);
      const token = localStorage.getItem('adminToken');
      const res = await axios.post(`${API_BASE_URL}/api/admin/cms/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      if (res.data.files && res.data.files.length > 0) {
        const url = `${API_BASE_URL}/${res.data.files[0].url}`;
        onChange(url);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Upload failed';
      setUploadError(msg);
      if (onError) onError(msg);
    } finally {
      setIsUploading(false);
    }
  }, [onChange, onError]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) uploadFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      uploadFile(file);
    } else {
      setUploadError('Only image files are accepted');
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);

  const loadMediaLibrary = async () => {
    setMediaLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_BASE_URL}/api/admin/cms/media`, {
        headers: { 'x-auth-token': token }
      });
      setMediaFiles(res.data.files || []);
    } catch (err) {
      console.error('Failed to load media library');
    } finally {
      setMediaLoading(false);
    }
  };

  const openMediaModal = () => {
    setShowMediaModal(true);
    loadMediaLibrary();
  };

  const selectFromLibrary = (file) => {
    onChange(`${API_BASE_URL}/${file.url}`);
    setShowMediaModal(false);
  };

  const getPreviewUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:') || url.startsWith('/')) return url;
    return `/${url}`;
  };

  return (
    <div className="image-uploader">
      {label && (
        <label className="image-uploader__label">
          {label} {required && <span className="required-asterisk">*</span>}
          {aspectHint && <span className="image-uploader__aspect-hint">({aspectHint})</span>}
        </label>
      )}

      <div
        className={`image-uploader__zone ${isDragging ? 'dragging' : ''} ${value ? 'has-image' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !value && fileInputRef.current?.click()}
      >
        {value ? (
          <div className="image-uploader__preview">
            <img src={getPreviewUrl(value)} alt="Preview" className="image-uploader__preview-img" />
            <div className="image-uploader__preview-overlay">
              <button
                type="button"
                className="image-uploader__preview-btn"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
              >
                <i className="fa-solid fa-arrow-up-from-bracket"></i> Replace
              </button>
              <button
                type="button"
                className="image-uploader__preview-btn image-uploader__preview-btn--danger"
                onClick={(e) => { e.stopPropagation(); onChange(''); }}
              >
                <i className="fa-solid fa-trash"></i> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="image-uploader__placeholder">
            {isUploading ? (
              <>
                <div className="image-uploader__spinner"></div>
                <p>Uploading...</p>
              </>
            ) : (
              <>
                <i className="fa-solid fa-cloud-arrow-up image-uploader__icon"></i>
                <p className="image-uploader__primary-text">Drag & drop an image here</p>
                <p className="image-uploader__secondary-text">or click to browse</p>
                <span className="image-uploader__format-hint">JPG, PNG, WebP, SVG up to 10MB</span>
              </>
            )}
          </div>
        )}
      </div>

      {uploadError && <p className="image-uploader__error">{uploadError}</p>}

      <div className="image-uploader__actions">
        <button
          type="button"
          className="image-uploader__btn image-uploader__btn--secondary"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <i className="fa-solid fa-upload"></i> Upload New
        </button>
        <button
          type="button"
          className="image-uploader__btn image-uploader__btn--ghost"
          onClick={openMediaModal}
          disabled={isUploading}
        >
          <i className="fa-solid fa-photo-film"></i> Media Library
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      {/* Media Library Modal */}
      {showMediaModal && (
        <div className="media-modal-overlay" onClick={() => setShowMediaModal(false)}>
          <div className="media-modal" onClick={(e) => e.stopPropagation()}>
            <div className="media-modal__header">
              <h3>Media Library</h3>
              <button type="button" className="media-modal__close" onClick={() => setShowMediaModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="media-modal__body">
              {mediaLoading ? (
                <div className="media-modal__loading">
                  <div className="image-uploader__spinner"></div>
                  <p>Loading media...</p>
                </div>
              ) : mediaFiles.length === 0 ? (
                <div className="media-modal__empty">
                  <i className="fa-solid fa-photo-film"></i>
                  <p>No images uploaded yet</p>
                </div>
              ) : (
                <div className="media-modal__grid">
                  {mediaFiles.map((file) => (
                    <div
                      key={file.filename}
                      className="media-modal__item"
                      onClick={() => selectFromLibrary(file)}
                      title={file.filename}
                    >
                      <img src={`${API_BASE_URL}/${file.url}`} alt={file.filename} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
