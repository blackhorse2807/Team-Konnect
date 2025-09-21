const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT secret key - should match the one in generateToken.js
const JWT_SECRET = 'meesho_jwt_secret';

// Protect routes - middleware to check if user is authenticated
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET);

      // Get user from the token (exclude password)
      req.user = await User.findById(decoded.id).select('-password');

      next();
      return; // Important: return here to prevent executing the no-token block
    } catch (error) {
      console.error('Authentication error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token failed'
      });
    }
  }

  // Only execute this if no token was found
  return res.status(401).json({
    success: false,
    message: 'Not authorized, no token'
  });
};

// Admin middleware
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({
      success: false,
      message: 'Not authorized as an admin'
    });
  }
};

module.exports = { protect, admin };
