import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ordersAPI } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const orderPlaced = location.state?.orderPlaced;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await ordersAPI.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      Pending: '#f59e0b',
      Ordered: '#3b82f6',
      Shipped: '#8b5cf6',
      Delivered: '#10b981',
      Cancelled: '#ef4444',
    };
    return colors[status] || '#6b7280';
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {orderPlaced && (
        <div className="success-message">
          Your order has been placed successfully!
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <span className="order-id">Order #{order._id.slice(-8)}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <span
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.image} alt={item.name} />
                    <div className="item-details">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="shipping-info">
                  <strong>Ship to:</strong>
                  <span>
                    {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                    {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                  </span>
                </div>
                <div className="order-total">
                  <span>Total:</span>
                  <strong>₹{order.totalPrice.toLocaleString('en-IN')}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
