import React from 'react';
import './InstagramGallery.css';

const InstagramGallery = () => {
  const images = [
    { src: '/img/06e447550bc57e1226507591a9b847e5.jpg', size: 'tall' },
    { src: '/img/0952.webp', size: 'medium' },
    { src: '/img/Attached_image.png', size: 'wide' },
    { src: '/img/6c175c54c2fb39439186c4942dd78730.jpg', size: 'tall' },
    { src: '/img/Drzya_web_nur.webp', size: 'medium' },
    { src: '/img/dupatta1.webp', size: 'small' }
  ];

  return (
    <section className="instagram-section">
      <h2 className="common-heading center">LIFESTYLE GALLERY</h2>
      <p className="common-para center">Follow our journey of heritage reimagined on Instagram @rangaara</p>
      
      <div className="instagram-grid">
        {images.map((img, idx) => (
          <div key={idx} className={`instagram-card ${img.size}`}>
            <img src={img.src} alt="Rangaara Lifestyle Detail" />
            <div className="instagram-card-overlay">
              <i className="fa-brands fa-instagram"></i>
              <span>View Post</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default InstagramGallery;
