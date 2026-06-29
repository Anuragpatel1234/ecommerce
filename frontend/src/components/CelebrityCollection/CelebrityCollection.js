import React from 'react';
import { Link } from 'react-router-dom';
import './CelebrityCollection.css';

const CelebrityCollection = () => {
  return (
    <section className="celebrity-section">
      <div className="celebrity-container">
        {/* Editorial Text Block - Left Column */}
        <div className="celebrity-editorial">
          <span className="celebrity-label">As Seen On</span>
          <h2 className="celebrity-heading">CELEBRITY STYLE</h2>
          <p className="celebrity-text">
            Discover the silhouettes that have graced screens and celebrations. Our couture has been selected by leading figures of Indian cinema and culture, capturing the timeless essence of Rangaara craftsmanship.
          </p>
          <p className="celebrity-subtext">
            From red carpets to personal celebrations, explore how India's style icons drape themselves in our handcrafted heritage.
          </p>
          <Link to="/shop?filter=celebrity" className="celebrity-cta">
            Shop Celebrity Styles <i className="fa-solid fa-arrow-right-long"></i>
          </Link>
        </div>

        {/* Asymmetric Magazine Images - Right Column */}
        <div className="celebrity-gallery">
          <div className="gallery-large">
            <Link to="/shop?filter=celebrity">
              <img src="/img/pexels-vikashkr50-27103969.jpg" alt="Celebrity Style Couture" />
              <div className="gallery-overlay">
                <span className="celebrity-name">Featured Couture</span>
              </div>
            </Link>
          </div>
          <div className="gallery-stacked">
            <div className="gallery-small">
              <Link to="/shop?filter=celebrity">
                <img src="/img/Drzya-Desktop-1_2.webp" alt="Celebrity Style Silk" />
                <div className="gallery-overlay">
                  <span className="celebrity-name">Ivory Silk Edit</span>
                </div>
              </Link>
            </div>
            <div className="gallery-small">
              <Link to="/shop?filter=celebrity">
                <img src="/img/ishq_new_arrivals_dekstop.webp" alt="Celebrity Style Velvet" />
                <div className="gallery-overlay">
                  <span className="celebrity-name">The Crimson Velvet</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CelebrityCollection;
