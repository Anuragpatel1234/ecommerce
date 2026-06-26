import React, { useState } from 'react';
import axios from 'axios';
import { useApp } from '../../context/SafeAppContext';
import './LocationModal.css';

const LocationModal = ({ isOpen, onClose }) => {
    const [pincode, setPincode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { updateLocation } = useApp();

    if (!isOpen) return null;

    const handlePincodeChange = (e) => {
        const val = e.target.value.replace(/\D/g, '').slice(0, 6);
        setPincode(val);
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (pincode.length !== 6) {
            setError('Please enter a valid 6-digit pincode');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Use free API for Indian pincodes
            const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
            const data = response.data[0];

            if (data.Status === 'Success') {
                const postOffice = data.PostOffice[0];
                const city = postOffice.District;
                const state = postOffice.State;

                await updateLocation({
                    pincode,
                    city,
                    state,
                    country: 'India' // Default based on API
                });

                onClose();
                setPincode('');
            } else {
                setError('Invalid pincode. Please check and try again.');
            }
        } catch (err) {
            console.error('Error fetching location:', err);
            setError('Failed to fetch location details. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="location-modal-overlay" onClick={onClose}>
            <div className="location-modal" onClick={(e) => e.stopPropagation()}>
                <div className="location-modal-header">
                    <h3>Choose your location</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="location-modal-body">
                    <p className="location-desc">
                        Select a delivery location to see product availability and delivery options
                    </p>

                    <form onSubmit={handleSubmit} className="location-form">
                        <div className="input-group">
                            <input
                                type="text"
                                placeholder="Enter Pincode"
                                value={pincode}
                                onChange={handlePincodeChange}
                                maxLength="6"
                            />
                            <button type="submit" className="apply-btn" disabled={loading}>
                                {loading ? 'Applying...' : 'Apply'}
                            </button>
                        </div>
                        {error && <p className="error-msg">{error}</p>}
                    </form>

                    <div className="or-divider">
                        <span>OR</span>
                    </div>

                    <button className="detect-btn" disabled>
                        <i className="fa-solid fa-location-crosshairs"></i> Detect my location (Coming Soon)
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;
