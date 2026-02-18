import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (category) params.category = category;
        if (search) params.search = search;
        if (sort) params.sort = sort;
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (minRating) params.minRating = minRating;

        const data = await productsAPI.getAll(params);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category, search, sort, minPrice, maxPrice, minRating]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports', 'Other'];

  return (
    <div className="products-page">
      <div className="products-container">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filter-header">
            <span>Filters</span>
            {(category || minPrice || maxPrice || minRating) && (
              <button
                className="clear-filters-btn"
                onClick={() => setSearchParams(search ? { search } : {})}
              >
                CLEAR ALL
              </button>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-title">CATEGORIES</div>
            <div className="filter-content">
              <div
                className={`category-item ${!category ? 'active' : ''}`}
                onClick={() => handleFilterChange('category', '')}
              >
                Please select
              </div>
              {categories.map(cat => (
                <div
                  key={cat}
                  className={`category-item ${category === cat ? 'active' : ''}`}
                  onClick={() => handleFilterChange('category', cat)}
                >
                  {cat}
                </div>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-title">PRICE</div>
            <div className="price-inputs">
              <select
                value={minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="price-select"
              >
                <option value="">Min</option>
                <option value="500">₹500</option>
                <option value="1000">₹1000</option>
                <option value="2000">₹2000</option>
              </select>
              <span className="to-text">to</span>
              <select
                value={maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="price-select"
              >
                <option value="">Max</option>
                <option value="500">₹500</option>
                <option value="1000">₹1000</option>
                <option value="2000">₹2000</option>
                <option value="5000">₹5000+</option>
              </select>
            </div>
          </div>

          <div className="filter-section">
            <div className="filter-title">CUSTOMER RATINGS</div>
            <div className="filter-content">
              {[4, 3, 2].map(rating => (
                <label key={rating} className="checkbox-filter">
                  <input
                    type="checkbox"
                    checked={minRating === rating.toString()}
                    onChange={() => handleFilterChange('minRating', minRating === rating.toString() ? '' : rating.toString())}
                  />
                  <span className="rating-label">{rating}★ & above</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="products-main">
          <div className="products-header-bar">
            <span className="breadcrumb-text">Home {'>'} Products {category && `> ${category}`}</span>
            <div className="sort-section">
              <span className="sort-label">Sort By</span>
              <button className={`sort-tab ${!sort ? 'active' : ''}`} onClick={() => handleFilterChange('sort', '')}>Popularity</button>
              <button className={`sort-tab ${sort === 'price-low' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'price-low')}>Price -- Low to High</button>
              <button className={`sort-tab ${sort === 'price-high' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'price-high')}>Price -- High to Low</button>
              <button className={`sort-tab ${sort === 'rating' ? 'active' : ''}`} onClick={() => handleFilterChange('sort', 'rating')}>Newest First</button>
            </div>
          </div>

          <div className="products-grid-wrapper">
            {loading ? (
              <div className="loading-state">Loading products...</div>
            ) : products.length === 0 ? (
              <div className="no-products">
                <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="No Result" className="no-result-img" />
                <h3>Sorry, no results found!</h3>
                <p>Please check the spelling or try searching for something else</p>
              </div>
            ) : (
              <div className="products-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
