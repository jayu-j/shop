import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const AdminRoute = () => {
    const { user, isAuthenticated, loading } = useAuth();
    const { error } = useToast();

    useEffect(() => {
        if (!loading && isAuthenticated && !user?.isAdmin) {
            error('Access denied. Admin privileges required.');
        }
    }, [loading, isAuthenticated, user, error]);

    if (loading) return <div>Loading...</div>;

    return isAuthenticated && user?.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
