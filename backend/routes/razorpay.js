const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'dummy_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret',
});

// Create Order (to get razorpay order_id)
router.post('/create-order', auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const subtotal = cart.totalAmount;
    const shipping = subtotal > 2000 ? 0 : 200; // Free shipping above 2000
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax;
    
    // Razorpay amount is in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(total * 100);

    const options = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: 'rcpt_' + Date.now(),
    };

    const order = await razorpay.orders.create(options);
    if (!order) {
      return res.status(500).json({ message: 'Razorpay order creation failed' });
    }

    res.json({
      ...order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Verify Payment and Save Final Order
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      shippingAddress 
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'dummy_key_secret')
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }

    // Payment is verified, create the order in DB
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty during verification' });
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
    const shipping = subtotal > 2000 ? 0 : 200;
    const tax = subtotal * 0.18;
    const total = subtotal + shipping + tax;

    const newOrder = new Order({
      user: req.user.id,
      orderNumber,
      items,
      shippingAddress,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid', // verified
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      subtotal,
      shipping,
      tax,
      total,
      currency: 'INR'
    });

    await newOrder.save();

    // Clear cart
    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({ message: "Payment verified successfully", order: newOrder });
  } catch (error) {
    console.error('Razorpay Verify Payment Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
