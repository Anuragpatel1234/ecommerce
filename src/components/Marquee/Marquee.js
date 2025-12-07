import React from 'react';
import './Marquee.css';

const Marquee = () => {
  const marqueeItems = [
    'BUY 2 AND GET 10% OFF',
    'BUY 3 AND GET 15% OFF',
    'BUY 2 AND GET 10% OFF',
    'BUY 3 AND GET 15% OFF',
    'BUY 2 AND GET 10% OFF',
    'BUY 3 AND GET 15% OFF',
    'BUY 2 AND GET 10% OFF',
    'BUY 3 AND GET 15% OFF'
  ];

  return (
    <div className="marquee">
      {marqueeItems.map((item, index) => (
        <div key={index} className="marquee__item">
          {item}
        </div>
      ))}
    </div>
  );
};

export default Marquee;