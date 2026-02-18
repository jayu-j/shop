import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';
import './Profile.css';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { success, error } = useToast();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        profilePicture: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                profilePicture: user.profilePicture || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, profilePicture: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const updateData = {
                name: formData.name,
                phoneNumber: formData.phoneNumber,
                profilePicture: formData.profilePicture
            };

            const updatedUser = await authAPI.updateProfile(updateData);

            localStorage.setItem('user', JSON.stringify(updatedUser));
            success('Profile updated successfully');

            // Reload to refresh context
            window.location.reload();

        } catch (err) {
            error(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getInitials = (name) => {
        return name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U';
    };

    return (
        <div className="profile-page">
            <div className="profile-container">
                {/* Profile Header Card */}
                <div className="profile-header-card animate-slide-up">
                    <div className="profile-avatar-container">
                        {formData.profilePicture ? (
                            <img src={formData.profilePicture} alt="Profile" className="profile-avatar-img" />
                        ) : (
                            <div className="profile-avatar">
                                {getInitials(user?.name)}
                            </div>
                        )}
                        <label className="avatar-upload-btn">
                            📷
                            <input type="file" accept="image/*" onChange={handleFileChange} hidden />
                        </label>
                    </div>
                    <div className="profile-info-header">
                        <h1>{user?.name}</h1>
                        <p className="profile-email">{user?.email}</p>
                    </div>
                </div>

                <div className="profile-content-grid">
                    {/* Left Column: Edit Details */}
                    <form onSubmit={handleSubmit} className="profile-card animate-slide-up delay-1">
                        <div className="card-header">
                            <h2>Personal Details</h2>
                        </div>

                        <div className="form-group">
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={formData.email}
                                disabled
                                className="disabled-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Add phone number"
                            />
                        </div>

                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Update Details'}
                        </button>
                    </form>

                    {/* Right Column: Actions */}
                    <div className="profile-actions animate-fade-in delay-2">
                        <div className="action-card" onClick={() => navigate('/orders')}>
                            <div className="action-icon">📦</div>
                            <div className="action-text">
                                <h3>Order History</h3>
                                <p>Track shipments & returns</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </div>

                        <div className="action-card" onClick={() => navigate('/wishlist')}>
                            <div className="action-icon">❤️</div>
                            <div className="action-text">
                                <h3>Wishlist</h3>
                                <p>Your saved items</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </div>

                        <div className="action-card logout-card" onClick={handleLogout}>
                            <div className="action-icon">🚪</div>
                            <div className="action-text">
                                <h3>Sign Out</h3>
                                <p>Log out of your account</p>
                            </div>
                            <div className="action-arrow">→</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
