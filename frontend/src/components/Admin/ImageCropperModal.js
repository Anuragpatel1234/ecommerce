import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../../utils/cropImage';
import './ImageCropperModal.css';

const ImageCropperModal = ({ isOpen, imageSrc, onCropCompleteAction, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    
    try {
      setIsProcessing(true);
      const croppedFile = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropCompleteAction(croppedFile);
    } catch (e) {
      console.error(e);
      alert('Error cropping image');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-content">
        <div className="cropper-header">
          <h3>Adjust Image</h3>
          <button type="button" onClick={onCancel} className="cropper-close-btn">
            <i className="fa-solid fa-times"></i>
          </button>
        </div>
        
        <div className="cropper-container">
          {imageSrc && (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={4 / 5}
              onCropChange={setCrop}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              objectFit="vertical-cover"
            />
          )}
        </div>

        <div className="cropper-controls">
          <label>Zoom</label>
          <input
            type="range"
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            aria-labelledby="Zoom"
            onChange={(e) => {
              setZoom(e.target.value);
            }}
            className="zoom-range"
          />
        </div>

        <div className="cropper-actions">
          <button type="button" onClick={onCancel} className="btn-secondary" disabled={isProcessing}>
            Cancel
          </button>
          <button type="button" onClick={handleSave} className="btn-primary" disabled={isProcessing}>
            {isProcessing ? 'Processing...' : 'Save & Upload'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
