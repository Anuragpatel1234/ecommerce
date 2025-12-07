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

const Home = () => {
  return (
    <>
      <HeroSection />
      <ShopCategories />
      <ProductSection />
      <HandcraftSection />
      <ShopSection />
      <FeaturedCollection />
      <Marquee />
      <ScrollingEffect />
      <TestimonialSection />
    </>
  );
};

export default Home;