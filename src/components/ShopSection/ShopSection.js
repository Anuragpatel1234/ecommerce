import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import './ShopSection.css';

const ShopSection = () => {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?newArrival=true&limit=10');
      const fetchedProducts = response.data.products || response.data || [];
      // Prioritize sample data to ensure we have enough products
      const { getNewArrivalProducts } = await import('../../data/sampleProducts');
      const sampleProducts = getNewArrivalProducts();
      // Use sample data if API returns fewer products, or combine them
      if (fetchedProducts.length < 4) {
        setProducts(sampleProducts.slice(0, 10));
      } else {
        setProducts(fetchedProducts.slice(0, 10));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data
      const { getNewArrivalProducts } = await import('../../data/sampleProducts');
      setProducts(getNewArrivalProducts().slice(0, 10));
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Auto-scroll functionality
  useEffect(() => {
    if (products.length === 0 || isHovered) return;

    autoScrollIntervalRef.current = setInterval(() => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollAmount = 320;
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
  }, [products, isHovered]);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="shop-section">
      <h2 className="common-heading center">New Arrival</h2>
      <div 
        className="shop-section-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className={`shop-nav-arrow shop-nav-arrow-left ${isHovered ? 'visible' : ''}`} onClick={scrollLeft}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="shop-images-section" ref={scrollContainerRef}>
        {products.map((product) => (
            <ProductCard key={product._id} product={product} showNewBadge={true} />
        ))}
        </div>
        <button className={`shop-nav-arrow shop-nav-arrow-right ${isHovered ? 'visible' : ''}`} onClick={scrollRight}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
      <div className="shop-section-footer">
        <Link to="/shop?filter=newArrival" className="view-all-btn">
          VIEW ALL
        </Link>
      </div>
    </section>
  );
};

export default ShopSection;