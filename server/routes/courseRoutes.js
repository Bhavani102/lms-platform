const express = require('express');
const Course = require('../models/Course');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Enroll in course
router.post('/:courseId/enroll', verifyToken, async (req, res) => {
  const { courseId } = req.params;
  try {
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (course.students.includes(req.user.id)) {
      return res.status(400).json({ message: 'You are already enrolled in this course' });
    }

    course.students.push(req.user.id);
    await course.save();
    res.status(200).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;