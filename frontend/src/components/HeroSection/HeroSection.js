import React, { useState, useEffect, useCallback, useRef } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const intervalRef = useRef(null);
  
  const slides = React.useMemo(() => [
    { src: 'img/pexels-vikashkr50-27103969.jpg', alt: 'Fashion collection' },
    { src: 'img/Approved_Drzya-Desktop-14.webp', alt: 'Fashion collection' },
    { src: 'img/Drzya-Desktop-1_2.webp', alt: 'Fashion collection' },
    { src: 'img/Drzya-Desktop-11.webp', alt: 'Fashion collection' },
    { src: 'img/ishq_new_arrivals_dekstop.webp', alt: 'Fashion collection' },
    { src: 'img/pexels-vikashkr50-27103969.jpg', alt: 'Fashion collection' },
    { src: 'img/Drzya_web_nur.webp', alt: 'Fashion collection' }
  ], []);

  // Preload images for smoother transitions
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, [slides]);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % slides.length;
      return nextIndex;
    });
  }, [slides.length]);

  const goToSlide = (index) => {
    if (index === currentSlideIndex) return;
    setCurrentSlideIndex(index);
  };

  useEffect(() => {
    // Slide transition interval - animation runs continuously independently
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide]);

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