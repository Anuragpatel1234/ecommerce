import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS, getImageUrl } from '../../config/api';
import Breadcrumbs from '../../components/Admin/Breadcrumbs';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchProducts();
  }, [page, search, category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { search }),
        ...(category && { category })
      });

      const res = await axios.get(`${API_ENDPOINTS.ADMIN.PRODUCTS}?${params}`);
      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.response?.data?.message || 'Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await axios.delete(API_ENDPOINTS.ADMIN.PRODUCT_BY_ID(id));
      setSuccess('Product deleted successfully!');
      fetchProducts();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting product:', error);
      setError(error.response?.data?.message || 'Failed to delete product. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const formatPrice = (price) => {
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div className="admin-products">
      <Breadcrumbs items={[{ label: 'Products' }]} />

      <div className="products-header">
        <div>
          <h1>Products</h1>
          <p>Manage your product catalog - Add, edit, or remove products</p>
        </div>
        <Link to="/admin/products/new" className="btn-primary">
          <i className="fa-solid fa-plus"></i>
          Add New Product
        </Link>
      </div>

      {(error || success) && (
        <div className={`admin-message ${error ? 'admin-error-message' : 'admin-success-message'}`}>
          <i className={`fa-solid fa-${error ? 'exclamation-circle' : 'check-circle'}`}></i>
          {error || success}
        </div>
      )}

      <div className="products-filters">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="search-input"
        />
        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
          className="filter-select"
        >
          <option value="">All Categories</option>
          <option value="LEHENGAS">LEHENGAS</option>
          <option value="BLOUSES">BLOUSES</option>
          <option value="DUPATTA">DUPATTA</option>
          <option value="SKIRTS">SKIRTS</option>
          <option value="TRADITIONAL OUTFIT">TRADITIONAL OUTFIT</option>
          <option value="KIDS OUTFITS">KIDS OUTFITS</option>
        </select>
      </div>

      {loading ? (
        <div className="admin-loading">
          <div className="admin-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          <div className="products-table-container">
            <table className="products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={getImageUrl(product.images?.[0])}
                          alt={product.name}
                          className="product-thumb"
                        />
                      </td>
                      <td>
                        <div className="product-name-cell">
                          <strong>{product.name}</strong>
                        </div>
                      </td>
                      <td>{product.category}</td>
                      <td>{formatPrice(product.price)}</td>
                      <td>
                        {product.sizes?.reduce((sum, size) => sum + (size.stock || 0), 0) || 0}
                      </td>
                      <td>
                        <span className={`status-badge ${product.inStock ? 'status-active' : 'status-inactive'}`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link
                            to={`/admin/products/${product._id}/edit`}
                            className="btn-edit"
                          >
                            <i className="fa-solid fa-edit"></i>
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="btn-delete"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="pagination-btn"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Products;

