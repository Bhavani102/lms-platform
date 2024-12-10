const express = require('express');
const Quiz = require('../models/Quiz');
const authenticate = require('../middleware/authenticate');
const router = express.Router();

// Fetch Drafted Quizzes
router.get('/drafts', authenticate, async (req, res) => {
  try {
    const drafts = await Quiz.find({ isDraft: true, postedBy: req.user.name });
    res.status(200).json(drafts);
  } catch (error) {
    console.error('Error fetching drafted quizzes:', error);
    res.status(500).json({ message: 'Server error fetching drafted quizzes.' });
  }
});

// Fetch Quizzes for Students
router.get('/student', authenticate, async (req, res) => {
  const currentDate = new Date();
  try {
    const quizzes = await Quiz.find({ isDraft: false, deadline: { $gte: currentDate } });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes for students:', error);
    res.status(500).json({ message: 'Failed to fetch quizzes.' });
  }
});

// Save Quiz as Draft
router.post('/save', authenticate, async (req, res) => {
  try {
    const { title, courseName, questions, deadline } = req.body;

    if (!title || !courseName || !questions || questions.length === 0 || !deadline) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const postedBy = req.user.name;
    const quiz = new Quiz({ title, courseName, questions, deadline, postedBy, isDraft: true });
    const savedQuiz = await quiz.save();

    res.status(201).json({ message: 'Quiz saved as draft!', quiz: savedQuiz });
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({ message: 'Server error saving quiz.' });
  }
});

// Post Quiz
router.post('/post', authenticate, async (req, res) => {
  try {
    const { title, courseName, questions, deadline } = req.body;

    if (!title || !courseName || !questions || questions.length === 0 || !deadline) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const postedBy = req.user.name;
    const quiz = new Quiz({ title, courseName, questions, deadline, postedBy, isDraft: false });
    await quiz.save();

    res.status(201).json({ message: 'Quiz posted successfully!', quiz });
  } catch (error) {
    console.error('Error posting quiz:', error);
    res.status(500).json({ message: 'Server error posting quiz.' });
  }
});

// Get Quizzes for Lecturer
router.get('/lecturer', authenticate, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ postedBy: req.user.name });
    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ message: 'Server error fetching quizzes.' });
  }
});

// Fetch Quiz by ID
router.get('/:id', authenticate, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }
    res.status(200).json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error fetching quiz.' });
  }
});

// Submit Quiz
// Submit Quiz
router.post('/:quizId/submit', authenticate, async (req, res) => {
  const { answers } = req.body;
  const studentEmail = req.user.email;

  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    // Calculate score
    const score = quiz.questions.reduce((total, question) => {
      const studentAnswer = answers[question._id];
      if (question.answerType === 'checkbox') {
        const correctAnswer = Array.isArray(question.correctAnswer)
          ? question.correctAnswer.sort().join(',')
          : question.correctAnswer;
        const submittedAnswer = Array.isArray(studentAnswer)
          ? studentAnswer.sort().join(',')
          : studentAnswer;

        return correctAnswer === submittedAnswer ? total + 1 : total;
      } else {
        return studentAnswer === question.correctAnswer ? total + 1 : total;
      }
    }, 0);

    res.status(200).json({ message: 'Quiz submitted successfully!', score });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Failed to submit quiz.' });
  }
});


// Update a Drafted Quiz
router.put('/draft/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, courseName, questions, deadline } = req.body;

    if (!title || !courseName || !questions || questions.length === 0 || !deadline) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(
      id,
      { title, courseName, questions, deadline },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    res.status(200).json({ message: 'Quiz updated successfully!', quiz: updatedQuiz });
  } catch (error) {
    console.error('Error updating quiz:', error);
    res.status(500).json({ message: 'Server error updating quiz.' });
  }
});

module.exports = router;
