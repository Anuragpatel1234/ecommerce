import React, { useEffect } from 'react';
import './Policies.css';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <h1>Privacy Policy</h1>
      <div className="policy-content">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Information We Collect</h2>
        <p>
          At RANGAARA, we collect various types of information in connection with the services we provide, including:
        </p>
        <ul>
          <li><strong>Personal Information:</strong> Name, email address, postal address, phone number, and payment information when you make a purchase.</li>
          <li><strong>Account Information:</strong> Username, password, and order history if you create an account with us.</li>
          <li><strong>Device Information:</strong> IP address, browser type, device identifiers, and browsing behavior on our website.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and fulfill your orders, including sending you emails to confirm your order status and shipment.</li>
          <li>Communicate with you about products, services, offers, and promotions.</li>
          <li>Improve and optimize our website functionality and customer experience.</li>
          <li>Protect against fraudulent transactions and ensure the security of our platform.</li>
        </ul>

        <h2>3. Sharing Your Information</h2>
        <p>
          We do not sell or rent your personal information to third parties. We only share your information with trusted service providers who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. 
        </p>

        <h2>4. Data Security</h2>
        <p>
          We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information. All sensitive/credit information you supply is transmitted via Secure Socket Layer (SSL) technology and then encrypted into our Payment gateway providers database.
        </p>

        <h2>5. Your Rights</h2>
        <p>
          Depending on your location, you may have the right to access, correct, or delete the personal information we hold about you. If you wish to exercise these rights, please contact us at <strong>privacy@rangaara.com</strong>.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
