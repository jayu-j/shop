import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`toast toast-${type} animate-slide-in`}>
            <div className="toast-content">
                {type === 'success' && <span className="toast-icon">✓</span>}
                {type === 'error' && <span className="toast-icon">✕</span>}
                {type === 'info' && <span className="toast-icon">ℹ</span>}
                <p>{message}</p>
            </div>
            <button className="toast-close" onClick={onClose}>×</button>
        </div>
    );
};

export default Toast;
