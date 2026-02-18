import React, { useState } from 'react';

const AddressStep = ({ active, completed, onComplete, address, setAddress }) => {
    const [isEditing, setIsEditing] = useState(!completed);

    if (!active && !completed) {
        return (
            <div className="checkout-step-header disabled">
                <span className="step-number">2</span>
                <span className="step-title">DELIVERY ADDRESS</span>
            </div>
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        onComplete();
        setIsEditing(false);
    };

    return (
        <div className={`checkout-step ${active ? 'active' : ''}`}>
            <div className="checkout-step-header">
                <span className="step-number">2</span>
                <div className="step-info">
                    <span className="step-title">DELIVERY ADDRESS</span>
                    {completed && !active && (
                        <div className="step-content-preview">
                            <span>{address.name}</span>
                            <span>{address.address}, {address.city} - {address.postalCode}</span>
                        </div>
                    )}
                </div>
                {completed && !active && <button className="change-btn" onClick={() => setIsEditing(true)}>CHANGE</button>}
            </div>

            {(active || (completed && isEditing)) && (
                <div className="checkout-step-body">
                    <form onSubmit={handleSubmit} className="address-form">
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Name"
                                value={address.name || ''}
                                onChange={e => setAddress({ ...address, name: e.target.value })}
                                required
                                className="checkout-input"
                            />
                            <input
                                type="text"
                                placeholder="10-digit mobile number"
                                value={address.phone || ''}
                                onChange={e => setAddress({ ...address, phone: e.target.value })}
                                required
                                className="checkout-input"
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="Pincode"
                                value={address.postalCode || ''}
                                onChange={e => setAddress({ ...address, postalCode: e.target.value })}
                                required
                                className="checkout-input"
                            />
                            <input
                                type="text"
                                placeholder="Locality"
                                value={address.locality || ''}
                                onChange={e => setAddress({ ...address, locality: e.target.value })}
                                required
                                className="checkout-input"
                            />
                        </div>
                        <div className="form-group">
                            <textarea
                                placeholder="Address (Area and Street)"
                                value={address.address || ''}
                                onChange={e => setAddress({ ...address, address: e.target.value })}
                                required
                                className="checkout-textarea"
                                rows="3"
                            />
                        </div>
                        <div className="form-row">
                            <input
                                type="text"
                                placeholder="City/District/Town"
                                value={address.city || ''}
                                onChange={e => setAddress({ ...address, city: e.target.value })}
                                required
                                className="checkout-input"
                            />
                            <input
                                type="text"
                                placeholder="State"
                                value={address.state || ''}
                                onChange={e => setAddress({ ...address, state: e.target.value })}
                                required
                                className="checkout-input"
                            />
                        </div>

                        <button type="submit" className="deliver-here-btn">DELIVER HERE</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default AddressStep;
