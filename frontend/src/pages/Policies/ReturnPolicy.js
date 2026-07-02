import React, { useEffect } from 'react';
import './Policies.css';

const ReturnPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <h1>Return Policy</h1>
      <div className="policy-content">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Returns</h2>
        <p>
          We stand behind the quality of our handcrafted apparel. If you are not completely satisfied with your purchase, you may return the item(s) within <strong>14 days</strong> of receiving your order for an exchange or store credit.
        </p>
        <p>
          To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it. It must also be in the original packaging with all tags attached.
        </p>

        <h2>2. Non-Returnable Items</h2>
        <p>Several types of goods are exempt from being returned:</p>
        <ul>
          <li>Custom-made or made-to-measure outfits.</li>
          <li>Items purchased during a sale or with promotional discounts.</li>
          <li>Intimates, swimwear, and accessories for hygiene reasons.</li>
        </ul>

        <h2>3. Return Process</h2>
        <p>To initiate a return, please follow these steps:</p>
        <ol>
          <li>Contact our customer support at <strong>support@rangaara.com</strong> with your order number and reason for return.</li>
          <li>Wait for our team to approve your return request and provide a Return Merchandise Authorization (RMA) number.</li>
          <li>Pack the item securely and ship it back to us. You are responsible for paying the shipping costs for your return.</li>
        </ol>

        <h2>4. Exchanges</h2>
        <p>
          We only replace items if they are defective or damaged upon arrival, or if you require a different size of the exact same item. Please notify us within 48 hours of delivery if an item is defective.
        </p>

        <h2>5. Shipping Returns</h2>
        <p>
          To return your product, you should mail your product to: [Your Business Address].
          <br /><br />
          We highly recommend using a trackable shipping service or purchasing shipping insurance. We do not guarantee that we will receive your returned item.
        </p>
      </div>
    </div>
  );
};

export default ReturnPolicy;
