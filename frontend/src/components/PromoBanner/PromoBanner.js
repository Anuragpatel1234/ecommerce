import React from 'react';
import './PromoBanner.css';

const PromoBanner = () => {
  return (
    <div className="promo-banner-container">
      <div className="promo-banner-content">
        <div className="promo-offer-item">
          <span className="promo-tag">LIMITED SPECIAL</span>
          <h3 className="promo-title">BUY 2 AND GET 10% OFF</h3>
          <p className="promo-subtitle">Discount automatically applied at checkout</p>
        </div>
        <div className="promo-divider"></div>
        <div className="promo-offer-item">
          <span className="promo-tag">EXCLUSIVE DEAL</span>
          <h3 className="promo-title">BUY 3 AND GET 15% OFF</h3>
          <p className="promo-subtitle">Save more when you upgrade your collection</p>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
