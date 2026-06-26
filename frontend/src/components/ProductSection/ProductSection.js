import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import API_BASE_URL from '../../config/api';
import './ProductSection.css';

const ProductSection = () => {
  const [products, setProducts] = useState([]);
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/products?bestseller=true&limit=10`);
      let fetchedProducts = response.data.products || response.data || [];

      // Ensure it's an array
      if (!Array.isArray(fetchedProducts)) {
        fetchedProducts = [];
      }

      // Fallback if API returns empty array (e.g. no products marked as bestseller in DB yet)
      if (fetchedProducts.length === 0) {
        console.log('No bestseller products found in API, using sample data');
        const { getBestsellerProducts } = await import('../../data/sampleProducts');
        fetchedProducts = getBestsellerProducts();
      }

      // Ensure we have an array before setting
      const productsArray = Array.isArray(fetchedProducts) ? fetchedProducts.slice(0, 10) : [];
      setProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data on error
      try {
        const { getBestsellerProducts } = await import('../../data/sampleProducts');
        const fallbackProducts = getBestsellerProducts();
        setProducts(Array.isArray(fallbackProducts) ? fallbackProducts.slice(0, 10) : []);
      } catch (fallbackError) {
        console.error('Error loading fallback products:', fallbackError);
        setProducts([]);
      }
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

  // Ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  return (
    <section className="product-section">
      <div className="product-section-heading">
        <h2 className="common-heading">Most Selling Products</h2>
        <Link to="/shop?filter=bestseller" className="view-text">Explore Collection</Link>
      </div>
      <div 
        className="product-section-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className={`product-nav-arrow product-nav-arrow-left ${isHovered ? 'visible' : ''}`} onClick={scrollLeft}>
          <i className="fa-solid fa-chevron-left"></i>
        </button>
        <div className="product-container" ref={scrollContainerRef}>
        {safeProducts.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
        </div>
        <button className={`product-nav-arrow product-nav-arrow-right ${isHovered ? 'visible' : ''}`} onClick={scrollRight}>
          <i className="fa-solid fa-chevron-right"></i>
        </button>
      </div>
    </section>
  );
};

export default ProductSection;