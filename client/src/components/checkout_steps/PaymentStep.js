import React, { useState } from 'react';

const PaymentStep = ({ active, amount, onPayment }) => {
    const [method, setMethod] = useState('Card');
    const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
    const [upiId, setUpiId] = useState('');

    if (!active) {
        return (
            <div className="checkout-step-header disabled">
                <span className="step-number">4</span>
                <span className="step-title">PAYMENT OPTIONS</span>
            </div>
        );
    }

    const handlePay = () => {
        onPayment(method, method === 'Card' ? cardDetails : { upiId });
    };

    return (
        <div className={`checkout-step ${active ? 'active' : ''}`}>
            <div className="checkout-step-header">
                <span className="step-number">4</span>
                <div className="step-info">
                    <span className="step-title">PAYMENT OPTIONS</span>
                </div>
            </div>

            <div className="checkout-step-body">
                <div className="payment-options-list">
                    {/* UPI */}
                    <div className={`payment-option-row ${method === 'UPI' ? 'selected' : ''}`}>
                        <div className="option-header">
                            <input type="radio" name="payment" checked={method === 'UPI'} onChange={() => setMethod('UPI')} />
                            <span className="option-label">UPI</span>
                        </div>
                        {method === 'UPI' && (
                            <div className="option-body">
                                <div className="upi-input-group">
                                    <input
                                        type="text"
                                        placeholder="Enter UPI ID"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                    />
                                    <button className="verify-btn">VERIFY</button>
                                </div>
                                <button className="pay-btn" onClick={handlePay}>PAY ₹{amount}</button>
                            </div>
                        )}
                    </div>

                    {/* Card */}
                    <div className={`payment-option-row ${method === 'Card' ? 'selected' : ''}`}>
                        <div className="option-header">
                            <input type="radio" name="payment" checked={method === 'Card'} onChange={() => setMethod('Card')} />
                            <span className="option-label">Credit / Debit / ATM Card</span>
                        </div>
                        {method === 'Card' && (
                            <div className="option-body">
                                <input
                                    type="text"
                                    placeholder="Card Number"
                                    className="card-input"
                                    value={cardDetails.number}
                                    onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                                />
                                <div className="card-row">
                                    <input
                                        type="text"
                                        placeholder="MM/YY"
                                        className="card-input-small"
                                        value={cardDetails.expiry}
                                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                                    />
                                    <input
                                        type="password"
                                        placeholder="CVV"
                                        className="card-input-small"
                                        value={cardDetails.cvv}
                                        onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                                    />
                                </div>
                                <button className="pay-btn" onClick={handlePay}>PAY ₹{amount}</button>
                            </div>
                        )}
                    </div>

                    {/* COD */}
                    <div className={`payment-option-row ${method === 'COD' ? 'selected' : ''}`}>
                        <div className="option-header">
                            <input type="radio" name="payment" checked={method === 'COD'} onChange={() => setMethod('COD')} />
                            <span className="option-label">Cash on Delivery</span>
                        </div>
                        {method === 'COD' && (
                            <div className="option-body">
                                <button className="pay-btn" onClick={handlePay}>CONFIRM ORDER</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentStep;
