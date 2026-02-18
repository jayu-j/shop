import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <img src="https://rukminim1.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" alt="Empty Cart" className="empty-cart-img" />
        <h2>Your cart is empty!</h2>
        <p>Explore our wide selection and find something you like</p>
        <Link to="/products" className="continue-shopping-btn">
          Shop Now
        </Link>
      </div>
    );
  }

  const shipping = cartTotal > 1000 ? 0 : 50;
  const totalAmount = cartTotal + shipping;
  const discount = Math.floor(cartTotal * 0.1); // Mock discount for display

  return (
    <div className="cart-page">
      <div className="cart-container">

        {/* LEFT COLUMN: Cart Items */}
        <div className="cart-items-section">
          <div className="cart-header">
            <h3>My Cart ({cartItems.length})</h3>
          </div>

          {cartItems.map((item) => {
            const product = item.product;
            return (
              <div key={product._id} className="cart-item">
                <div className="cart-item-left">
                  <div className="item-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="item-quantity-control">
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <div className="qty-display">{item.quantity}</div>
                    <button
                      onClick={() => updateQuantity(product._id, item.quantity + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="cart-item-right">
                  <Link to={`/product/${product._id}`} className="item-title-link">
                    <h3>{product.name}</h3>
                  </Link>
                  <span className="item-subtitle">Seller: SuperComNet</span>

                  <div className="item-price-row">
                    <span className="item-price-final">₹{product.price.toLocaleString('en-IN')}</span>
                    <span className="item-price-original">₹{(product.price * 1.1).toFixed(0)}</span>
                    <span className="item-discount">10% Off</span>
                  </div>

                  <div className="cart-actions">
                    <button className="action-btn" onClick={() => removeFromCart(product._id)}>REMOVE</button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="place-order-bar">
            <button className="place-order-btn" onClick={handleCheckout}>
              PLACE ORDER
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Price Details */}
        <div className="cart-sidebar">
          <div className="price-details-card">
            <div className="price-header">
              <span>PRICE DETAILS</span>
            </div>
            <div className="price-body">
              <div className="price-row">
                <span>Price ({cartItems.length} items)</span>
                <span>₹{(cartTotal + discount).toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row">
                <span>Discount</span>
                <span className="text-green">- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="price-row">
                <span>Delivery Charges</span>
                <span className="text-green">{shipping === 0 ? 'Free' : `₹${shipping}`}</span>
              </div>
              <div className="total-row">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="savings-msg">
                You will save ₹{discount.toLocaleString('en-IN')} on this order
              </div>
            </div>
          </div>

          <div className="safe-payment-badge">
            <svg width="25" height="30" viewBox="0 0 25 30" xmlns="http://www.w3.org/2000/svg" className="_15a779"><g className="" fill="none" fillRule="evenodd"><path className="_202c46" d="M12.607 29.387c6.82-3.15 11.233-9.92 11.233-17.23V5.556c0-.986-.71-1.828-1.682-1.977l-8.796-1.353c-.506-.08-1.02-.08-1.526 0L3.04 3.58C2.067 3.73 1.358 4.57 1.358 5.557v6.6c0 7.31 4.413 14.08 11.233 17.23h.016z" fill="#878787"></path><path className="_1e9889" d="M12.607 28.59c-6.43-2.97-10.59-9.352-10.59-16.223V5.556c0-.606.436-1.124 1.034-1.216l8.796-1.353c.477-.073.962-.073 1.44 0l8.795 1.353c.6.092 1.035.61 1.035 1.216v6.81c0 6.87-4.16 13.253-10.59 16.224h-.016z" fill="#FFF"></path><path className="_202c46" d="M11.75 18.52l-3.23-3.23a.965.965 0 0 1 1.365-1.364l1.865 1.865 4.865-4.866a.965.965 0 1 1 1.365 1.365l-5.55 5.55a.962.962 0 0 1-1.36 0z" fill="#878787"></path></g></svg>
            <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
