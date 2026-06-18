import React from 'react';
import { Link } from 'react-router-dom';
import './HandcraftSection.css';

const HandcraftSection = () => {
  return (
    <section className="handcraft-section">
      <h2 className="common-heading center">HandCraft Design</h2>
      <p className="common-para center">Most people love our design.</p>

      <div className="handcraft-container">
        <div className="handcraft-item">
          <div>
            <Link to="/shop">
              <img src="img/93cc167593f14ad0652725d72a9ddd59.jpg" alt="Handcrafted design" />
            </Link>
          </div>
        </div>
        <div className="center-div">
          <div className="handcraft-content">
            <h3 className="common-heading">RANGAARA.</h3>
            <div className="handcraft-content-center">
              <p>AT RANGAARA, OUR MISSION IS TO CELEBRATE INDIAN HERITAGE THROUGH TIMELESS CRAFTSMANSHIP AND CONTEMPORARY DESIGN. FOUNDED IN 2024, RANGAARA WAS CREATED TO HONOR THE ARTISANS WHOSE SKILLED HANDS WEAVE STORIES OF TRADITION INTO EVERY THREAD—PRESERVING CENTURIES-OLD TECHNIQUES WHILE MAKING THEM RELEVANT FOR TODAY'S MODERN WORLD.</p>
              <p>OUR GARMENTS ARE MORE THAN CLOTHING; THEY ARE EMBLEMS OF CULTURAL PRIDE, BRIDGING THE GAP BETWEEN TRADITIONAL INDIAN CRAFTSMANSHIP AND GLOBAL FASHION. EACH PIECE CARRIES THE LEGACY OF ARTISAN COMMUNITIES, THE BEAUTY OF HANDCRAFTED DETAILS, AND THE ELEGANCE OF HERITAGE REIMAGINED FOR CONTEMPORARY LIFE.</p>
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