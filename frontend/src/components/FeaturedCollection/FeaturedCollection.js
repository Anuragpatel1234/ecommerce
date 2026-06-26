import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../../config/api';
import './FeaturedCollection.css';

const FeaturedCollection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      // Try to fetch from backend API
      const response = await axios.get(`${API_BASE_URL}/api/products?featured=true&limit=5`);
      let fetchedProducts = response.data.products || response.data || [];
      
      // Ensure it's an array
      if (!Array.isArray(fetchedProducts)) {
        fetchedProducts = [];
      }
      
      setProducts(fetchedProducts.slice(0, 5));
    } catch (error) {
      console.error('Error fetching featured products:', error);
      // Fallback to sample data
      try {
        const { getFeaturedProducts } = await import('../../data/sampleProducts');
        const featuredProducts = getFeaturedProducts();
        setProducts(Array.isArray(featuredProducts) ? featuredProducts.slice(0, 5) : []);
      } catch (fallbackError) {
        console.error('Error loading fallback products:', fallbackError);
        setProducts([]);
      }
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined || isNaN(price)) {
      return '₹0';
    }
    return `₹${Number(price).toLocaleString('en-IN')}`;
  };

  // Ensure we have at least 5 products (1 hero + 4 grid items)
  const displayProducts = [...products];
  while (displayProducts.length < 5) {
    displayProducts.push(null);
  }

  const heroProduct = displayProducts[0] || { _id: '1', name: 'MANISHYA KARAM PANTS', price: 2295 };
  const gridProducts = displayProducts.slice(1, 5).filter(p => p !== null);
  
  // Ensure heroProduct has a valid price
  if (!heroProduct.price && heroProduct.price !== 0) {
    heroProduct.price = 2295;
  }

  // Define specific images for each card position
  const cardImages = [
    '/img/06e447550bc57e1226507591a9b847e5.jpg', // First grid card - keep existing
    '/img/Attached_image.png', // Second grid card - new lehenga image
    '/img/lehenga-2.jpg', // Third grid card - new lehenga image
    '/img/06e447550bc57e1226507591a9b847e5.jpg'  // Fourth grid card - keep existing
  ];

  return (
    <section className="featured-collection-section">
      <h2 className="common-heading center">Featured Collection</h2>
      <div className="featured-container">
        {/* Hero Card - Left side */}
        <Link to={`/product/${heroProduct._id}`} className="hero-card">
          <div className="hero-image">
            <img 
              src="/img/0952.webp" 
              alt={heroProduct.name || 'Featured Product'}
              onError={(e) => {
                console.error('Failed to load hero image: /img/0952.webp');
                e.target.src = '/img/placeholder.jpg';
              }}
            />
            <div className="hero-image-overlay">
              <h3>{heroProduct.name}</h3>
              <p>{formatPrice(heroProduct.price)}</p>
            </div>
          </div>
          <div className="hero-content">
            <h3>{heroProduct.name}</h3>
            <p>{formatPrice(heroProduct.price)}</p>
          </div>
        </Link>

        {/* Featured Cards Grid - Right side (2x2) */}
        <div className="featured-grid">
          {[0, 1, 2, 3].map((index) => {
            const cardImage = cardImages[index] || '/img/06e447550bc57e1226507591a9b847e5.jpg';
            const product = gridProducts[index];
            const productName = product?.name || 'ROYAL LEHENGA SET';
            const productPrice = product?.price || 8999;
            const productId = product?._id || '2';

            return (
              <Link 
                key={index} 
                to={`/product/${productId}`} 
                className="featured-card"
              >
                <div className="featured-card-image">
                  <img 
                    src={cardImage}
                    alt={productName}
                    onError={(e) => {
                      console.error(`Failed to load image at index ${index}: ${cardImage}`);
                      e.target.src = '/img/placeholder.jpg';
                    }}
                    onLoad={() => {
                      console.log(`Successfully loaded image at index ${index}: ${cardImage}`);
                    }}
                  />
                  <div className="featured-card-image-overlay">
                    <h3>{productName}</h3>
                    <p>{formatPrice(productPrice)}</p>
                  </div>
                </div>
                <div className="featured-card-content">
                  <h3>{productName}</h3>
                  <p>{formatPrice(productPrice)}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollection;