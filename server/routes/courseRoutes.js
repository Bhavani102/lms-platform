const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate');

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

// Create a new course (Admin only)
router.post('/create', authenticate, async (req, res) => {
  const { name, description } = req.body;

  try {
    const course = new Course({
      name,
      description,
      instructor: req.user.name, // Automatically set instructor to the logged-in user
    });
    await course.save();
    res.status(201).json({ message: 'Course created successfully', course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ message: 'Server error creating course' });
  }
});

// Enroll in a course (Student only)
router.post('/enroll', async (req, res) => {
  const { studentEmail, studentName, courseName } = req.body;

  try {
    const course = await Course.findOne({ name: courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check if the student is already enrolled
    const isAlreadyEnrolled = course.students.some(
      (student) => student.email === studentEmail
    );
    if (isAlreadyEnrolled) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    // Add the student (both email and name)
    course.students.push({ email: studentEmail, name: studentName });
    await course.save();

    res.status(200).json({ message: 'Enrollment successful', course });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
});

// Fetch available courses
router.get('/available', async (req, res) => {
  try {
    const availableCourses = await Course.find();
    res.status(200).json(availableCourses);
  } catch (error) {
    console.error('Error fetching available courses:', error);
    res.status(500).json({ message: 'Server error fetching available courses' });
  }
});

// Fetch all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// Add content to a course by name
router.post('/:courseName/content', upload.single('pdfFile'), async (req, res) => {
  try {
    const { type } = req.body;
    const courseName = req.params.courseName;

    const course = await Course.findOne({ name: courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    if (type === 'pdf' && req.file) {
      const relativeFilePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');
      course.content.push({ type, content: relativeFilePath });
    }

    await course.save();
    res.status(200).json({ message: 'Content added successfully', content: course.content });
  } catch (error) {
    console.error('Error adding content:', error);
    res.status(500).json({ message: 'Server error adding content' });
  }
});

// Fetch content for a course by name
router.get('/:courseName/content', async (req, res) => {
  try {
    const course = await Course.findOne({ name: req.params.courseName });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course.content);
  } catch (error) {
    console.error('Error fetching course content:', error);
    res.status(500).json({ message: 'Server error fetching course content' });
  }
});

// Fetch courses and content for an enrolled student
router.get('/student/:studentEmail/enrolled-content', async (req, res) => {
  try {
    const studentEmail = req.params.studentEmail;

    const enrolledCourses = await Course.find({ 'students.email': studentEmail }).select(
      'name description content'
    );

    if (!enrolledCourses.length) {
      return res.status(404).json({ message: 'No enrolled courses found for this student.' });
    }

    res.status(200).json(enrolledCourses);
  } catch (error) {
    console.error('Error fetching enrolled courses with content:', error);
    res.status(500).json({ message: 'Server error fetching courses' });
  }
});

// Fetch admin-created courses
router.get('/admin-courses', authenticate, async (req, res) => {
  try {
    const adminName = req.user.name;

    const courses = await Course.find({ instructor: adminName });

    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    res.status(500).json({ message: 'Server error fetching admin courses' });
  }
});

// Fetch students enrolled in a course
router.get('/:courseName/students', async (req, res) => {
  try {
    const course = await Course.findOne({ name: req.params.courseName }, { students: 1, _id: 0 });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    res.status(200).json(course.students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students.' });
  }
});

module.exports = router;
