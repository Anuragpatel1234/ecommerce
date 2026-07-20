const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// CORS setup
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://rangaara.com',
  'https://www.rangaara.com',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002'
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    // As a fallback for local development with local IPs
    if (origin.startsWith('http://192.168.') || origin.startsWith('http://10.')) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Body limit is part of security hardening
app.use(mongoSanitize()); // Prevent NoSQL Injection
app.use(hpp()); // Prevent HTTP Parameter Pollution

app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/newsletter', require('./routes/newsletter'));
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/sections', require('./routes/sections'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/admin/cms', require('./routes/cms'));
app.use('/api/paypal', require('./routes/paypal'));
app.use('/api/razorpay', require('./routes/razorpay'));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rangaara', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});