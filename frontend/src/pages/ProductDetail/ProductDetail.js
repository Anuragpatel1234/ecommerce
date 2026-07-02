import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import axios from 'axios';
import { getImageUrl } from '../../config/api';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  const toggleAccordion = (panel) => {
    setActiveAccordion(activeAccordion === panel ? null : panel);
  };
  
  const { user, addToCart, addToWishlist, removeFromWishlist, wishlist, currency, formatPrice } = useApp();

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        const productData = response.data;
        
        if (!productData) {
          navigate('/shop');
          return;
        }
        
        setProduct(productData);
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].size);
        }
      } catch (apiError) {
        console.error('Error fetching from API, using sample data:', apiError);
        // Fallback to sample data
        const { getProductById } = await import('../../data/sampleProducts');
        const productData = getProductById(id);
        
        if (!productData) {
          navigate('/shop');
          return;
        }
        
        setProduct(productData);
        if (productData.colors && productData.colors.length > 0) {
          setSelectedColor(productData.colors[0]);
        }
        if (productData.sizes && productData.sizes.length > 0) {
          setSelectedSize(productData.sizes[0].size);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      navigate('/shop');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const result = await addToCart(product._id, quantity, selectedSize, selectedColor);
    if (result.success) {
      // Show success message
      alert('Product added to cart!');
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const isWishlisted = wishlist.some(item => item._id === product._id);
    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
    }
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="spinner"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product Not Found</h2>
        <p>The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/shop')}>Back to Shop</button>
      </div>
    );
  }

  const isWishlisted = wishlist.some(item => item._id === product._id);

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-images">
          <div className="main-image">
            <img 
              src={getImageUrl(product.images?.[activeImageIndex])} 
              alt={product.name}
              fetchpriority="high"
              loading="eager"
              decoding="sync"
            />
            {product.onSale && <span className="sale-badge">SALE</span>}
            {product.newArrival && <span className="new-badge">NEW</span>}
          </div>
          {product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={getImageUrl(image)}
                  alt={`${product.name} ${index + 1}`}
                  className={activeImageIndex === index ? 'active' : ''}
                  onClick={() => setActiveImageIndex(index)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1 className="product-title">{product.name}</h1>
            <button 
              className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
            >
              <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`}></i>
            </button>
          </div>

          <div className="product-price">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="current-price">{formatPrice(product.price)}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="discount">
                {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
              </span>
            )}
          </div>

          {product.rating > 0 && (
            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <i 
                    key={i}
                    className={`fa-${i < Math.floor(product.rating) ? 'solid' : 'regular'} fa-star`}
                  ></i>
                ))}
              </div>
              <span className="rating-text">({product.reviews?.length || 0} reviews)</span>
            </div>
          )}

          <div className="product-description">
            <p>{product.description}</p>
          </div>

          <div className="luxury-accordions">
            <div className={`accordion-item ${activeAccordion === 'fabric' ? 'open' : ''}`}>
              <button className="accordion-title-btn" onClick={() => toggleAccordion('fabric')}>
                <span>Fabric & Materials</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>
              <div className="accordion-content">
                <p>Meticulously hand-selected premium {product.material || 'Organic cotton and silk blends'}, designed for drape, breathability, and luxurious comfort against the skin.</p>
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === 'craft' ? 'open' : ''}`}>
              <button className="accordion-title-btn" onClick={() => toggleAccordion('craft')}>
                <span>Craftsmanship</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>
              <div className="accordion-content">
                <p>Hand-woven and embroidered by master artisans. Each stitch, print, and weave honors age-old traditional Indian heritage methods, reimagined with meticulous modern finishing.</p>
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === 'shipping' ? 'open' : ''}`}>
              <button className="accordion-title-btn" onClick={() => toggleAccordion('shipping')}>
                <span>Shipping & Returns</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>
              <div className="accordion-content">
                <p>Complimentary shipping on all domestic orders. Orders are processed within 24-48 hours. Easy 30-day hassle-free returns and exchanges in pristine condition.</p>
              </div>
            </div>

            <div className={`accordion-item ${activeAccordion === 'care' ? 'open' : ''}`}>
              <button className="accordion-title-btn" onClick={() => toggleAccordion('care')}>
                <span>Care Guide</span>
                <i className="fa-solid fa-chevron-down"></i>
              </button>
              <div className="accordion-content">
                <p>{product.careInstructions || 'Dry clean only to maintain fabric weave, hand embellishments, and structural integrity. Iron on low heat under a protective cloth.'}</p>
              </div>
            </div>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="product-options">
              <h4>Size</h4>
              <div className="size-options">
                {product.sizes.map((sizeObj) => (
                  <button
                    key={sizeObj.size}
                    className={`size-option ${selectedSize === sizeObj.size ? 'selected' : ''} ${sizeObj.stock === 0 ? 'out-of-stock' : ''}`}
                    onClick={() => setSelectedSize(sizeObj.size)}
                    disabled={sizeObj.stock === 0}
                  >
                    {sizeObj.size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-options">
            <h4>Quantity</h4>
            <div className="quantity-selector">
              <button 
                className="qty-btn"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                -
              </button>
              <span className="qty-display">{quantity}</span>
              <button 
                className="qty-btn"
                onClick={() => setQuantity(quantity + 1)}
              >
                +
              </button>
            </div>
          </div>

          <div className="product-actions">
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              {product.inStock ? 'Add to Collection' : 'Out of Stock'}
            </button>
          </div>

          <div className="shipping-info">
            <div className="shipping-item">
              <i className="fa-solid fa-truck"></i>
              <span>Free shipping on orders above ₹2,000</span>
            </div>
            <div className="shipping-item">
              <i className="fa-solid fa-rotate-left"></i>
              <span>Easy 30-day returns</span>
            </div>
            <div className="shipping-item">
              <i className="fa-solid fa-shield-halved"></i>
              <span>Secure payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;