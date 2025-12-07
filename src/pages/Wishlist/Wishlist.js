import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
  const { user, wishlist, loadWishlist } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadWishlist();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <i className="fa-regular fa-heart"></i>
          <h2>Please Login to View Wishlist</h2>
          <p>You need to be logged in to access your wishlist.</p>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </div>
    );
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <i className="fa-regular fa-heart"></i>
          <h2>Your Wishlist is Empty</h2>
          <p>Save your favorite items to your wishlist and shop them later.</p>
          <Link to="/shop" className="shop-btn">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1 className="common-heading">My Wishlist</h1>
        <p className="wishlist-count">{wishlist.length} item{wishlist.length !== 1 ? 's' : ''} saved</p>
      </div>

      <div className="wishlist-grid">
        {wishlist.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      <div className="wishlist-actions">
        <Link to="/shop" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;