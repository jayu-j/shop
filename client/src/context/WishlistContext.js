import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { user, isAuthenticated } = useAuth();
    const { success, error } = useToast();

    useEffect(() => {
        if (isAuthenticated && user?.wishlist) {
            setWishlist(user.wishlist);
        } else {
            setWishlist([]);
        }
    }, [isAuthenticated, user]);

    const addToWishlist = async (product) => {
        if (!isAuthenticated) {
            error('Please login to add items to wishlist');
            return;
        }

        try {
            const updatedWishlist = await authAPI.addToWishlist(product._id);
            setWishlist(updatedWishlist);
            success('Added to wishlist');
        } catch (err) {
            error(err.message || 'Failed to add to wishlist');
        }
    };

    const removeFromWishlist = async (productId) => {
        if (!isAuthenticated) return;

        try {
            const updatedWishlist = await authAPI.removeFromWishlist(productId);
            setWishlist(updatedWishlist);
            success('Removed from wishlist');
        } catch (err) {
            error(err.message || 'Failed to remove from wishlist');
        }
    };

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    return (
        <WishlistContext.Provider
            value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}
        >
            {children}
        </WishlistContext.Provider>
    );
};
