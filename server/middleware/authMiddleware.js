// const jwt = require('jsonwebtoken');
// const User = require('../models/User');

// // Middleware to verify token
// const verifyToken = async (req, res, next) => {
//   const token = req.header('Authorization').replace('Bearer ', '');
//   if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = await User.findById(decoded.id).select('-password');
//     next();
//   } catch (err) {
//     res.status(401).json({ message: 'Token is not valid' });
//   }
// };

// // Middleware to check if user is an instructor
// const isInstructor = (req, res, next) => {
//   if (req.user.role !== 'instructor') {
//     return res.status(403).json({ message: 'Access denied, not an instructor' });
//   }
//   next();
// };

// module.exports = { verifyToken, isInstructor };

// const isAdmin = (req, res, next) => {
//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Access denied, not an admin' });
//     }
//     next();
//   };
  
//   module.exports = { verifyToken, isInstructor, isAdmin };

  

// server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

// Middleware to check if user is an admin
const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admins only.' });
  }
  next();
};

module.exports = { verifyToken, isAdmin };
