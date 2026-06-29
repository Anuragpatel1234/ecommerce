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

  const staticProducts = [
    {
      _id: 'hero',
      name: 'HANDLOOM SILK SAREE',
      price: 6500,
      image: '/img/0952.webp'
    },
    {
      _id: '1',
      name: 'VELVET BRIDAL LEHENGA',
      price: 24999,
      image: '/img/06e447550bc57e1226507591a9b847e5.jpg'
    },
    {
      _id: '2',
      name: 'KIDS LEHENGA SET',
      price: 2499,
      image: '/img/Attached_image.png'
    },
    {
      _id: '3',
      name: 'BANARASI DUPATTA',
      price: 3499,
      image: '/img/lehenga-2.jpg'
    },
    {
      _id: '4',
      name: 'ROYAL LEHENGA SET',
      price: 8999,
      image: '/img/06e447550bc57e1226507591a9b847e5.jpg'
    }
  ];

  const heroProduct = staticProducts[0];
  const gridProducts = staticProducts.slice(1);

  return (
    <section className="featured-collection-section">
      <h2 className="common-heading center">Featured Collection</h2>
      <div className="featured-container">
        {/* Hero Card - Left side */}
        <Link to={`/product/${heroProduct._id}`} className="hero-card">
          <div className="hero-image">
            <img 
              src={heroProduct.image} 
              alt={heroProduct.name}
              onError={(e) => {
                console.error(`Failed to load hero image: ${heroProduct.image}`);
                e.target.src = '/img/placeholder.jpg';
              }}
            />
            <div className="hero-image-overlay">
              <h3>{heroProduct.name}</h3>
              <p>{formatPrice(heroProduct.price)}</p>
            </div>
          </div>
          <div className="featured-hero-content">
            <h3>{heroProduct.name}</h3>
            <p>{formatPrice(heroProduct.price)}</p>
          </div>
        </Link>

        {/* Featured Cards Grid - Right side (2x2) */}
        <div className="featured-grid">
          {gridProducts.map((product, index) => {
            return (
              <Link 
                key={index} 
                to={`/product/${product._id}`} 
                className="featured-card"
              >
                <div className="featured-card-image">
                  <img 
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      console.error(`Failed to load image at index ${index}: ${product.image}`);
                      e.target.src = '/img/placeholder.jpg';
                    }}
                  />
                  <div className="featured-card-image-overlay">
                    <h3>{product.name}</h3>
                    <p>{formatPrice(product.price)}</p>
                  </div>
                </div>
                <div className="featured-card-content">
                  <h3>{product.name}</h3>
                  <p>{formatPrice(product.price)}</p>
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