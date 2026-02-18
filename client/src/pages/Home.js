import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ProductRecommendations from '../components/ProductRecommendations';
import HeroSlider from '../components/HeroSlider';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await productsAPI.getAll({ sort: 'rating' });
        setFeaturedProducts(products.slice(0, 8)); // Show more products in grid
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home-page">
      <div className="container">
        <HeroSlider />

        <section className="home-section animate-fade-in stagger-1">
          <div className="section-header">
            <h2 className="section-title">New Arrivals</h2>
            <Link to="/products?sort=newest" className="view-all-btn">
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>
          </div>

          {loading ? (
            <div className="loading">Loading amazing products...</div>
          ) : (
            <div className="product-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* AI-Powered Recommendations */}
        <section className="recommendations-section animate-slide-up stagger-2">
          {isAuthenticated ? (
            <ProductRecommendations
              type="personalized"
              title="Picked For You"
              limit={4}
            />
          ) : (
            <ProductRecommendations
              type="for-you"
              title="Popular Right Now"
              limit={4}
            />
          )}
        </section>

        <section className="home-section animate-slide-up stagger-3" style={{ marginTop: '48px' }}>
          <ProductRecommendations
            type="trending"
            title="Trending Collections"
            limit={4}
          />
        </section>
      </div>
    </div>
  );
};

export default Home;
