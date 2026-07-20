import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL, { API_ENDPOINTS } from '../../config/api';
import './PromoBanner.css';

const PromoBanner = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.PUBLIC.SECTION_BY_KEY('promo_banners'));
        const activeBanners = (res.data?.content?.banners || []).filter(b => b.isActive);
        setBanners(activeBanners);
      } catch (err) {
        console.error('Failed to fetch promotional banners:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  if (loading || banners.length === 0) return null;

  return (
    <div className="promo-banners-wrapper">
      {banners.map((banner) => (
        <div key={banner.id} className="promo-banner-item" style={banner.image ? { backgroundImage: `url(${banner.image.startsWith('http') ? banner.image : `${API_BASE_URL}/${banner.image}`})` } : {}}>
          <div className="promo-banner-overlay"></div>
          <div className="promo-banner-content">
            {banner.heading && <h3 className="promo-banner-heading">{banner.heading}</h3>}
            {banner.description && <p className="promo-banner-desc">{banner.description}</p>}
            {banner.ctaText && banner.ctaLink && (
              <Link to={banner.ctaLink} className="promo-banner-btn">
                {banner.ctaText}
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromoBanner;

