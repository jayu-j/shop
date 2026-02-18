import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productsAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { success, error } = useToast();
    const isEditMode = id !== 'new';

    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        image: '',
        brand: '',
        category: '',
        countInStock: 0,
        description: '',
    });

    const [loading, setLoading] = useState(isEditMode);

    useEffect(() => {
        if (isEditMode) {
            const fetchProduct = async () => {
                try {
                    const product = await productsAPI.getById(id);
                    setFormData({
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        brand: product.brand,
                        category: product.category,
                        countInStock: product.countInStock,
                        description: product.description,
                    });
                } catch (err) {
                    error(err.message || 'Failed to fetch product');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode, error]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await productsAPI.update(id, formData);
                success('Product updated successfully');
            } else {
                await productsAPI.create(formData);
                success('Product created successfully');
            }
            navigate('/admin/products');
        } catch (err) {
            error(err.message || 'Failed to save product');
        }
    };

    if (loading) return <div className="admin-loading">Loading...</div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>{isEditMode ? 'Edit Product' : 'Create Product'}</h1>
            </div>

            <div className="admin-form-container">
                <form onSubmit={handleSubmit} className="admin-form">
                    <div className="form-group">
                        <label>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Price</label>
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Image URL</label>
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Brand</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input
                            type="text"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Count In Stock</label>
                        <input
                            type="number"
                            name="countInStock"
                            value={formData.countInStock}
                            onChange={handleChange}
                            required
                            min="0"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                            rows="5"
                        ></textarea>
                    </div>

                    <button type="submit" className="admin-btn-primary full-width">
                        {isEditMode ? 'Update Product' : 'Create Product'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProductEdit;
