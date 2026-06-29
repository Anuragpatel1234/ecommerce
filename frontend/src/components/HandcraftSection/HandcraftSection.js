import React from 'react';
import { Link } from 'react-router-dom';
import './HandcraftSection.css';

const HandcraftSection = () => {
  return (
    <section className="handcraft-section">
      <h2 className="common-heading center">Our Heritage</h2>
      <p className="common-para center">Preserving the artistry of Indian handlooms and crafts</p>

      <div className="handcraft-container">
        <div className="handcraft-item">
          <div>
            <Link to="/shop">
              <img src="img/93cc167593f14ad0652725d72a9ddd59.jpg" alt="Handcrafted luxury design" />
            </Link>
          </div>
        </div>
        <div className="center-div">
          <div className="handcraft-content">
            <h3 className="common-heading">RANGAARA</h3>
            <div className="handcraft-content-center">
              <p>At Rangaara, our mission is to celebrate Indian heritage through timeless craftsmanship and contemporary design. We honor the artisans whose skilled hands weave stories of tradition into every thread—preserving centuries-old techniques while making them relevant for today's modern world.</p>
              <p>Our garments are more than clothing; they are emblems of cultural pride, bridging the gap between traditional Indian craftsmanship and global fashion. Each piece carries the legacy of artisan communities, the beauty of handcrafted details, and the elegance of heritage reimagined for contemporary life.</p>
            </div>
            <Link className="handcraft-btn" to="/shop">
              Discover Our Craft
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HandcraftSection;