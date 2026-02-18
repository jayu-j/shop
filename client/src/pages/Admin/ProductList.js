import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productsAPI.getAll();
            setProducts(data);
        } catch (err) {
            error('Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                await productsAPI.delete(id);
                success('Product deleted successfully');
                setProducts(products.filter(product => product._id !== id));
            } catch (err) {
                error(err.message || 'Failed to delete product');
            }
        }
    };

    if (loading) return <div className="admin-loading">Loading Products...</div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Products ({products.length})</h1>
                <Link to="/admin/products/new" className="admin-btn-primary">
                    + Create Product
                </Link>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Brand</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>{product._id.substring(20, 24)}</td>
                                <td>{product.name}</td>
                                <td>₹{product.price.toLocaleString('en-IN')}</td>
                                <td>{product.category}</td>
                                <td>{product.brand}</td>
                                <td>
                                    <Link to={`/admin/products/${product._id}/edit`}>
                                        <button className="action-btn edit-btn">Edit</button>
                                    </Link>
                                    <button
                                        className="action-btn delete-btn"
                                        onClick={() => handleDelete(product._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductList;
