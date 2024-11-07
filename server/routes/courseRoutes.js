// server/routes/courseRoutes.js
const express = require('express');
const Course = require('../models/Course');
const User = require('../models/User');
const router = express.Router();

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

module.exports = router;