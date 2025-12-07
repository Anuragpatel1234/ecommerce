import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import axios from 'axios';
import './Cart.css';

const Cart = () => {
  const { user, cart, loadCart, currency } = useApp();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadCart();
    }
  }, [user, loadCart]);

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

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/cart/update/${itemId}`, {
        quantity: newQuantity
      });
      loadCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setLoading(true);
      await axios.delete(`http://localhost:5000/api/cart/remove/${itemId}`);
      loadCart();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      await axios.delete('http://localhost:5000/api/cart/clear');
      loadCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <i className="fa-solid fa-bag-shopping"></i>
          <h2>Please Login to View Cart</h2>
          <p>You need to be logged in to access your shopping cart.</p>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <i className="fa-solid fa-bag-shopping"></i>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <Link to="/shop" className="shop-btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  const subtotal = cart.totalAmount || 0;
  const shipping = subtotal > 2000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1 className="common-heading">Shopping Cart</h1>
        <button 
          className="clear-cart-btn"
          onClick={clearCart}
          disabled={loading}
        >
          Clear Cart
        </button>
      </div>

      <div className="cart-container">
        <div className="cart-items">
          {cart.items.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img 
                  src={item.product?.images?.[0] || 'img/placeholder.jpg'} 
                  alt={item.product?.name || 'Product'} 
                />
              </div>
              
              <div className="item-details">
                <h3 className="item-name">{item.product?.name}</h3>
                <div className="item-variants">
                  {item.size && <span className="variant">Size: {item.size}</span>}
                  {item.color && <span className="variant">Color: {item.color}</span>}
                </div>
                <div className="item-price">{formatPrice(item.product?.price || 0)}</div>
              </div>
              
              <div className="item-quantity">
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  disabled={loading || item.quantity <= 1}
                >
                  -
                </button>
                <span className="qty-display">{item.quantity}</span>
                <button 
                  className="qty-btn"
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  disabled={loading}
                >
                  +
                </button>
              </div>
              
              <div className="item-total">
                {formatPrice((item.product?.price || 0) * item.quantity)}
              </div>
              
              <button 
                className="remove-btn"
                onClick={() => removeItem(item._id)}
                disabled={loading}
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h3>Order Summary</h3>
          
          <div className="summary-row">
            <span>Subtotal ({cart.items.length} items)</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
          </div>
          
          <div className="summary-row">
            <span>Tax (18% GST)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          
          <div className="summary-divider"></div>
          
          <div className="summary-row total-row">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          
          {subtotal < 2000 && (
            <div className="shipping-notice">
              Add {formatPrice(2000 - subtotal)} more for FREE shipping!
            </div>
          )}
          
          <button 
            className="checkout-btn"
            onClick={proceedToCheckout}
            disabled={loading}
          >
            Proceed to Checkout
          </button>
          
          <Link to="/shop" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;