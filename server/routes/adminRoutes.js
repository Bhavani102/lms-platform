const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all courses
router.get('/courses', verifyToken, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email');
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// server/index.js (Update to use admin routes)
const adminRoutes = require('./routes/adminRoutes');
app.use('/api/admin', adminRoutes);
