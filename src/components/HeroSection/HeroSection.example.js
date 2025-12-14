// Example: How to use CMS data in HeroSection
// This shows how you can update components to use CMS data

import React, { useState, useEffect, useCallback } from 'react';
import { useSection } from '../../hooks/useSection';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  // Fetch section data from CMS
  const { section, loading, error } = useSection('hero-slider');
  
  // Fallback to default slides if CMS data not available
  const defaultSlides = [
    { src: 'img/pexels-vikashkr50-27103969.jpg', alt: 'Fashion collection' },
    { src: 'img/Approved_Drzya-Desktop-14.webp', alt: 'Fashion collection' },
    { src: 'img/Drzya-Desktop-1_2.webp', alt: 'Fashion collection' },
  ];

  // Use CMS data if available, otherwise use defaults
  const slides = section?.images && section.images.length > 0
    ? section.images.map(img => ({ src: img.url, alt: img.alt || section.title || 'Fashion collection' }))
    : defaultSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlideIndex(index);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  if (loading) {
    return (
      <section className="hero-section">
        <div className="hero-loading">Loading...</div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      {section?.title && (
        <div className="hero-title-overlay">
          <h1>{section.title}</h1>
          {section.subtitle && <p>{section.subtitle}</p>}
        </div>
      )}
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

