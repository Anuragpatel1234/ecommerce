import { getImageUrl } from '../../config/api';
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
  const [orderData, setOrderData] = useState(null);
  const [razorpaySdkReady, setRazorpaySdkReady] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!cart || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    if (location.state) {
      setOrderData(location.state);
    }
  }, [user, cart, navigate, location]);

  // Load Razorpay SDK
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        setRazorpaySdkReady(true);
      };
      document.body.appendChild(script);
    } else {
      setRazorpaySdkReady(true);
    }
  }, []);

  const formatPrice = (price) => {
    const currencySymbols = {
      INR: '₹', USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$', SGD: 'S$'
    };
    const rates = {
      INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, CAD: 0.016, AUD: 0.018, SGD: 0.016
    };
    const convertedPrice = Math.round(price * rates[currency]);
    return `${currencySymbols[currency]}${convertedPrice.toLocaleString()}`;
  };

  const handlePayment = async () => {
    if (!razorpaySdkReady) {
      alert("Payment gateway is still loading. Please wait a moment.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const orderRes = await axios.post('http://localhost:5000/api/razorpay/create-order');
      
      if (!orderRes.data || !orderRes.data.id) {
        throw new Error('Failed to create Razorpay order');
      }

      // 2. Open Razorpay Modal
      const options = {
        key: orderRes.data.key_id, 
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: 'RANGAARA',
        description: 'Payment for your Rangaara order',
        image: getImageUrl('logo.png'), 
        order_id: orderRes.data.id,
        handler: async function (response) {
          try {
            setLoading(true);
            const verifyRes = await axios.post('http://localhost:5000/api/razorpay/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: orderData?.shippingAddress || {}
            });
            
            if (verifyRes.data.message === 'Payment verified successfully') {
              loadCart();
              navigate('/orders', {
                state: {
                  orderId: verifyRes.data.order._id,
                  success: true
                }
              });
            }
          } catch (err) {
            console.error('Payment verification failed', err);
            alert('Payment verification failed. Please contact support if amount was deducted.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        theme: {
          color: '#5b1e23'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        console.error(response.error);
        alert('Payment Failed: ' + response.error.description);
      });
      rzp.open();
      
    } catch (err) {
      console.error('Razorpay Error:', err);
      alert('Could not initialize Razorpay checkout. Please try again.');
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
          <h1>Secure Checkout</h1>
          <p>Complete your purchase securely</p>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            <div className="razorpay-info" style={{ marginTop: 0, marginBottom: '30px' }}>
              <div className="info-box">
                <i className="fa-solid fa-shield-halved"></i>
                <div>
                  <h4>Secure Payment by Razorpay</h4>
                  <p>Pay securely via UPI, Credit/Debit Card, or Net Banking on the next step.</p>
                </div>
              </div>
            </div>

            <div className="payment-actions" style={{ borderTop: 'none', paddingTop: 0 }}>
              <button
                className="back-btn"
                onClick={() => navigate('/checkout')}
                disabled={loading}
              >
                <i className="fa-solid fa-arrow-left"></i>
                Back to Shipping
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
                    src={getImageUrl(item.product?.images?.[0])}
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
