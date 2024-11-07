// server/routes/courseRoutes.js
const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const router = express.Router();
// server/routes/courseRoutes.js
const multer = require('multer');
const path = require('path');
// Create a new course (Admin only)
router.post('/create', async (req, res) => {
  const { name, description, instructor } = req.body;

  try {
    const course = new Course({ name, description, instructor });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
});

// Enroll in a course (Student only)
router.post('/enroll', async (req, res) => {
  const { courseId, studentId } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if student is already enrolled
    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    // Add student to course
    course.students.push(studentId);
    await course.save();

    res.status(200).json({ message: 'Enrollment successful' });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
});


router.get('/available', async (req, res) => {
  try {
    const availableCourses = await Course.find();
    res.status(200).json(availableCourses);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ message: 'Server error fetching available courses' });
  }
});

router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});



// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Endpoint to add content to a course by name
router.post('/:courseName/content', upload.single('pdfFile'), async (req, res) => {
  try {
    const { type } = req.body;
    const courseName = req.params.courseName;

    // Find course by name
    const course = await Course.findOne({ name: courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (type === 'pdf' && req.file) {
      // Push file path if the content type is PDF
      course.content.push({ type, content: req.file.path });
    } else {
      return res.status(400).json({ message: 'File upload or content type is incorrect.' });
    }

    await course.save();
    res.status(200).json({ message: 'Content added successfully' });
  } catch (error) {
    console.error('Error adding content:', error);
    res.status(500).json({ message: 'Server error adding content' });
  }
});

// server/routes/courseRoutes.js
router.get('/:courseName/content', async (req, res) => {
  try {
    const course = await Course.findOne({ name: req.params.courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Return only the content array
    res.status(200).json(course.content);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ message: 'Server error fetching course content' });
  }
});


module.exports = router;
