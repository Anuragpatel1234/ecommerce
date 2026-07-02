import React, { useEffect } from 'react';
import './Policies.css';

const Disclaimer = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="policy-page">
      <h1>Disclaimer</h1>
      <div className="policy-content">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2>1. Handcrafted Variations</h2>
        <p>
          At RANGAARA, our garments are meticulously handcrafted by artisans. Due to the manual nature of weaving, dyeing, embroidery, and stitching, slight variations in color, texture, and embellishment placement may occur. These variations are not defects; rather, they are the hallmark of authentic handmade products and add to the unique charm of each piece.
        </p>

        <h2>2. Color Accuracy</h2>
        <p>
          We have made every effort to display the colors of our products as accurately as possible on the website. However, because the colors you see will depend on your monitor or device display, we cannot guarantee that your monitor's display of any color will be perfectly accurate.
        </p>

        <h2>3. Product Availability</h2>
        <p>
          All products are subject to availability. We reserve the right to limit the quantities of any products or services that we offer. All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time.
        </p>

        <h2>4. General Disclaimer</h2>
        <p>
          The information provided on this website is for general informational purposes only. While we endeavor to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose.
        </p>

        <h2>5. Limitation of Liability</h2>
        <p>
          In no event will RANGAARA be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.
        </p>
      </div>
    </div>
  );
};

export default Disclaimer;
