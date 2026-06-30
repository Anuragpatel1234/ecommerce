import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ShopCategories.css';

const ShopCategories = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const categories = [
    {
      id: 1,
      title: 'LEHENGAS',
      image: 'img/Untitled-4.webp',
      alt: 'Lehengas Collection'
    },
    {
      id: 2,
      title: 'SHARARA SETS',
      image: 'img/0952.webp',
      alt: 'Sharara Sets Collection'
    },
    {
      id: 3,
      title: 'ANARKALI SETS',
      image: 'img/dupatta1.webp',
      alt: 'Anarkali Sets Collection'
    },
    {
      id: 4,
      title: 'KURTA SETS',
      image: 'img/SKIRTS1.jpg',
      alt: 'Kurta Sets Collection'
    },
    {
      id: 5,
      title: 'COORD SETS',
      image: 'img/traditional outfit 2.webp',
      alt: 'Coord Sets Collection'
    },
    {
      id: 6,
      title: 'KAFTAN SETS',
      image: 'img/kids lehenga set.webp',
      alt: 'Kaftan Sets Collection'
    },
    {
      id: 7,
      title: 'DHOTI SETS',
      image: 'img/Untitled-4.webp',
      alt: 'Dhoti Sets Collection'
    },
    {
      id: 8,
      title: 'LOUNGE WEAR',
      image: 'img/0952.webp',
      alt: 'Lounge Wear Collection'
    }
  ];

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Auto-scroll functionality for mobile
  useEffect(() => {
    if (!isMobile || !scrollContainerRef.current || isHovered) return;

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const cardWidth = container.querySelector('.category-card')?.offsetWidth || 0;
        const gap = 12; // Match CSS gap
        const scrollAmount = cardWidth + gap;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        if (container.scrollLeft >= maxScroll - 10) {
          // Reset to beginning when reaching the end
          container.scrollTo({
            left: 0,
            behavior: 'smooth'
          });
        } else {
          container.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
      }
    }, 3000); // Auto-scroll every 3 seconds

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isMobile, isHovered]);

  const handleCategoryClick = (categoryTitle) => {
    navigate(`/category/${encodeURIComponent(categoryTitle)}`);
  };

  return (
    <section className="shop-categories-section">
      <h2 className="common-heading center">Shop by Categories</h2>
      <div 
        className="categories-container"
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={() => setIsHovered(true)}
        onTouchEnd={() => {
          // Resume auto-scroll after a delay when touch ends
          setTimeout(() => setIsHovered(false), 2000);
        }}
      >
        {categories.map((category) => (
          <div 
            key={category.id} 
            className="category-card"
            onClick={() => handleCategoryClick(category.title)}
          >
            <div className="category-image-section">
              <img 
                src={`/${category.image}`} 
                alt={category.alt} 
                loading="lazy" 
                decoding="async" 
              />
              <div className="category-text-overlay">
                <h3 className="category-title">{category.title}</h3>
                <button 
                  className="category-button"
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category.title);
                  }}
                >
                  VIEW PRODUCT
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ShopCategories;