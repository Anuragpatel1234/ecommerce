import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/SafeAppContext';
import axios from 'axios';
import './Payment.css';

const Payment = () => {
  const { user, cart, currency, loadCart } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    cardType: ''
  });
  const [errors, setErrors] = useState({});
  const [orderData, setOrderData] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    // Get order data from location state (passed from checkout)
    if (location.state) {
      setOrderData(location.state);
    }
  }, [user, cart, navigate, location]);

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

  const detectCardType = (cardNumber) => {
    const number = cardNumber.replace(/\s/g, '');
    if (/^4/.test(number)) return 'Visa';
    if (/^5[1-5]/.test(number)) return 'Mastercard';
    if (/^3[47]/.test(number)) return 'Amex';
    if (/^6/.test(number)) return 'Discover';
    return '';
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = ((matches && matches[0]) || '');
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4);
    }
    return v;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = formatCardNumber(value);
      const cardType = detectCardType(value);
      setCardData(prev => ({ ...prev, cardType }));
    } else if (name === 'expiryDate') {
      formattedValue = formatExpiryDate(value);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 4);
    }

    setCardData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateCard = () => {
    const newErrors = {};
    
    if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length < 13) {
      newErrors.cardNumber = 'Please enter a valid card number';
    }
    
    if (!cardData.cardName || cardData.cardName.length < 3) {
      newErrors.cardName = 'Please enter cardholder name';
    }
    
    if (!cardData.expiryDate || cardData.expiryDate.length !== 5) {
      newErrors.expiryDate = 'Please enter valid expiry date (MM/YY)';
    } else {
      const [month, year] = cardData.expiryDate.split('/');
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      
      if (parseInt(month) < 1 || parseInt(month) > 12) {
        newErrors.expiryDate = 'Invalid month';
      } else if (parseInt(year) < currentYear || (parseInt(year) === currentYear && parseInt(month) < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!cardData.cvv || cardData.cvv.length < 3) {
      newErrors.cvv = 'Please enter CVV';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      if (!validateCard()) {
        return;
      }
    }

    setLoading(true);
    
    try {
      const orderPayload = {
        shippingAddress: orderData?.shippingAddress || {},
        paymentMethod: paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          cardType: cardData.cardType,
          last4: cardData.cardNumber.slice(-4)
        } : {},
        currency
      };

      const response = await axios.post('http://localhost:5000/api/orders/create', orderPayload);
      
      // Clear cart after successful order
      await axios.delete('http://localhost:5000/api/cart/clear');
      loadCart();
      
      // Navigate to order confirmation
      navigate('/orders', { 
        state: { 
          orderId: response.data.order?._id || response.data._id,
          success: true 
        } 
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.totalAmount || 0;
  const shipping = subtotal > 2000 ? 0 : 200;
  const tax = subtotal * 0.18;
  const total = subtotal + shipping + tax;

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Payment</h1>
          <p>Complete your purchase securely</p>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            <div className="payment-methods">
              <h3>Select Payment Method</h3>
              <div className="payment-options">
                <label className={`payment-option ${paymentMethod === 'card' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <i className="fa-solid fa-credit-card"></i>
                    <span>Credit/Debit Card</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'paypal' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <i className="fa-brands fa-paypal"></i>
                    <span>PayPal</span>
                  </div>
                </label>

                <label className={`payment-option ${paymentMethod === 'cod' ? 'active' : ''}`}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <div className="payment-option-content">
                    <i className="fa-solid fa-money-bill"></i>
                    <span>Cash on Delivery</span>
                  </div>
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <div className="card-form">
                <h3>Card Details</h3>
                
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <div className="card-input-wrapper">
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={cardData.cardNumber}
                      onChange={handleCardInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className={errors.cardNumber ? 'error' : ''}
                    />
                    {cardData.cardType && (
                      <span className="card-type">{cardData.cardType}</span>
                    )}
                  </div>
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="cardName">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={cardData.cardName}
                    onChange={handleCardInputChange}
                    placeholder="John Doe"
                    className={errors.cardName ? 'error' : ''}
                  />
                  {errors.cardName && <span className="error-message">{errors.cardName}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={cardData.expiryDate}
                      onChange={handleCardInputChange}
                      placeholder="MM/YY"
                      maxLength="5"
                      className={errors.expiryDate ? 'error' : ''}
                    />
                    {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={cardData.cvv}
                      onChange={handleCardInputChange}
                      placeholder="123"
                      maxLength="4"
                      className={errors.cvv ? 'error' : ''}
                    />
                    {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                  </div>
                </div>

                <div className="security-info">
                  <i className="fa-solid fa-lock"></i>
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </div>
            )}

            {paymentMethod === 'paypal' && (
              <div className="paypal-info">
                <p>You will be redirected to PayPal to complete your payment.</p>
                <button className="paypal-button">
                  <i className="fa-brands fa-paypal"></i>
                  Continue with PayPal
                </button>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="cod-info">
                <div className="info-box">
                  <i className="fa-solid fa-info-circle"></i>
                  <div>
                    <h4>Cash on Delivery</h4>
                    <p>Pay cash when your order is delivered. Additional charges may apply.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="payment-actions">
              <button 
                className="back-btn"
                onClick={() => navigate('/checkout')}
                disabled={loading}
              >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Checkout
              </button>
              <button 
                className="pay-btn"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="spinner-small"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-lock"></i>
                    Pay {formatPrice(total)}
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="payment-summary">
            <h3>Order Summary</h3>
            
            <div className="summary-items">
              {cart.items.map((item) => (
                <div key={item._id} className="summary-item">
                  <img 
                    src={item.product?.images?.[0] || 'img/placeholder.jpg'} 
                    alt={item.product?.name} 
                  />
                  <div className="summary-item-details">
                    <h4>{item.product?.name}</h4>
                    <div className="summary-item-variants">
                      {item.size && <span>Size: {item.size}</span>}
                      {item.color && <span>Color: {item.color}</span>}
                    </div>
                    <div className="summary-item-price">
                      {formatPrice(item.product?.price || 0)} × {item.quantity}
                    </div>
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

export default Payment;

