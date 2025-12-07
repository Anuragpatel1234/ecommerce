import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { user, wishlist, addToWishlist, removeFromWishlist, addToCart, currency } = useApp();

  // Check if product is in wishlist
  React.useEffect(() => {
    if (wishlist && product) {
      setIsWishlisted(wishlist.some(item => item._id === product._id));
    }
  }, [wishlist, product]);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
      } else {
        await addToWishlist(product._id);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      // Redirect to login or show login modal
      return;
    }

    setLoading(true);
    try {
      await addToCart(product._id, 1);
      // Show success message
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const currencySymbols = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£',
      CAD: 'C$',
      AUD: 'A$',
      SGD: 'S$'
    };
    
    // Simple currency conversion (in real app, use proper exchange rates)
    const rates = {
      INR: 1,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      CAD: 0.016,
      AUD: 0.018,
      SGD: 0.016
    };
    
    const convertedPrice = Math.round(price * rates[currency]);
    return `${currencySymbols[currency]}${convertedPrice.toLocaleString()}`;
  };

  if (!product) return null;

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image-container">
          <img 
            src={product.images?.[0] || 'img/placeholder.jpg'} 
            alt={product.name}
            className="product-image"
          />
          
          {product.onSale && (
            <span className="product-badge sale-badge">SALE</span>
          )}
          
          {product.newArrival && (
            <span className="product-badge new-badge">NEW</span>
          )}
          
          <div className="product-overlay">
            <button 
              className="overlay-btn add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={loading}
            >
              <i className="fa-solid fa-bag-shopping"></i>
              Add to Collection
            </button>
            
            <button 
              className={`overlay-btn wishlist-btn ${isWishlisted ? 'active' : ''}`}
              onClick={handleWishlistToggle}
              disabled={loading}
            >
              <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`}></i>
            </button>
          </div>
        </div>
        
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-price">
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="current-price">{formatPrice(product.price)}</span>
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
              <span className="rating-text">({product.reviews?.length || 0})</span>
            </div>
          )}
          
          {product.colors && product.colors.length > 0 && (
            <div className="product-colors">
              {product.colors.slice(0, 4).map((color, index) => (
                <span 
                  key={index}
                  className="color-dot"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                ></span>
              ))}
              {product.colors.length > 4 && (
                <span className="more-colors">+{product.colors.length - 4}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;