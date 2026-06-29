const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    console.log('auth middleware - token received:', token ? (token.substring(0, 15) + '...') : 'none', 'secret:', process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error('auth middleware - jwt verification failed:', error.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};