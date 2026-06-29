import React from 'react';
import { Link } from 'react-router-dom';
import './ShopByOccasion.css';

const ShopByOccasion = () => {
  const occasions = [
    {
      title: 'Wedding',
      image: '/img/pexels-vikashkr50-27103969.jpg',
      link: '/shop?occasion=Wedding',
      span: 'grid-col-2'
    },
    {
      title: 'Festive',
      image: '/img/Drzya_web_nur.webp',
      link: '/shop?occasion=Festive',
      span: 'grid-col-1'
    },
    {
      title: 'Party Wear',
      image: '/img/Approved_Drzya-Desktop-14.webp',
      link: '/shop?occasion=Party',
      span: 'grid-col-1'
    },
    {
      title: 'Casual Wear',
      image: '/img/SKIRTS1.jpg',
      link: '/shop?occasion=Casual',
      span: 'grid-col-1'
    },
    {
      title: 'Luxury Edit',
      image: '/img/Drzya-Desktop-1_2.webp',
      link: '/shop?filter=luxury',
      span: 'grid-col-2'
    }
  ];

  return (
    <section className="occasion-section">
      <h2 className="common-heading center">Shop By Occasion</h2>
      <p className="common-para center">Curated ensembles for life's unforgettable moments</p>
      
      <div className="occasion-grid">
        {occasions.map((occ, idx) => (
          <Link 
            key={idx} 
            to={occ.link} 
            className={`occasion-card ${occ.span}`}
          >
            <div className="occasion-image-wrapper">
              <img src={occ.image} alt={occ.title} />
              <div className="occasion-overlay"></div>
              <div className="occasion-info">
                <h3 className="occasion-title">{occ.title}</h3>
                <span className="occasion-shop-text">Explore Collection</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default ShopByOccasion;
