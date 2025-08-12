const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    console.log('Auth middleware - Token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      console.log('Auth middleware - No token provided');
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    console.log('Auth middleware - Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('Auth middleware - User found:', user ? user._id : 'none');
    
    if (!user) {
      console.log('Auth middleware - User not found');
      return res.status(401).json({ message: 'Token is not valid' });
    }

    req.user = user;
    console.log('Auth middleware - User authenticated:', user._id);
    next();
  } catch (error) {
    console.error('Auth middleware - Error:', error);
    res.status(401).json({ message: 'Token is not valid', error: error.message });
  }
};

const adminAuth = async (req, res, next) => {
  try {
    await auth(req, res, () => {});
    
    if (req.user.role !== 'admin') {
      console.log('Admin auth - Access denied for user:', req.user._id);
      return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    
    console.log('Admin auth - Access granted for user:', req.user._id);
    next();
  } catch (error) {
    console.error('Admin auth - Error:', error);
    res.status(403).json({ message: 'Access denied', error: error.message });
  }
};

module.exports = { auth, adminAuth }; 