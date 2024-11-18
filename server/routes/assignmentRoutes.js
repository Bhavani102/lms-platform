// server/routes/assignmentRoutes.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const Assignment = require('../models/Assignment');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/assignments'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Admin posts a new assignment (with optional file)
router.post('/post', upload.single('assignmentFile'), async (req, res) => {
  const { courseName, assignmentText, postedBy } = req.body;
  const assignmentFile = req.file ? req.file.path : null;

  try {
    const assignment = new Assignment({ courseName, assignmentText, assignmentFile, postedBy });
    await assignment.save();
    res.status(201).json({ message: 'Assignment posted successfully!' });
  } catch (error) {
    console.error('Error posting assignment:', error);
    res.status(500).json({ message: 'Server error posting assignment' });
  }
});

// server/routes/assignmentRoutes.js
router.get('/enrolled/:studentEmail', async (req, res) => {
    const { studentEmail } = req.params;
  
    try {
      const assignments = await Assignment.find({ enrolledStudents: studentEmail });
      res.status(200).json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ message: 'Server error fetching assignments' });
    }
  });
  
module.exports = router;

// Fetch assignments for a student by email
router.get('/enrolled/:studentEmail', async (req, res) => {
    const { studentEmail } = req.params;
  
    try {
      // Find assignments for courses where the student is enrolled
      const assignments = await Assignment.find({ enrolledStudents: studentEmail });
      res.status(200).json(assignments);
    } catch (error) {
      console.error('Error fetching assignments:', error);
      res.status(500).json({ message: 'Server error fetching assignments' });
    }
  });