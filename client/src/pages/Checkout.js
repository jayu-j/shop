import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ordersAPI, paymentsAPI } from '../services/api';
import PaymentProcessingModal from '../components/PaymentProcessingModal';
import LoginStep from '../components/checkout_steps/LoginStep';
import AddressStep from '../components/checkout_steps/AddressStep';
import OrderSummaryStep from '../components/checkout_steps/OrderSummaryStep';
import PaymentStep from '../components/checkout_steps/PaymentStep';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(2); // Start at Address (assuming logged in)

  // Data State
  const [shippingAddress, setShippingAddress] = useState({
    name: '', phone: '', postalCode: '', locality: '', address: '', city: '', state: ''
  });

  // Payment State
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [paymentError, setPaymentError] = useState('');

  const shippingPrice = cartTotal > 1000 ? 0 : 50;
  const totalPrice = cartTotal + shippingPrice;

  const handlePayment = async (method, details) => {
    try {
      setPaymentStatus('processing');

      // 1. Create Order
      const orderItems = cartItems.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
      }));

      const order = await ordersAPI.create({
        items: orderItems,
        shippingAddress: {
          address: shippingAddress.address,
          city: shippingAddress.city,
          postalCode: shippingAddress.postalCode,
          country: 'India' // Defaulting
        },
        paymentMethod: method,
      });

      // 2. Process Payment
      if (method !== 'COD') {
        const paymentData = {
          orderId: order._id,
          paymentMethod: method,
          amount: order.totalPrice,
          ...(method === 'Card' ? { payerName: details.name } : { upiId: details.upiId })
        };

        const initResponse = await paymentsAPI.initiate(paymentData);

        // Simulation
        await new Promise(resolve => setTimeout(resolve, 2000));

        await paymentsAPI.verify({
          transactionId: initResponse.transactionId,
          status: 'success'
        });

        setPaymentStatus('success');
        setTimeout(async () => {
          await clearCart();
          navigate('/orders', { state: { orderPlaced: true } });
        }, 2000);
      } else {
        // COD
        await clearCart();
        navigate('/orders', { state: { orderPlaced: true } });
      }
    } catch (err) {
      console.error(err);
      setPaymentStatus('failed');
      setPaymentError(err.message || 'Payment processing failed');
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="checkout-page">
      <PaymentProcessingModal
        status={paymentStatus}
        error={paymentError}
        onClose={() => setPaymentStatus('idle')}
      />

      <div className="checkout-container">
        <div className="checkout-left">
          <LoginStep
            active={currentStep === 1}
            completed={true}
          />

          <AddressStep
            active={currentStep === 2}
            completed={currentStep > 2}
            onComplete={() => setCurrentStep(3)}
            address={shippingAddress}
            setAddress={setShippingAddress}
          />

          <OrderSummaryStep
            active={currentStep === 3}
            completed={currentStep > 3}
            onComplete={() => setCurrentStep(4)}
          />

          <PaymentStep
            active={currentStep === 4}
            amount={totalPrice}
            onPayment={handlePayment}
          />
        </div>

        <div className="checkout-right">
          <div className="price-details-card">
            <div className="price-header">
              <span>PRICE DETAILS</span>
            </div>
            <div className="price-body">
              <div className="price-row">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="text-green">{shippingPrice === 0 ? 'Free' : `₹${shippingPrice}`}</span>
              </div>
              <div className="total-row">
                <span>Total Payable</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
