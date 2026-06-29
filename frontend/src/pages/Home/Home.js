import React from 'react';
import HeroSection from '../../components/HeroSection/HeroSection';
import ShopCategories from '../../components/ShopCategories/ShopCategories';
import ProductSection from '../../components/ProductSection/ProductSection';
import HandcraftSection from '../../components/HandcraftSection/HandcraftSection';
import ShopSection from '../../components/ShopSection/ShopSection';
import FeaturedCollection from '../../components/FeaturedCollection/FeaturedCollection';
import Marquee from '../../components/Marquee/Marquee';
import ScrollingEffect from '../../components/ScrollingEffect/ScrollingEffect';
import TestimonialSection from '../../components/TestimonialSection/TestimonialSection';

import './Home.css';

const Home = () => {
  return (
    <div className="home-page-container">
      {/* 1. Hero Banner */}
      <HeroSection />
      
      {/* 2. Featured Categories */}
      <ShopCategories />
      
      {/* 3. Best Sellers */}
      <ProductSection />
      
      {/* 4. Brand Story (Indian Craftsmanship) */}
      <HandcraftSection />
      
      {/* 5. New Arrivals */}
      <ShopSection />
      
      {/* 6. Featured Collection */}
      <FeaturedCollection />
      
      {/* Luxury Divider / Discount Banner */}
      <Marquee />
      
      {/* Luxury Scroll Effect Divider */}
      <ScrollingEffect />
      
      {/* 7. Testimonials */}
      <TestimonialSection />
    </div>
  );
};

export default Home;