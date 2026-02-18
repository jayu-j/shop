import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recommendationsAPI } from '../services/api';
import ProductCard from './ProductCard';
import './ProductRecommendations.css';

const ProductRecommendations = ({ 
  type = 'for-you', 
  productId = null, 
  title = 'Recommended for You',
  limit = 4 
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        
        switch (type) {
          case 'personalized':
            data = await recommendationsAPI.getPersonalized(limit);
            break;
          case 'similar':
            if (!productId) throw new Error('Product ID required for similar products');
            data = await recommendationsAPI.getSimilar(productId, limit);
            break;
          case 'frequently-bought':
            if (!productId) throw new Error('Product ID required');
            data = await recommendationsAPI.getFrequentlyBought(productId, limit);
            break;
          case 'trending':
            data = await recommendationsAPI.getTrending(limit);
            break;
          case 'for-you':
          default:
            data = await recommendationsAPI.getForYou(limit);
            break;
        }
        
        setProducts(data.products || []);
      } catch (err) {
        console.error('Failed to fetch recommendations:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [type, productId, limit]);

  if (loading) {
    return (
      <div className="recommendations-section">
        <h2 className="recommendations-title">{title}</h2>
        <div className="recommendations-loading">
          <div className="loading-spinner"></div>
          <p>Finding the best products for you...</p>
        </div>
      </div>
    );
  }

  if (error || products.length === 0) {
    return null; // Don't show section if no recommendations
  }

  return (
    <section className="recommendations-section">
      <div className="recommendations-header">
        <h2 className="recommendations-title">
          <span className="ai-badge">✨ AI</span>
          {title}
        </h2>
        {type === 'trending' && (
          <span className="trending-badge">🔥 Hot Right Now</span>
        )}
      </div>
      
      <div className="recommendations-grid">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} compact />
        ))}
      </div>
      
      <div className="recommendations-footer">
        <Link to="/products" className="view-all-link">
          View All Products →
        </Link>
      </div>
    </section>
  );
};

export default ProductRecommendations;
