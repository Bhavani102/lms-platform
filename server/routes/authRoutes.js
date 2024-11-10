// server/routes/authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

// Helper function to generate JWT token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register user
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password:hashedPassword, role });
    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user with email, password, and role verification
router.post('/login', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Check if a user with the provided email and role exists
    // Debugging line inside login route
    const user = await User.findOne({ email, role });

    if (!user) {
      return res.status(400).json({ message: 'Invalid email, password, or role' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email, password, or role' });
    }

    const token = generateToken(user._id, user.role);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

router.get('/user', async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password'); // Omit the password

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user from token:', error);
    res.status(500).json({ message: 'Server error fetching user data' });
  }
});


// Get courses created by admin
router.get('/all', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// Endpoint to add content to a course
router.post('/:courseId/content', async (req, res) => {
  try {
    const { type, content } = req.body; // type: 'pdf', 'video', etc.
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    course.content.push({ type, content });
    await course.save();

    res.status(200).json({ message: 'Content added successfully' });
  } catch (error) {
    console.error('Error adding content:', error);
    res.status(500).json({ message: 'Server error adding content' });
  }
});

module.exports = router;
