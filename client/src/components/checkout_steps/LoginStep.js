import React from 'react';
import { useAuth } from '../../context/AuthContext';

const LoginStep = ({ active, completed }) => {
    const { user } = useAuth();

    if (!active && !completed) {
        return (
            <div className="checkout-step-header disabled">
                <span className="step-number">1</span>
                <span className="step-title">LOGIN</span>
            </div>
        );
    }

    return (
        <div className={`checkout-step ${active ? 'active' : ''}`}>
            <div className="checkout-step-header">
                <span className="step-number">1</span>
                <div className="step-info">
                    <span className="step-title">LOGIN</span>
                    {completed && <span className="step-check">✓</span>}
                    <div className="step-content-preview">
                        <span className="preview-name">{user?.name}</span>
                        <span className="preview-phone">+91 9876543210</span>
                    </div>
                </div>
                {completed && <button className="change-btn">CHANGE</button>}
            </div>

            {active && (
                <div className="checkout-step-body">
                    <div className="login-details">
                        <div className="user-info-row">
                            <span className="label">Name</span>
                            <span className="value">{user?.name}</span>
                        </div>
                        <div className="user-info-row">
                            <span className="label">Phone</span>
                            <span className="value">+91 9876543210</span>
                        </div>
                        <div className="logout-link">
                            Logout & Sign in to another account
                        </div>
                        <button className="continue-btn" disabled>CONTINUE CHECKOUT</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginStep;
