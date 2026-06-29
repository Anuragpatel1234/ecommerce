import React, { useState, useEffect, useCallback, useRef } from 'react';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const intervalRef = useRef(null);
  
  const slides = React.useMemo(() => [
    { 
      src: 'img/pexels-vikashkr50-27103969.jpg', 
      alt: 'Royal Heritage Collection', 
      subtitleTop: 'RANGAARA AUTUMN EDIT',
      title: 'THE ROYAL HERITAGE',
      subtitle: 'Experience the regal elegance of handcrafted Indian couture',
      ctaText: 'EXPLORE COLLECTION',
      link: '/shop'
    },
    { 
      src: 'img/Approved_Drzya-Desktop-14.webp', 
      alt: 'Festive Splendor', 
      subtitleTop: 'THE SHADI COLLECTION',
      title: 'FESTIVE SPLENDOR',
      subtitle: 'Premium ethnic wear designed for your special celebrations',
      ctaText: 'DISCOVER NOW',
      link: '/shop?collection=Nur'
    },
    { 
      src: 'img/Drzya-Desktop-1_2.webp', 
      alt: 'Modern Craftsmanship', 
      subtitleTop: 'ARTISANAL CHRONICLES',
      title: 'THE ART OF WEAVING',
      subtitle: 'Where traditional artisan techniques meet contemporary design',
      ctaText: 'OUR HERITAGE',
      link: '/about'
    },
    { 
      src: 'img/Drzya-Desktop-11.webp', 
      alt: 'Luxury Edit', 
      subtitleTop: 'VELVET & TISSUE SPECIALS',
      title: 'THE LUXURY EDIT',
      subtitle: 'Hand-selected silk, tissue and embroidered velvet silhouettes',
      ctaText: 'SHOP EXCLUSIVES',
      link: '/shop?filter=luxury'
    }
  ], []);

  // Preload images for smoother transitions
  useEffect(() => {
    slides.forEach((slide) => {
      const img = new Image();
      img.src = slide.src;
    });
  }, [slides]);

  const nextSlide = useCallback(() => {
    setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
  }, [slides.length]);

  const goToSlide = (index) => {
    if (index === currentSlideIndex) return;
    setCurrentSlideIndex(index);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
    
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