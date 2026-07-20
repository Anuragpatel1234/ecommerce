const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const WebsiteSection = require('../models/WebsiteSection');
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { uploadToImageKit } = require('../middleware/imagekitUpload');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// All admin routes require authentication and admin role
router.use(auth);
router.use(admin);

// Dashboard Statistics
router.get('/dashboard/stats', async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRevenue = await Order.aggregate([
      { $match: { orderStatus: { $in: ['completed', 'delivered'] } } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    const recentOrders = await Order.find()
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    const topProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    res.json({
      stats: {
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue: totalRevenue[0]?.total || 0
      },
      recentOrders: recentOrders || [],
      topProducts: topProducts || []
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
});

// Generic Image// Upload single or multiple images
router.post('/upload', upload.array('images', 20), uploadToImageKit('rangaara/products'), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const filePaths = req.files.map(file => file.path);
    res.json({
      message: 'Files uploaded successfully',
      urls: filePaths
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'File upload failed', error: error.message });
  }
});

// Product Management Routes
router.get('/products', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = category;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const products = await Product.find(query)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Product.countDocuments(query);

    res.json({
      products: products || [],
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products', error: error.message });
  }
});

router.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Failed to fetch product', error: error.message });
  }
});

router.post('/products', upload.array('images', 5), uploadToImageKit('rangaara/products'), [
  body('name').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let finalImages = req.files ? req.files.map(file => file.path) : [];
    if (req.body.existingImages) {
      const parsed = JSON.parse(req.body.existingImages);
      finalImages = [...finalImages, ...parsed];
    }

    const productData = {
      ...req.body,
      price: parseFloat(req.body.price),
      originalPrice: req.body.originalPrice ? parseFloat(req.body.originalPrice) : undefined,
      images: finalImages
    };

    // Parse sizes and colors if they're strings
    if (typeof productData.sizes === 'string') {
      productData.sizes = JSON.parse(productData.sizes);
    }
    if (typeof productData.colors === 'string') {
      productData.colors = JSON.parse(productData.colors);
    }

    const product = new Product(productData);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.put('/products/:id', upload.array('images', 5), uploadToImageKit('rangaara/products'), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const updateData = { ...req.body };

    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = parseFloat(updateData.originalPrice);

    let finalImages = [];
    if (updateData.existingImages) {
      finalImages = JSON.parse(updateData.existingImages);
    } else {
      finalImages = product.images || [];
    }

    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.path);
      finalImages = [...newImages, ...finalImages];
    }
    
    updateData.images = finalImages;

    // Parse sizes and colors if they're strings
    if (typeof updateData.sizes === 'string') {
      updateData.sizes = JSON.parse(updateData.sizes);
    }
    if (typeof updateData.colors === 'string') {
      updateData.colors = JSON.parse(updateData.colors);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete associated images
    if (product.images && product.images.length > 0) {
      product.images.forEach(imagePath => {
        try {
          const fullPath = path.join(__dirname, '..', imagePath);
          if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
          }
        } catch (fileError) {
          console.error('Error deleting image file:', fileError);
          // Continue even if image deletion fails
        }
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid product ID' });
    }
    res.status(500).json({ message: 'Failed to delete product', error: error.message });
  }
});

// Order Management Routes
router.get('/orders', async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const orders = await Order.find(query)
      .populate('user', 'firstName lastName email')
      .populate('items.product')
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ createdAt: -1 })
      .lean();

    const total = await Order.countDocuments(query);

    res.json({
      orders: orders || [],
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

router.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'firstName lastName email phone address')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

router.put('/orders/:id/status', [
  body('status').notEmpty().withMessage('Status is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true }
    ).populate('user', 'firstName lastName email')
      .populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Management Routes
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = { role: 'user' };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const users = await User.find(query)
      .select('-password')
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .sort({ createdAt: -1 })
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      users: users || [],
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      total
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('orders')
      .populate('wishlist');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/users/:id/block', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent blocking other admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot block an administrator' });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.json({ message: `User successfully ${user.isBlocked ? 'blocked' : 'unblocked'}`, user });
  } catch (error) {
    console.error('Block user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent deleting admins
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete an administrator' });
    }

    // Cascade delete: Remove all orders associated with this user
    await Order.deleteMany({ user: req.params.id });

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// CMS - Website Sections Management
// IMPORTANT: This route must come before /sections/:id to avoid route conflicts
router.get('/sections', async (req, res) => {
  try {
    const sections = await WebsiteSection.find()
      .sort({ order: 1, createdAt: -1 })
      .lean();

    res.json({ sections: sections || [] });
  } catch (error) {
    console.error('Get sections error:', error);
    res.status(500).json({
      message: 'Failed to fetch sections',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Get section by ID (ObjectId) or by key
router.get('/sections/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if it's a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    let section;
    if (isObjectId) {
      // If it's an ObjectId, search by _id
      section = await WebsiteSection.findById(id);
    } else {
      // Otherwise, search by sectionKey
      section = await WebsiteSection.findOne({ sectionKey: id });
    }

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    console.error('Get section error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    res.status(500).json({ message: 'Failed to fetch section', error: error.message });
  }
});

router.post('/sections', [
  body('sectionKey').notEmpty().withMessage('Section key is required'),
  body('sectionName').notEmpty().withMessage('Section name is required'),
  body('sectionType').notEmpty().withMessage('Section type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const sectionData = req.body;
    const section = new WebsiteSection(sectionData);
    await section.save();

    res.status(201).json(section);
  } catch (error) {
    console.error('Create section error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Section with this key already exists' });
    }
    res.status(500).json({ message: 'Failed to create section', error: error.message });
  }
});

router.put('/sections/:id', async (req, res) => {
  try {
    const section = await WebsiteSection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json(section);
  } catch (error) {
    console.error('Update section error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    res.status(500).json({ message: 'Failed to update section', error: error.message });
  }
});

router.delete('/sections/:id', async (req, res) => {
  try {
    const section = await WebsiteSection.findByIdAndDelete(req.params.id);

    if (!section) {
      return res.status(404).json({ message: 'Section not found' });
    }

    res.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Delete section error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid section ID' });
    }
    res.status(500).json({ message: 'Failed to delete section', error: error.message });
  }
});

module.exports = router;

