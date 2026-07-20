const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const router = express.Router();

// Create order
router.post('/create', auth, async (req, res) => {
  try {
    const { shippingAddress, paymentMethod, currency = 'INR' } = req.body;
    
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }
    
    const orderNumber = 'ORD' + Date.now();
    
    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      price: item.product.price
    }));
    
    const subtotal = cart.totalAmount;
    const shipping = subtotal > 2000 ? 0 : 200; // Free shipping above 2000
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    const order = new Order({
      user: req.user.id,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      tax,
      total,
      currency
    });
    
    await order.save();
    
    // Clear cart after order creation
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();
    
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get user orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('items.product')
      .sort({ createdAt: -1 });
    
    res.json(orders);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Get order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    }).populate('items.product');
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// Update order status (for admin)
router.put('/:id/status', [auth, admin], async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;
    
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    if (orderStatus) order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    
    await order.save();
    res.json(order);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;