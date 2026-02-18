import React, { useEffect, useState } from 'react';
import './PaymentProcessingModal.css';

const PaymentProcessingModal = ({ status, error, onClose }) => {
    const [step, setStep] = useState(0);

    useEffect(() => {
        if (status === 'processing') {
            const interval = setInterval(() => {
                setStep((prev) => (prev < 2 ? prev + 1 : prev));
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [status]);

    if (status === 'idle') return null;

    const steps = [
        'Connecting to Secure Gateway...',
        'Verifying Payment Details...',
        'Processing Transaction...'
    ];

    return (
        <div className="payment-modal-overlay">
            <div className="payment-modal">
                {status === 'failed' ? (
                    <div className="payment-status failed">
                        <div className="status-icon">❌</div>
                        <h2>Payment Failed</h2>
                        <p>{error || 'Transaction could not be completed.'}</p>
                        <button onClick={onClose} className="bg-red-500 text-white px-6 py-2 rounded mt-4">
                            Try Again
                        </button>
                    </div>
                ) : status === 'success' ? (
                    <div className="payment-status success">
                        <div className="status-icon">✅</div>
                        <h2>Payment Successful!</h2>
                        <p>Redirecting to orders...</p>
                    </div>
                ) : (
                    <div className="payment-status processing">
                        <div className="spinner"></div>
                        <h2>Processing Payment</h2>
                        <p className="step-text">{steps[step]}</p>
                        <div className="progress-bar">
                            <div
                                className="progress-fill"
                                style={{ width: `${((step + 1) / 3) * 100}%` }}
                            ></div>
                        </div>
                        <p className="warning-text">Please do not close this window or press back.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentProcessingModal;
