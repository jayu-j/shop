import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI, ordersAPI, authAPI } from '../../services/api';
import './Admin.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        totalRevenue: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const products = await productsAPI.getAll();
                const orders = await ordersAPI.getAllAdmin();
                // Assuming we could fetch users count, but for now we'll just mock or use what we have
                // Let's just use orders and products for now as we don't have a getUsers API exposed yet

                const totalRevenue = orders.reduce((acc, order) => acc + (order.isPaid ? order.totalPrice : 0), 0);

                setStats({
                    products: products.length,
                    orders: orders.length,
                    users: new Set(orders.map(o => o.user._id)).size, // Unique users from orders
                    totalRevenue,
                });
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="admin-loading">Loading Dashboard...</div>;

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="admin-actions">
                    <Link to="/admin/products/new" className="admin-btn-primary">
                        + Add Product
                    </Link>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Revenue</h3>
                    <p className="stat-value">₹{stats.totalRevenue.toLocaleString('en-IN')}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.orders}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Products</h3>
                    <p className="stat-value">{stats.products}</p>
                </div>
                <div className="stat-card">
                    <h3>Active Customers</h3>
                    <p className="stat-value">{stats.users}</p>
                </div>
            </div>

            <div className="admin-sections">
                <div className="admin-section">
                    <div className="section-header">
                        <h2>Quick Links</h2>
                    </div>
                    <div className="quick-links">
                        <Link to="/admin/products" className="quick-link-card">
                            Manage Products
                        </Link>
                        <Link to="/admin/orders" className="quick-link-card">
                            Manage Orders
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
