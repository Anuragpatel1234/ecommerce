import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import './ShopSection.css';

const ShopSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?newArrival=true&limit=9');
      const fetchedProducts = response.data.products || response.data || [];
      // Prioritize sample data to ensure we have enough products
      const { getNewArrivalProducts } = await import('../../data/sampleProducts');
      const sampleProducts = getNewArrivalProducts();
      // Use sample data if API returns fewer products, or combine them
      if (fetchedProducts.length < 6) {
        setProducts(sampleProducts.slice(0, 9));
      } else {
        setProducts(fetchedProducts.slice(0, 9));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data
      const { getNewArrivalProducts } = await import('../../data/sampleProducts');
      setProducts(getNewArrivalProducts().slice(0, 9));
    }
  };

  return (
    <section className="shop-section">
      <h2 className="common-heading center">New Arrival</h2>
      <div className="shop-images-section">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
      <div className="shop-section-footer">
        <Link to="/shop?filter=newArrival" className="view-all-btn">
          Explore The Collection
        </Link>
      </div>
    </section>
  );
};

export default ShopSection;