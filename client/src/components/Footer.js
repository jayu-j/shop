import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer-container">
            <div className="footer-content">
                <div className="footer-section about">
                    <h3 className="footer-logo">ShopHub</h3>
                    <p>
                        Your one-stop destination for premium products. We bring you the best
                        quality items at the most affordable prices.
                    </p>
                    <div className="social-links">
                        <a href="#" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                        <a href="#" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                    </div>
                </div>

                <div className="footer-section links">
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/products">Shop All</Link></li>
                        <li><Link to="/cart">My Cart</Link></li>
                        <li><Link to="/profile">My Account</Link></li>
                    </ul>
                </div>

                <div className="footer-section support">
                    <h4>Support</h4>
                    <ul>
                        <li><Link to="/orders">Track Order</Link></li>
                        <li><a href="#">FAQ</a></li>
                        <li><a href="#">Shipping Policy</a></li>
                        <li><a href="#">Returns & Refunds</a></li>
                    </ul>
                </div>

                <div className="footer-section contact">
                    <h4>Contact Us</h4>
                    <p><i className="fas fa-map-marker-alt"></i> 123 Commerce St, India</p>
                    <p><i className="fas fa-phone"></i> +91 98765 43210</p>
                    <p><i className="fas fa-envelope"></i> support@shophub.com</p>

                    <div className="newsletter">
                        <input type="email" placeholder="Enter your email" />
                        <button>Subscribe</button>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
