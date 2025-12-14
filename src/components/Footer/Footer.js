import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (sectionId) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  return (
    <footer className="footer-section">
      <div className="footer-container">
        {/* Brand Information */}
        <div className="footer-column footer-brand">
          <div className="footer-brand-logo">
            <Link to="/">
            <img
              src={process.env.PUBLIC_URL + "/img/RANGAARA-logo.png"}
              alt="Rangaara"
              className="footer-logo-image"
              onError={(e) => {
                console.error('Failed to load footer logo image');
                e.target.style.display = 'none';
                  const fallback = e.target.nextElementSibling;
                  if (fallback) {
                    fallback.style.display = 'block';
                  }
              }}
            />
              <span className="footer-logo-text">RANGAARA</span>
            </Link>
          </div>
          <p className="footer-brand-description">
            Online brand clothing founded in 2024. RANGAARA focuses on selling only quality and branded items,
            limited edition collections by best fashion designers.
          </p>
        </div>

        {/* About Us */}
        <div className="footer-column footer-accordion">
          <button 
            className="footer-column-title footer-accordion-toggle"
            onClick={() => toggleSection('about')}
            aria-expanded={openSections['about']}
          >
            <span>About Us</span>
            <i className={`fa-solid fa-chevron-down ${openSections['about'] ? 'open' : ''}`}></i>
          </button>
          <div className={`footer-accordion-content ${openSections['about'] ? 'open' : ''}`}>
          <ul className="footer-links">
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/store-locator">Store Locator</Link></li>
            <li><Link to="/bulk-purchase">Bulk Purchase</Link></li>
            <li><Link to="/alteration">Alteration Service</Link></li>
            <li><Link to="/gift-delivery">Gift Delivery Service</Link></li>
            <li><Link to="/live-station">Live Station</Link></li>
          </ul>
          </div>
        </div>

        {/* Help */}
        <div className="footer-column footer-accordion">
          <button 
            className="footer-column-title footer-accordion-toggle"
            onClick={() => toggleSection('help')}
            aria-expanded={openSections['help']}
          >
            <span>Help</span>
            <i className={`fa-solid fa-chevron-down ${openSections['help'] ? 'open' : ''}`}></i>
          </button>
          <div className={`footer-accordion-content ${openSections['help'] ? 'open' : ''}`}>
          <ul className="footer-links">
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/shopping-guide">Online Shopping Guide</Link></li>
            <li><Link to="/returns">Return Policy</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/accessibility">Accessibility</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
          </div>
        </div>

        {/* Account */}
        <div className="footer-column footer-accordion">
          <button 
            className="footer-column-title footer-accordion-toggle"
            onClick={() => toggleSection('account')}
            aria-expanded={openSections['account']}
          >
            <span>Account</span>
            <i className={`fa-solid fa-chevron-down ${openSections['account'] ? 'open' : ''}`}></i>
          </button>
          <div className={`footer-accordion-content ${openSections['account'] ? 'open' : ''}`}>
          <ul className="footer-links">
            <li><Link to="/membership">Membership</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/coupons">Coupons</Link></li>
          </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="footer-column footer-accordion">
          <button 
            className="footer-column-title footer-accordion-toggle"
            onClick={() => toggleSection('social')}
            aria-expanded={openSections['social']}
          >
            <span>Social Media</span>
            <i className={`fa-solid fa-chevron-down ${openSections['social'] ? 'open' : ''}`}></i>
          </button>
          <div className={`footer-accordion-content ${openSections['social'] ? 'open' : ''}`}>
          <ul className="footer-social-links">
            <li>
              <a href="https://twitter.com/rangaara" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-twitter"></i>
                <span>Twitter</span>
              </a>
            </li>
            <li>
              <a href="https://facebook.com/rangaara" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </a>
            </li>
            <li>
              <a href="https://instagram.com/rangaara" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-instagram"></i>
                <span>Instagram</span>
              </a>
            </li>
            <li>
              <a href="https://youtube.com/rangaara" target="_blank" rel="noopener noreferrer" className="social-link">
                <i className="fab fa-youtube"></i>
                <span>Youtube</span>
              </a>
            </li>
          </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          <p>&copy; RANGAARA {currentYear}. All rights reserved.</p>
        </div>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <span className="footer-separator">•</span>
          <Link to="/terms">Terms and Conditions</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
