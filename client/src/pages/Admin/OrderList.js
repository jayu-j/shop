import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ordersAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import './Admin.css';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { success, error } = useToast();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const data = await ordersAPI.getAllAdmin();
            setOrders(data);
        } catch (err) {
            error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await ordersAPI.updateStatus(id, newStatus);
            success(`Order status updated to ${newStatus}`);
            fetchOrders(); // Refresh list
        } catch (err) {
            error(err.message || 'Failed to update order status');
        }
    };

    if (loading) return <div className="admin-loading">Loading Orders...</div>;

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Orders ({orders.length})</h1>
            </div>

            <div className="admin-table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Date</th>
                            <th>Total</th>
                            <th>Paid</th>
                            <th>Delivered</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order._id}>
                                <td>{order._id.substring(20, 24)}</td>
                                <td>{order.user && order.user.name}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>₹{order.totalPrice.toLocaleString('en-IN')}</td>
                                <td>
                                    {order.isPaid ? (
                                        <span style={{ color: 'green' }}>{order.paidAt.substring(0, 10)}</span>
                                    ) : (
                                        <span style={{ color: 'red' }}>No</span>
                                    )}
                                </td>
                                <td>
                                    {order.isDelivered ? (
                                        <span style={{ color: 'green' }}>{order.deliveredAt.substring(0, 10)}</span>
                                    ) : (
                                        <span style={{ color: 'red' }}>No</span>
                                    )}
                                </td>
                                <td>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className="status-select"
                                        style={{ padding: '4px', borderRadius: '4px' }}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Ordered">Ordered</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                                <td>
                                    <Link to={`/order/${order._id}`}>
                                        <button className="action-btn edit-btn">Details</button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;
