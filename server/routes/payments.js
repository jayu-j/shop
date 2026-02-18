const express = require('express');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Generate unique transaction ID
const generateTransactionId = () => {
  return 'TXN' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
};

// @route   POST /api/payments/initiate
// @desc    Initiate a payment
// @access  Private
router.post('/initiate', protect, async (req, res) => {
  try {
    const { orderId, paymentMethod, upiId, payerName, payerPhone } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Check if order is already paid
    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    const transactionId = generateTransactionId();

    const payment = await Payment.create({
      order: orderId,
      user: req.user._id,
      paymentMethod,
      amount: order.totalPrice,
      transactionId,
      upiId,
      payerName,
      payerPhone,
      status: 'Pending'
    });

    // Generate UPI payment link (for demo purposes)
    let paymentLink = '';
    if (paymentMethod === 'PhonePe') {
      paymentLink = `phonepe://pay?pa=merchant@phonepe&pn=ShopHub&am=${order.totalPrice}&tr=${transactionId}&cu=INR`;
    } else if (paymentMethod === 'GooglePay') {
      paymentLink = `upi://pay?pa=merchant@okaxis&pn=ShopHub&am=${order.totalPrice}&tr=${transactionId}&cu=INR`;
    }

    res.status(201).json({
      payment,
      transactionId,
      paymentLink,
      amount: order.totalPrice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   POST /api/payments/verify
// @desc    Verify and complete a payment
// @access  Private
router.post('/verify', protect, async (req, res) => {
  try {
    const { transactionId, status } = req.body;

    const payment = await Payment.findOne({ transactionId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user owns the payment
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (status === 'success') {
      payment.status = 'Completed';
      payment.paidAt = Date.now();
      await payment.save();

      // Update order
      const order = await Order.findById(payment.order);
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'Processing';
      await order.save();

      res.json({ 
        message: 'Payment successful', 
        payment,
        order 
      });
    } else {
      payment.status = 'Failed';
      payment.failureReason = req.body.failureReason || 'Payment failed';
      await payment.save();

      res.status(400).json({ 
        message: 'Payment failed', 
        payment 
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payments/:orderId
// @desc    Get payment details for an order
// @access  Private
router.get('/:orderId', protect, async (req, res) => {
  try {
    const payment = await Payment.findOne({ order: req.params.orderId });
    
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user owns the payment
    if (payment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route   GET /api/payments
// @desc    Get all payments for user
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('order')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
