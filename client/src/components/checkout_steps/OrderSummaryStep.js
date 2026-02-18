import React from 'react';
import { useCart } from '../../context/CartContext';

const OrderSummaryStep = ({ active, completed, onComplete }) => {
    const { cartItems, updateQuantity, removeFromCart } = useCart();

    if (!active && !completed) {
        return (
            <div className="checkout-step-header disabled">
                <span className="step-number">3</span>
                <span className="step-title">ORDER SUMMARY</span>
            </div>
        );
    }

    return (
        <div className={`checkout-step ${active ? 'active' : ''}`}>
            <div className="checkout-step-header">
                <span className="step-number">3</span>
                <div className="step-info">
                    <span className="step-title">ORDER SUMMARY</span>
                    {completed && !active && (
                        <div className="step-content-preview">
                            <span>{cartItems.length} Items</span>
                        </div>
                    )}
                </div>
                {completed && !active && <button className="change-btn">CHANGE</button>}
            </div>

            {active && (
                <div className="checkout-step-body">
                    {cartItems.map(item => (
                        <div key={item.product._id} className="checkout-item">
                            <div className="checkout-item-img">
                                <img src={item.product.image} alt={item.product.name} />
                            </div>
                            <div className="checkout-item-details">
                                <h4>{item.product.name}</h4>
                                <span className="seller-text">Seller: SuperComNet</span>
                                <div className="price-row">
                                    <span className="current-price">₹{item.product.price}</span>
                                    <span className="original-price">₹{(item.product.price * 1.1).toFixed(0)}</span>
                                    <span className="discount-tag">10% Off</span>
                                </div>
                                <div className="qty-controls">
                                    <button disabled={item.quantity <= 1} onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                                    <button className="remove-link" onClick={() => removeFromCart(item.product._id)}>REMOVE</button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <button className="continue-btn" onClick={onComplete}>CONTINUE</button>
                </div>
            )}
        </div>
    );
};

export default OrderSummaryStep;
