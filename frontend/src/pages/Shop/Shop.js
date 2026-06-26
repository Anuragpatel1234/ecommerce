import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    priceRange: '',
    sortBy: 'newest'
  });
  const [searchParams] = useSearchParams();

  const categories = [
    'LEHENGAS',
    'BLOUSES', 
    'DUPATTA',
    'SKIRTS',
    'TRADITIONAL OUTFIT',
    'KIDS OUTFITS'
  ];

  const priceRanges = [
    { label: 'Under ₹1,000', value: '0-1000' },
    { label: '₹1,000 - ₹2,500', value: '1000-2500' },
    { label: '₹2,500 - ₹5,000', value: '2500-5000' },
    { label: 'Above ₹5,000', value: '5000-999999' }
  ];

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      
      // Try to fetch from backend API first
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        let fetchedProducts = response.data.products || response.data || [];
        
        // Handle search query
        const search = searchParams.get('search');
        if (search) {
          fetchedProducts = fetchedProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        // Handle filters from URL params
        const filter = searchParams.get('filter');
        if (filter) {
          switch (filter) {
            case 'newArrival':
              fetchedProducts = fetchedProducts.filter(p => p.newArrival);
              break;
            case 'bestseller':
              fetchedProducts = fetchedProducts.filter(p => p.bestseller);
              break;
            case 'onSale':
              fetchedProducts = fetchedProducts.filter(p => p.onSale);
              break;
            case 'featured':
              fetchedProducts = fetchedProducts.filter(p => p.featured);
              break;
            default:
              // No filter applied
              break;
          }
        }
        
        // Apply category filter
        if (filters.category) {
          fetchedProducts = fetchedProducts.filter(product => 
            product.category.toUpperCase() === filters.category.toUpperCase()
          );
        }
        
        // Apply client-side filtering for price range
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          fetchedProducts = fetchedProducts.filter(product => 
            product.price >= min && product.price <= max
          );
        }
        
        // Apply sorting
        if (filters.sortBy === 'priceLow') {
          fetchedProducts.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'priceHigh') {
          fetchedProducts.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === 'name') {
          fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setProducts(fetchedProducts);
      } catch (apiError) {
        console.error('Error fetching from API, using sample data:', apiError);
        // Fallback to sample data if API fails
        const { sampleProducts, getFeaturedProducts, getBestsellerProducts, getNewArrivalProducts, getOnSaleProducts } = await import('../../data/sampleProducts');
        
        let fetchedProducts = [...sampleProducts];
        
        const search = searchParams.get('search');
        if (search) {
          fetchedProducts = fetchedProducts.filter(product =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
          );
        }
        
        const filter = searchParams.get('filter');
        if (filter) {
          switch (filter) {
            case 'newArrival':
              fetchedProducts = getNewArrivalProducts();
              break;
            case 'bestseller':
              fetchedProducts = getBestsellerProducts();
              break;
            case 'onSale':
              fetchedProducts = getOnSaleProducts();
              break;
            case 'featured':
              fetchedProducts = getFeaturedProducts();
              break;
            default:
              // No filter applied
              break;
          }
        }
        
        if (filters.category) {
          fetchedProducts = fetchedProducts.filter(product => 
            product.category.toUpperCase() === filters.category.toUpperCase()
          );
        }
        
        if (filters.priceRange) {
          const [min, max] = filters.priceRange.split('-').map(Number);
          fetchedProducts = fetchedProducts.filter(product => 
            product.price >= min && product.price <= max
          );
        }
        
        if (filters.sortBy === 'priceLow') {
          fetchedProducts.sort((a, b) => a.price - b.price);
        } else if (filters.sortBy === 'priceHigh') {
          fetchedProducts.sort((a, b) => b.price - a.price);
        } else if (filters.sortBy === 'name') {
          fetchedProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        
        setProducts(fetchedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      priceRange: '',
      sortBy: 'newest'
    });
  };

  return (
    <div className="shop-page">
      <div className="shop-header">
        <h1 className="common-heading center">Shop Collection</h1>
        <p className="common-para center">Discover our latest fashion pieces</p>
      </div>

      <div className="shop-container">
        <aside className="shop-filters">
          <div className="filter-section">
            <h3>Categories</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="category"
                  value=""
                  checked={filters.category === ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                />
                All Categories
              </label>
              {categories.map(category => (
                <label key={category} className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={filters.category === category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Price Range</h3>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="priceRange"
                  value=""
                  checked={filters.priceRange === ''}
                  onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                />
                All Prices
              </label>
              {priceRanges.map(range => (
                <label key={range.value} className="filter-option">
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.value}
                    checked={filters.priceRange === range.value}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  />
                  {range.label}
                </label>
              ))}
            </div>
          </div>

          <button className="clear-filters-btn" onClick={clearFilters}>
            Clear All Filters
          </button>
        </aside>

        <main className="shop-content">
          <div className="shop-controls">
            <div className="results-count">
              {loading ? 'Loading...' : `${products.length} products found`}
            </div>
            <div className="sort-controls">
              <label htmlFor="sortBy">Sort by:</label>
              <select
                id="sortBy"
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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
              <p>Loading products...</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.length > 0 ? (
                products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="no-products">
                  <h3>No products found</h3>
                  <p>Try adjusting your filters or search terms</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Shop;