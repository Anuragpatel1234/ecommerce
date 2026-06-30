import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import './ProductCard.css';

const ProductCard = ({ product, showNewBadge = false }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { user, wishlist, addToWishlist, removeFromWishlist, addToCart, currency } = useApp();

  // Mock data for visual enhancement if missing from API
  const mockRating = product?.rating || 4.5;
  const mockReviewCount = product?.reviews?.length || Math.floor(Math.random() * 50) + 10;
  const mockColors = product?.colors?.length > 0 ? product.colors : ['#FF0000', '#FFD700', '#0000FF'];
  const isNew = product?.newArrival || Math.random() > 0.7; // Randomly assign "NEW" if missing

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
      navigate('/login');
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
      navigate('/login');
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
    if (showNewBadge) {
      // For New Arrivals section, always show in Rs. format
      return `Rs. ${price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

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
            loading="lazy"
            decoding="async"
          />

          {showNewBadge && (
            <span className="product-badge new-arrivals-badge">New Arrivals</span>
          )}

          {!showNewBadge && isNew && (
            <span className="product-badge new-badge">NEW</span>
          )}

          <button
            className={`product-wishlist-icon ${isWishlisted ? 'active' : ''}`}
            onClick={handleWishlistToggle}
            disabled={loading}
          >
            <i className={`fa-${isWishlisted ? 'solid' : 'regular'} fa-heart`}></i>
          </button>

          {showNewBadge ? (
            <button
              className="product-add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bag-shopping"></i>}
              {loading ? 'Adding...' : 'Add to Cart'}
            </button>
          ) : (
          <div className="product-overlay">
            <button
              className="overlay-btn add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-bag-shopping"></i>}
              {loading ? 'ADDING...' : 'ADD TO COLLECTION'}
            </button>
          </div>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <div className="product-price">
            {product.originalPrice && product.originalPrice > product.price && !showNewBadge && (
              <span className="original-price">{formatPrice(product.originalPrice)}</span>
            )}
            <span className="current-price">{formatPrice(product.price)}</span>
          </div>

          {!showNewBadge && (
            <>
          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fa-${i < Math.floor(mockRating) ? 'solid' : 'regular'} fa-star`}
                ></i>
              ))}
            </div>
            <span className="rating-text">({mockReviewCount})</span>
          </div>
            </>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;