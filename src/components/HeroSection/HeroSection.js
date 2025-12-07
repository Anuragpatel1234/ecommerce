import React, { useState, useEffect } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const slides = [
    { src: 'img/pexels-vikashkr50-27103969.jpg', alt: 'Fashion collection' },
    { src: 'img/Approved_Drzya-Desktop-14.webp', alt: 'Fashion collection' },
    { src: 'img/Drzya-Desktop-1_2.webp', alt: 'Fashion collection' },
    { src: 'img/Drzya-Desktop-11.webp', alt: 'Fashion collection' },
    { src: 'img/ishq_new_arrivals_dekstop.webp', alt: 'Fashion collection' },
    { src: 'img/pexels-vikashkr50-27103969.jpg', alt: 'Fashion collection' },
    { src: 'img/Drzya_web_nur.webp', alt: 'Fashion collection' }
  ];

  const nextSlide = () => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={index}
            className={`hero-slide ${index === currentSlideIndex ? 'active' : ''}`}
          >
            <img src={slide.src} alt={slide.alt} />
          </div>
        ))}
      </div>
      <div className="hero-dots">
        {slides.map((_, index) => (
          <span 
            key={index}
            className={`dot ${index === currentSlideIndex ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;