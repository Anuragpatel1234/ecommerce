import { getImageUrl } from '../../config/api';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import './Checkout.css';

const Checkout = () => {
  const { user, cart, currency, formatPrice } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      firstName: '',
      lastName: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: ''
    }
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    // Pre-fill with user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || '',
          phone: user.phone || ''
        }
      }));
    }
  }, [user, cart, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('shippingAddress.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const validateStep1 = () => {
    const { shippingAddress } = formData;
    return (
      shippingAddress.firstName &&
      shippingAddress.lastName &&
      shippingAddress.street &&
      shippingAddress.city &&
      shippingAddress.state &&
      shippingAddress.zipCode &&
      shippingAddress.country &&
      shippingAddress.phone
    );
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setLoading(true);
      // Navigate to payment page with order data
      navigate('/payment', {
        state: {
          shippingAddress: formData.shippingAddress,
          paymentMethod: 'razorpay'
        }
      });
    }
  };

  if (!user || !cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.totalAmount || 0;
  const isInternational = formData.shippingAddress.country.toLowerCase() !== 'india' && formData.shippingAddress.country.toLowerCase() !== 'in';
  
  // International shipping logic
  const shipping = isInternational ? 1500 : (subtotal > 2000 ? 0 : 200);
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-content">
          <div className="checkout-form">
              <div className="shipping-form">
                <h2>Shipping Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="shippingAddress.firstName"
                      value={formData.shippingAddress.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="shippingAddress.lastName"
                      value={formData.shippingAddress.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="street">Street Address *</label>
                  <input
                    type="text"
                    id="street"
                    name="shippingAddress.street"
                    value={formData.shippingAddress.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City *</label>
                    <input
                      type="text"
                      id="city"
                      name="shippingAddress.city"
                      value={formData.shippingAddress.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State *</label>
                    <input
                      type="text"
                      id="state"
                      name="shippingAddress.state"
                      value={formData.shippingAddress.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zipCode">ZIP Code *</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="shippingAddress.zipCode"
                      value={formData.shippingAddress.zipCode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="country">Country *</label>
                    <input
                      type="text"
                      id="country"
                      name="shippingAddress.country"
                      value={formData.shippingAddress.country}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="shippingAddress.phone"
                    value={formData.shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <button 
                  className="next-btn"
                  onClick={handleNextStep}
                  disabled={!validateStep1() || loading}
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>


          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img 
                    src={getImageUrl(item.product?.images?.[0])} 
                    alt={item.product?.name} 
                  />
                  <div className="item-details">
                    <h4>{item.product?.name}</h4>
                    <div className="item-variants">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="item-price">
                      {formatPrice(item.product?.price || 0)} × {item.quantity}
                    </div>
                  </div>
                  <div className="item-total">
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>Subtotal</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;