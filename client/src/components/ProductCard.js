import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Modal from './Modal';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { success, info } = useToast();
  const navigate = useNavigate();

  // Modal State
  const [showCartModal, setShowCartModal] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product);
    setShowCartModal(true);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      info('Removed from wishlist');
    } else {
      addToWishlist(product);
      success('Added to wishlist');
    }
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-container">
          <Link to={`/product/${product._id}`}>
            <img
              src={product.image || 'https://via.placeholder.com/300?text=No+Image'}
              alt={product.name}
              className="product-image"
              loading="lazy"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }}
            />
          </Link>
          <button
            className={`wishlist-btn ${isInWishlist(product._id) ? 'active' : ''}`}
            onClick={toggleWishlist}
            aria-label={isInWishlist(product._id) ? "Remove from wishlist" : "Add to wishlist"}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={isInWishlist(product._id) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>

        <div className="product-info">
          <Link to={`/product/${product._id}`} className="product-title-link">
            <h3 className="product-title">{product.name}</h3>
          </Link>

          <div className="product-rating">
            <span className="star-icon">★</span>
            <span>{product.rating || 4.2}</span>
            <span className="review-count">({product.numReviews})</span>
          </div>

          <div className="product-price-row">
            <div className="price-block">
              <span className="product-price">₹{product.price.toLocaleString('en-IN')}</span>
              <span className="original-price">₹{(product.price * 1.2).toFixed(0)}</span>
              <span className="discount-tag">20% off</span>
            </div>
            <button className="add-cart-btn" onClick={handleAddToCart} disabled={product.stock === 0}>
              {product.stock === 0 ? 'No Stock' : 'Add +'}
            </button>
          </div>
        </div>
      </div>

      {/* Add to Cart Modal */}
      <Modal
        isOpen={showCartModal}
        onClose={() => setShowCartModal(false)}
        title="Added to Cart"
      >
        <div className="cart-modal-content">
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{product.name}</h4>
              <p style={{ margin: 0, color: 'var(--primary)', fontWeight: '600' }}>₹{product.price.toLocaleString('en-IN')}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="secondary-btn"
              onClick={(e) => {
                e.preventDefault();
                setShowCartModal(false);
              }}
              style={{ flex: 1, justifyContent: 'center' }}
            >
              Continue Shopping
            </button>
            <button
              className="primary-btn"
              onClick={(e) => {
                e.preventDefault();
                navigate('/cart');
              }}
              style={{ flex: 1, justifyContent: 'center', background: 'var(--primary)', color: 'white' }}
            >
              Go to Cart
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};
export default ProductCard;
