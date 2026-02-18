import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI, recommendationsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductRecommendations from '../components/ProductRecommendations';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await productsAPI.getById(id);
        setProduct(data);
        if (isAuthenticated) {
          try {
            await recommendationsAPI.trackActivity(id, 'view');
          } catch (err) { }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isAuthenticated]);

  const handleAddToCart = async () => {
    await addToCart(product, 1);
    navigate('/cart');
  };

  const handleBuyNow = async () => {
    await addToCart(product, 1);
    navigate('/checkout');
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!product) return <div className="error-message">Product not found</div>;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        {/* Left Column */}
        <div className="product-left-col">
          <div className="product-image-section">
            <img
              src={product.image || 'https://via.placeholder.com/600?text=No+Image'}
              alt={product.name}
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/600?text=No+Image'; }}
            />
          </div>
          <div className="action-buttons">
            <button className="btn-cart" onClick={handleAddToCart}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              Add to Cart
            </button>
            <button className="btn-buy" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="product-right-col">
          <div className="breadcrumb">Home / {product.category} / {product.name}</div>

          <h1 className="product-title">{product.name}</h1>

          <div className="rating-row">
            <div className="rating-pill">
              {product.rating || 4.2}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="star-icon"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
            </div>
            <span className="rating-count">{product.numReviews} Reviews</span>
          </div>

          <div className="price-block">
            <span className="price-main">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="price-original">₹{(product.price * 1.2).toFixed(0)}</span>
            <span className="price-discount">20% OFF</span>
          </div>

          <div className="features-section">
            <h3>Product Details</h3>
            <div className="features-list">
              <div className="feature-item">
                <span className="feature-label">Description</span>
                <span className="feature-value">{product.description}</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Category</span>
                <span className="feature-value">{product.category}</span>
              </div>
              <div className="feature-item">
                <span className="feature-label">Stock</span>
                <span className="feature-value">{product.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
              </div>
            </div>
          </div>

          <div className="offers-section">
            <div className="offers-title">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
              Available Offers
            </div>
            <ul className="offers-list">
              <li>Bank Offer 5% Unlimited Cashback on Axis Bank Credit Card</li>
              <li>Special Price Get extra ₹3000 off (price inclusive of discount)</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '64px' }}>
        <ProductRecommendations
          type="similar"
          productId={id}
          title="You Might Also Like"
          limit={4}
        />
      </div>
    </div>
  );
};

export default ProductDetail;
