const jwt = require('jsonwebtoken');

// JWT secret key - in production, this would be in environment variables
const JWT_SECRET = 'meesho_jwt_secret';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = generateToken;

