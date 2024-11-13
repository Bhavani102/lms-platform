const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

// Fetch enrolled courses for a student by email
router.get('/:studentEmail', async (req, res) => {
  const { studentEmail } = req.params;
  console.log(`Fetching enrollments for student: ${studentEmail}`);

  try {
    // Find courses where the studentEmail is in the students array
    const courses = await Course.find({ students: studentEmail });
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    res.status(500).json({ message: 'Server error fetching enrolled courses' });
  }
});

// Enroll a student in a course
router.post('/', async (req, res) => {
  const { studentEmail, courseName } = req.body;

  try {
    const course = await Course.findOne({ name: courseName });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    // Check if the student is already enrolled
    if (course.students.includes(studentEmail)) {
      return res.status(400).json({ message: 'Student already enrolled in this course' });
    }

    // Add student email to the course's students array
    course.students.push(studentEmail);
    await course.save();

    res.status(200).json({ message: 'Enrollment successful' });
  } catch (error) {
    console.error('Error enrolling student:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
});

module.exports = router;
