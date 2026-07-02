import React, { useEffect } from 'react';
import './Policies.css';

const RefundPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <h1>Refund Policy</h1>
      <div className="policy-content">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Overview</h2>
        <p>
          At RANGAARA, we take pride in the craftsmanship of our products. Due to the exclusive and handcrafted nature of our apparel, we offer <strong>store credit or exchanges only</strong>. We do not issue cash refunds to original payment methods unless an item is proven to be defective upon arrival and a replacement cannot be provided.
        </p>

        <h2>2. Processing Refunds (Store Credit)</h2>
        <p>
          Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
        </p>
        <p>
          If you are approved, your refund will be processed in the form of a store credit voucher. This voucher will be emailed to you within 3-5 business days and will be valid for 6 months from the date of issue.
        </p>

        <h2>3. Defective Items</h2>
        <p>
          If you receive an item that is defective or severely damaged in transit, please contact us within 48 hours with photographic proof. Upon verification, if a replacement is unavailable, we will process a full cash refund to your original method of payment within 7-10 business days.
        </p>

        <h2>4. Late or Missing Refunds</h2>
        <p>
          If you were promised a cash refund for a defective item and haven't received it yet, first check your bank account again. Then contact your credit card company, it may take some time before your refund is officially posted.
          <br /><br />
          If you’ve done all of this and you still have not received your refund yet, please contact us at <strong>support@rangaara.com</strong>.
        </p>

        <h2>5. Cancellations</h2>
        <p>
          Orders can only be cancelled within 24 hours of placement for a full refund. After 24 hours, the order goes into processing/production and cannot be cancelled.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
