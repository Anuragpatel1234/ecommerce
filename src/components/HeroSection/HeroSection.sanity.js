import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSanityData } from '../../hooks/useSanity';
import { urlFor } from '../../lib/sanity';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const intervalRef = useRef(null);
  
  // Fetch hero banners from Sanity
  const { data: slides, loading, error } = useSanityData(`*[_type == "hero"] | order(order asc)`);

  const nextSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides]);

  const goToSlide = (index) => {
    if (index === currentSlideIndex) return;
    setCurrentSlideIndex(index);
  };

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide, slides]);

  if (loading) return <div className="hero-loading">Loading Banners...</div>;
  if (error || !slides || slides.length === 0) {
    // Fallback to static images if Sanity fails or is empty
    return (
      <section className="hero-section">
        <div className="hero-slide active">
          <img src="img/pexels-vikashkr50-27103969.jpg" alt="Fallback" />
          <div className="hero-content">
            <h2>Welcome to Rangaara</h2>
            <p>Experience the finest fashion</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {slides.map((slide, index) => (
          <div 
            key={slide._id || index}
            className={`hero-slide ${index === currentSlideIndex ? 'active' : ''}`}
          >
            {slide.image && (
              <img src={urlFor(slide.image).url()} alt={slide.title || 'Fashion collection'} />
            )}
            <div className="hero-content">
              {slide.title && <h2>{slide.title}</h2>}
              {slide.subtitle && <h3>{slide.subtitle}</h3>}
              {slide.description && <p>{slide.description}</p>}
              {slide.ctaText && slide.ctaLink && (
                <a href={slide.ctaLink} className="hero-cta-button">
                  {slide.ctaText}
                </a>
              )}
            </div>
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
