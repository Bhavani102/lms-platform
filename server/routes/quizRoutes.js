const express = require('express');
const Quiz = require('../models/Quiz');
const { verifyToken, isInstructor } = require('../middleware/authMiddleware');
const QuizAttempt = require('../models/QuizAttempt');
const router = express.Router();

router.post('/:quizId/attempt', verifyToken, async (req, res) => {
    const { quizId } = req.params;
    const { answers, timeTaken } = req.body;
  
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
  
      // Calculate score
      let score = 0;
      quiz.questions.forEach((question, index) => {
        if (question.correctAnswer === answers[index]) {
          score++;
        }
      });
  
      const attempt = new QuizAttempt({
        student: req.user.id,
        quiz: quizId,
        score,
        totalQuestions: quiz.questions.length,
        timeTaken,
      });
      await attempt.save();
  
      res.status(201).json({ message: 'Quiz attempt saved', score });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  // Get quiz attempts for a student
  router.get('/:quizId/attempts', verifyToken, async (req, res) => {
    const { quizId } = req.params;
  
    try {
      const attempts = await QuizAttempt.find({ quiz: quizId, student: req.user.id });
      res.status(200).json(attempts);
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  });
  
  module.exports = router;

