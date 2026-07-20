import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../../config/api';
import API_BASE_URL from '../../../config/api';
import './MediaLibrary.css';

const MediaLibrary = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const fetchMedia = useCallback(async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(`${API_ENDPOINTS.CMS.MEDIA}${search ? `?search=${search}` : ''}`, {
        headers: { 'x-auth-token': token }
      });
      setFiles(res.data.files || []);
    } catch (err) {
      console.error('Failed to fetch media');
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => fetchMedia(), 300);
    return () => clearTimeout(timer);
  }, [fetchMedia]);

  const handleUpload = async (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;
    setUploading(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(f => formData.append('images', f));
      const token = localStorage.getItem('adminToken');
      await axios.post(API_ENDPOINTS.CMS.UPLOAD, formData, {
        headers: { 'Content-Type': 'multipart/form-data', 'x-auth-token': token }
      });
      showNotification(`${selectedFiles.length} file(s) uploaded!`);
      fetchMedia();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const deleteFile = async (filename) => {
    if (!window.confirm(`Delete "${filename}"? This cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(API_ENDPOINTS.CMS.MEDIA_DELETE(filename), { headers: { 'x-auth-token': token } });
      showNotification('File deleted');
      if (selectedFile?.filename === filename) setSelectedFile(null);
      fetchMedia();
    } catch (err) {
      showNotification('Delete failed', 'error');
    }
  };

  const copyUrl = (file) => {
    const url = file.url.startsWith('http') ? file.url : `${API_BASE_URL}/${file.url}`;
    navigator.clipboard.writeText(url).then(() => showNotification('URL copied to clipboard!'));
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  };

  return (
    <div className="media-library">
      {notification && (
        <div className={`cms-notification cms-notification--${notification.type}`}>
          <i className={`fa-solid ${notification.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="media-library__header">
        <div>
          <h1 className="cms-dashboard__title">Media Library</h1>
          <p className="cms-dashboard__subtitle">Upload and manage all website images centrally.</p>
        </div>
        <div className="media-library__header-actions">
          <label className="media-library__upload-btn">
            {uploading ? (
              <><span className="cms-spinner" style={{ borderTopColor: 'white', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white' }}></span> Uploading...</>
            ) : (
              <><i className="fa-solid fa-upload"></i> Upload Images</>
            )}
            <input type="file" multiple accept="image/*" onChange={handleUpload} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* Search */}
      <div className="media-library__toolbar">
        <div className="media-library__search">
          <i className="fa-solid fa-search"></i>
          <input type="text" placeholder="Search images..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="media-library__count">{files.length} file{files.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Grid */}
      <div className="media-library__body">
        {loading ? (
          <div className="cms-page-loading"><div className="cms-spinner"></div><p>Loading media...</p></div>
        ) : files.length === 0 ? (
          <div className="media-library__empty">
            <i className="fa-solid fa-photo-film"></i>
            <p>{search ? 'No images match your search.' : 'No images uploaded yet. Click "Upload Images" to get started.'}</p>
          </div>
        ) : (
          <div className="media-library__layout">
            <div className="media-library__grid">
              {files.map(file => (
                <div
                  key={file.filename}
                  className={`media-file-card ${selectedFile?.filename === file.filename ? 'selected' : ''}`}
                  onClick={() => setSelectedFile(selectedFile?.filename === file.filename ? null : file)}
                >
                  <div className="media-file-card__img-wrap">
                    <img src={file.url.startsWith('http') ? file.url : `${API_BASE_URL}/${file.url}`} alt={file.filename} loading="lazy" />
                  </div>
                  <div className="media-file-card__info">
                    <p className="media-file-card__name" title={file.filename}>{file.filename}</p>
                    <p className="media-file-card__meta">{formatSize(file.size)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Side Panel */}
            {selectedFile && (
              <div className="media-library__detail">
                <div className="cms-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 className="cms-card__title" style={{ marginBottom: '12px' }}>File Details</h3>
                    <button type="button" className="cms-icon-btn" onClick={() => setSelectedFile(null)}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <img src={selectedFile.url.startsWith('http') ? selectedFile.url : `${API_BASE_URL}/${selectedFile.url}`} alt={selectedFile.filename}
                    style={{ width: '100%', borderRadius: '8px', marginBottom: '16px', objectFit: 'contain', maxHeight: '200px', background: '#f9fafb' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', wordBreak: 'break-all', margin: '0 0 8px' }}>{selectedFile.filename}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 16px' }}>{formatSize(selectedFile.size)} · {new Date(selectedFile.uploadedAt).toLocaleDateString()}</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button type="button" className="cms-action-bar__btn cms-action-bar__btn--secondary" style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => copyUrl(selectedFile)}>
                      <i className="fa-solid fa-copy"></i> Copy URL
                    </button>
                    <button type="button" className="cms-danger-btn" style={{ width: '100%', justifyContent: 'center' }}
                      onClick={() => deleteFile(selectedFile.filename)}>
                      <i className="fa-solid fa-trash"></i> Delete File
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaLibrary;
