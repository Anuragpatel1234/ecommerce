import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './CategoryPage.css';

const CategoryPage = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');

  const fetchCategoryProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from API first
      try {
        const response = await axios.get(`http://localhost:5000/api/products/category/${category}`);
        let fetchedProducts = response.data.products || response.data || [];
        
        // Apply sorting
        if (sortBy === 'priceLow') {
          fetchedProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'priceHigh') {
          fetchedProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
          fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setProducts(fetchedProducts);
      } catch (apiError) {
        console.error('Error fetching from API, using sample data:', apiError);
        // Fallback to sample data
        const { getProductsByCategory } = await import('../../data/sampleProducts');
        let fetchedProducts = getProductsByCategory(category);
        
        // Apply sorting
        if (sortBy === 'priceLow') {
          fetchedProducts.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'priceHigh') {
          fetchedProducts.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'name') {
          fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Error fetching category products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [category, sortBy]);

  useEffect(() => {
    fetchCategoryProducts();
  }, [fetchCategoryProducts]);

  const getCategoryImage = (categoryName) => {
    const categoryImages = {
      'LEHENGAS': 'img/Untitled-4.webp',
      'BLOUSES': 'img/0952.webp',
      'DUPATTA': 'img/dupatta1.webp',
      'SKIRTS': 'img/SKIRTS1.jpg',
      'TRADITIONAL OUTFIT': 'img/traditional outfit 2.webp',
      'KIDS OUTFITS': 'img/kids lehenga set.webp'
    };
    return categoryImages[categoryName] || 'img/placeholder.jpg';
  };

  return (
    <div className="category-page">
      <div className="category-hero">
        <div className="category-hero-image">
          <img src={getCategoryImage(category)} alt={category} />
          <div className="category-hero-overlay">
            <h1 className="category-title">{category}</h1>
            <p className="category-subtitle">Discover our exclusive {category.toLowerCase()} collection</p>
          </div>
        </div>
      </div>

      <div className="category-content">
        <div className="category-controls">
          <div className="results-info">
            <h2>
              {category} Collection
              {!loading && <span className="product-count">({products.length} items)</span>}
            </h2>
          </div>
          
          <div className="sort-controls">
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading {category.toLowerCase()}...</p>
          </div>
        ) : (
          <div className="products-grid">
            {products.length > 0 ? (
              products.map(product => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <div className="no-products">
                <h3>No products found in {category}</h3>
                <p>Check back soon for new arrivals!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;