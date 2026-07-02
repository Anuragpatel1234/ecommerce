import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';
import './HeroSection.css';

const HeroSection = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const [slides, setSlides] = useState([]);
  const fallbackSlides = React.useMemo(() => [
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

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.PUBLIC.SECTION_BY_KEY('hero_section'));
        const sectionSlides = res.data?.content?.slides || [];
        
        if (sectionSlides.length > 0) {
          const mappedSlides = sectionSlides
            .filter(s => s.isActive !== false)
            .map(s => ({
              src: s.image,
              alt: s.heading || 'Hero Image',
              subtitleTop: s.subheading,
              title: s.heading,
              subtitle: s.description,
              ctaText: s.primaryBtnText,
              link: s.primaryBtnUrl
            }));
          setSlides(mappedSlides.length > 0 ? mappedSlides : fallbackSlides);
        } else {
          setSlides(fallbackSlides);
        }
      } catch (err) {
        console.error('Failed to fetch hero section', err);
        setSlides(fallbackSlides);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, [fallbackSlides]);
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
            <img 
              src={slide.src} 
              alt={slide.alt} 
              loading={index === 0 ? "eager" : "lazy"}
              fetchpriority={index === 0 ? "high" : "auto"}
              decoding={index === 0 ? "sync" : "async"}
            />
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