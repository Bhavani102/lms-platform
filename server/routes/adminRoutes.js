const express = require('express');
const User = require('../models/User');
const Course = require('../models/Course');
const Quiz = require('../models/Quiz');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

router.get('/:courseName/students', async (req, res) => {
  const { courseName } = req.params;

  try {
    const course = await Course.findOne({ name: courseName }, { students: 1, _id: 0 });
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.status(200).json(course.students); // Return the array of students
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error while fetching students.' });
  }
});



// Get all users
router.get('/users', verifyToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

// Get all courses
router.get('/courses', verifyToken, isAdmin, async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor', 'name email'); // Include instructor details
    res.status(200).json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ message: 'Server error fetching courses.' });
  }
});

// Fetch quizzes for a specific course
router.get('/quizzes', verifyToken, isAdmin, async (req, res) => {
  const { courseName } = req.query;
  try {
    const quizzes = await Quiz.find({ courseName });
    if (!quizzes || quizzes.length === 0) {
      return res.status(404).json({ message: 'No quizzes found for the specified course.' });
    }
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error fetching quizzes.' });
  }
});


// Fetch students enrolled in a course
router.get('/students', verifyToken, isAdmin, async (req, res) => {
  const { courseName } = req.query;
  try {
    const course = await Course.findOne({ name: courseName }).populate('students', 'name email');
    console.log('Populated students:', course.students);

    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.status(200).json(course.students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ message: 'Server error fetching students.' });
  }
});

// Fetch submissions for a specific quiz and student
router.get('/submissions', verifyToken, isAdmin, async (req, res) => {
  const { quizId, studentEmail } = req.query;

  if (!quizId || !studentEmail) {
    return res.status(400).json({ message: 'quizId and studentEmail are required.' });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    const submission = quiz.submissions.find((sub) => sub.studentEmail === studentEmail);
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found for this student.' });
    }

    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({ message: 'Server error fetching submissions.' });
  }
});

module.exports = router;
