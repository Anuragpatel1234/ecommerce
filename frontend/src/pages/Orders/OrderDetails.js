import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApp } from '../../context/SafeAppContext';
import { getImageUrl } from '../../config/api';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const { user, currency } = useApp();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllUpdates, setShowAllUpdates] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [user, id, navigate]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:5000/api/orders/${id}`);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const currencySymbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£', CAD: 'C$', AUD: 'A$', SGD: 'S$' };
    const rates = { INR: 1, USD: 0.012, EUR: 0.011, GBP: 0.0095, CAD: 0.016, AUD: 0.018, SGD: 0.016 };
    const convertedPrice = Math.round(price * rates[currency]);
    return `${currencySymbols[currency]}${convertedPrice.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="orders-loading" style={{ minHeight: '60vh' }}>
        <div className="spinner"></div>
        <p>Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="orders-empty" style={{ margin: '40px auto', maxWidth: '800px' }}>
        <h2>Order Not Found</h2>
        <p>We couldn't find the details for this order.</p>
        <button onClick={() => navigate('/orders')} className="shop-btn">Back to Orders</button>
      </div>
    );
  }

  const isDelivered = order.orderStatus === 'delivered';
  const isCancelled = order.orderStatus === 'cancelled';
  const paymentMethodLabel = order.paymentMethod === 'cod' ? 'Cash On Delivery' : 
                             order.paymentMethod === 'razorpay' ? 'Razorpay' : 
                             order.paymentMethod === 'paypal' ? 'PayPal' : 'Card';

  const handleDownloadInvoice = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice - ${order.orderNumber}</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 40px; color: #333; }
            .header { display: flex; justify-content: space-between; border-bottom: 2px solid #eee; padding-bottom: 20px; }
            .brand { font-size: 24px; font-weight: bold; color: #4e322d; }
            .details { margin-top: 40px; display: flex; justify-content: space-between; }
            table { width: 100%; border-collapse: collapse; margin-top: 40px; }
            th, td { padding: 12px; text-align: left; border-bottom: 1px solid #eee; }
            th { background-color: #f9f9f9; }
            .totals { margin-top: 20px; text-align: right; float: right; width: 300px; }
            .totals div { display: flex; justify-content: space-between; padding: 8px 0; }
            .total-final { font-weight: bold; font-size: 1.2em; border-top: 2px solid #eee; margin-top: 8px; padding-top: 12px !important; }
            @media print { body { padding: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="brand" style="display: flex; align-items: center;">
              <img src="${window.location.origin}/img/RANGAARA-navbar-logo.png" alt="RANGAARA" style="height: 120px; object-fit: contain;" />
            </div>
            <div style="text-align: right;">
              <h2>INVOICE</h2>
              <strong>Order #:</strong> ${order.orderNumber}<br>
              <strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div class="details">
            <div>
              <strong>Billed To:</strong><br>
              ${order.shippingAddress?.firstName} ${order.shippingAddress?.lastName}<br>
              ${order.shippingAddress?.street}, ${order.shippingAddress?.city}<br>
              ${order.shippingAddress?.state}, ${order.shippingAddress?.zipCode}<br>
              ${order.shippingAddress?.country}<br>
              Phone: ${order.shippingAddress?.phone}
            </div>
            <div>
              <strong>Payment Method:</strong><br>
              ${paymentMethodLabel}
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${order.items.map(item => `
                <tr>
                  <td>
                    ${item.product?.name}
                    ${item.color ? `<br><small>Color: ${item.color}</small>` : ''}
                    ${item.size ? `<br><small>Size: ${item.size}</small>` : ''}
                  </td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.price)}</td>
                  <td style="text-align: right;">${formatPrice(item.price * item.quantity)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="totals">
            <div><span>Subtotal:</span> <span>${formatPrice(order.subtotal)}</span></div>
            <div><span>Shipping:</span> <span>${order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span></div>
            <div><span>Tax (18% GST):</span> <span>${formatPrice(order.tax)}</span></div>
            <div class="total-final"><span>Total Amount:</span> <span>${formatPrice(order.total)}</span></div>
          </div>
          <div style="clear: both; margin-top: 60px; text-align: center; color: #888; font-size: 14px;">
            Thank you for shopping with Rangaara!
          </div>
          <script>
            window.onload = () => {
              window.print();
              setTimeout(() => window.close(), 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="order-details-page">
      <div className="order-details-left">
        <div style={{ background: '#fff', padding: '15px 24px', border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '20px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '14px', color: '#212121' }}><strong>Order ID:</strong> {order.orderNumber}</div>
          <div style={{ fontSize: '14px', color: '#878787' }}>Placed on {formatDate(order.createdAt)}</div>
        </div>
        {order.items.map((item, index) => (
          <div key={index} className="order-item-detail-card">
            <div className="order-item-header">
              <div className="order-item-info">
                <h3>{item.product?.name || 'Product'}</h3>
                <div className="order-item-variants">
                  {item.color && <span>{item.color} </span>}
                  {item.size && <span>({item.size})</span>}
                </div>
                <div className="order-item-seller">Seller: Rangaara</div>
                <div className="order-item-price">{formatPrice(item.price)}</div>
              </div>
              <img 
                src={getImageUrl(item.product?.images?.[0])} 
                alt={item.product?.name} 
                className="order-item-image"
              />
            </div>
            
            <div className="order-tracking-container">
              <div className="tracking-step">
                <div className="step-icon"><i className="fa-solid fa-check"></i></div>
                <div className="step-content">Order Confirmed, {formatDate(order.createdAt)}</div>
              </div>
              
              {!isCancelled && (
                <>
                  {showAllUpdates && (
                    <>
                      <div className={`tracking-step ${order.orderStatus === 'pending' ? 'inactive' : ''}`}>
                        <div className={`step-icon ${order.orderStatus === 'pending' ? 'inactive' : ''}`}>
                          {order.orderStatus !== 'pending' && <i className="fa-solid fa-check"></i>}
                        </div>
                        <div className={`step-content ${order.orderStatus === 'pending' ? 'inactive' : ''}`}>
                          Processing, {formatDate(order.createdAt)}
                        </div>
                      </div>
                      <div className={`tracking-step ${['pending', 'confirmed', 'processing'].includes(order.orderStatus) ? 'inactive' : ''}`}>
                        <div className={`step-icon ${['pending', 'confirmed', 'processing'].includes(order.orderStatus) ? 'inactive' : ''}`}>
                          {['shipped', 'delivered'].includes(order.orderStatus) && <i className="fa-solid fa-check"></i>}
                        </div>
                        <div className={`step-content ${['pending', 'confirmed', 'processing'].includes(order.orderStatus) ? 'inactive' : ''}`}>
                          Shipped, {formatDate(order.updatedAt || order.createdAt)}
                        </div>
                      </div>
                    </>
                  )}
                  <div className={`tracking-step ${!isDelivered ? 'inactive' : ''}`}>
                    <div className={`step-icon ${!isDelivered ? 'inactive' : ''}`}>
                      {isDelivered && <i className="fa-solid fa-check"></i>}
                    </div>
                    <div className={`step-content ${!isDelivered ? 'inactive' : ''}`}>
                      {isDelivered ? `Delivered, ${formatDate(order.updatedAt || order.createdAt)}` : 'Expected Delivery'}
                    </div>
                  </div>
                </>
              )}

              {isCancelled && (
                <div className="tracking-step">
                  <div className="step-icon" style={{ backgroundColor: '#ff6161' }}><i className="fa-solid fa-xmark"></i></div>
                  <div className="step-content">Cancelled, {formatDate(order.updatedAt || order.createdAt)}</div>
                </div>
              )}

              {!isCancelled && (
                <div 
                  className="see-updates-link" 
                  onClick={() => setShowAllUpdates(!showAllUpdates)}
                >
                  {showAllUpdates ? 'Hide Updates' : 'See All Updates >'}
                </div>
              )}
            </div>

            <div className="return-policy-info">
              Return policy ended
            </div>

            <div className="chat-with-us">
              <i className="fa-regular fa-comment-dots"></i> Chat with us
            </div>
          </div>
        ))}
      </div>

      <div className="order-details-right">
        <div className="sidebar-card">
          <div className="address-row">
            <i className="fa-solid fa-location-dot"></i>
            <div className="address-details">
              <strong>Delivery Address</strong>
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.zipCode}
            </div>
          </div>
          <div className="address-row" style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #f0f0f0' }}>
            <i className="fa-regular fa-user"></i>
            <div className="address-details">
              <strong>{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</strong>
              {order.shippingAddress?.phone}
            </div>
          </div>
        </div>

        <div className="sidebar-card">
          <div className="price-breakdown-row">
            <span>Listing price</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="price-breakdown-row">
            <span>Shipping <i className="fa-regular fa-circle-info" style={{fontSize: '12px', color: '#878787', marginLeft: '4px'}}></i></span>
            <span>{order.shipping === 0 ? 'Free' : formatPrice(order.shipping)}</span>
          </div>
          <div className="price-breakdown-row">
            <span>Tax (18% GST)</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="price-breakdown-row total">
            <span>Total amount</span>
            <span>{formatPrice(order.total)}</span>
          </div>

          <div className="paid-by-box">
            <span>Paid By</span>
            <span style={{ fontWeight: 500 }}>
              <i className={order.paymentMethod === 'cod' ? 'fa-solid fa-money-bill' : 'fa-solid fa-credit-card'} style={{ marginRight: '6px' }}></i> 
              {paymentMethodLabel}
            </span>
          </div>

          <button className="download-invoice-btn" onClick={handleDownloadInvoice}>
            <i className="fa-solid fa-download"></i> Download Invoice
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
