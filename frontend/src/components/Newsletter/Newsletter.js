import React, { useState } from 'react';
import { useApp } from '../../context/SafeAppContext';
import './Newsletter.css';

const Newsletter = () => {
  const { subscribeNewsletter } = useApp();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(''); // 'success' or 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setMessage('');
    setStatus('');

    try {
      const result = await subscribeNewsletter(email);
      if (result && result.success) {
        setStatus('success');
        setMessage(result.message || 'Thank you for subscribing to our updates!');
        setEmail('');
      } else {
        setStatus('error');
        setMessage(result.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Failed to connect to the server. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-box">
        <span className="newsletter-label">Private Invitations</span>
        <h2 className="newsletter-heading">THE RANGAARA JOURNAL</h2>
        <p className="newsletter-desc">
          Subscribe to receive early access to new collections, storytelling features about our artisans, and exclusive invitations to private sales.
        </p>
        
        <form onSubmit={handleSubmit} className="newsletter-form">
          <div className="newsletter-input-group">
            <input
              type="email"
              placeholder="ENTER YOUR EMAIL ADDRESS"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="newsletter-input"
            />
            <button 
              type="submit" 
              disabled={isLoading}
              className="newsletter-submit-btn"
            >
              {isLoading ? 'SUBSCRIBING...' : 'SUBSCRIBE'}
            </button>
          </div>
        </form>
        
        {message && (
          <p className={`newsletter-feedback ${status}`}>
            {message}
          </p>
        )}
      </div>
    </section>
  );
};

export default Newsletter;
