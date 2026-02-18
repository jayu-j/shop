import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './Wishlist.css';

const Wishlist = () => {
    const { wishlist } = useWishlist();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProducts = async () => {
            if (wishlist.length === 0) {
                setProducts([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                // Fetch details for each product in wishlist
                // This is not efficient for large wishlists, a bulk fetch endpoint would be better
                // But for now, we'll fetch individually or filter from all products if available
                // Let's assume we need to fetch all or fetch by IDs. 
                // Given current API, let's fetch individual items.
                const productPromises = wishlist.map(id => productsAPI.getById(id));
                const results = await Promise.all(productPromises);
                setProducts(results);
            } catch (error) {
                console.error('Failed to fetch wishlist products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProducts();
    }, [wishlist]);

    if (loading) return <div className="loading">Loading wishlist...</div>;

    return (
        <div className="wishlist-page">
            <h1>My Wishlist ({products.length})</h1>
            {products.length === 0 ? (
                <div className="empty-wishlist">
                    <p>Your wishlist is empty.</p>
                    <Link to="/products" className="continue-shopping">
                        Browse Products
                    </Link>
                </div>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Wishlist;
