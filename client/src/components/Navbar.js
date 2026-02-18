import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setIsMobileMenuOpen(false)}>
          ShopHub<span className="logo-dot"></span>
        </Link>

        {/* Search Bar */}
        <div className="navbar-search">
          <button className="search-icon-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
          <input
            type="text"
            placeholder="Search for products..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                navigate(`/products?search=${e.target.value}`);
                setIsMobileMenuOpen(false);
              }
            }}
          />
        </div>

        {/* Desktop Menu */}
        <div className={`navbar-content ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="navbar-menu">

            {isAuthenticated ? (
              <li>
                <Link to="/profile" className="user-name-link">
                  Hello, {user?.name.split(' ')[0]}
                </Link>
              </li>
            ) : (
              <li>
                <Link to="/login" className="login-btn-header" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
            )}

            <li>
              <Link to="/cart" className="cart-link" onClick={() => setIsMobileMenuOpen(false)}>
                <span>Cart</span>
                <div className="cart-relative">
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Toggle */}
        <button
          className={`navbar-toggle ${isMobileMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>
    </nav >
  );
};

export default Navbar;
