import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../ProductCard/ProductCard';
import './ProductSection.css';

const ProductSection = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products?bestseller=true&limit=4');
      const fetchedProducts = response.data.products || response.data || [];
      setProducts(fetchedProducts.slice(0, 4));
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to sample data
      const { getBestsellerProducts } = await import('../../data/sampleProducts');
      setProducts(getBestsellerProducts().slice(0, 4));
    }
  };

  return (
    <section className="product-section">
      <div className="product-section-heading">
        <h2 className="common-heading">Most Selling Products</h2>
        <Link to="/shop?filter=bestseller" className="view-text">Explore Collection</Link>
      </div>
      <div className="product-container">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductSection;