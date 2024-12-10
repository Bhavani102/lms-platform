const express = require('express');
const Quiz = require('../models/Quiz');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const mongoose = require("mongoose");
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
router.post('/:quizId/submit', authenticate, async (req, res) => {
  const { answers } = req.body; // answers: { questionId: studentAnswer }
  const { quizId } = req.params;
  const studentEmail = req.user.email;

  if (!answers || !quizId) {
    return res.status(400).json({ message: 'Answers and quiz ID are required.' });
  }

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found.' });
    }

    let totalScore = 0;

    // Loop through questions to calculate the score
    quiz.questions.forEach((question) => {
      const correctAnswer = question.correctAnswer; // Expected: [{ option: 'value', score: 'value' }]
      const studentAnswer = answers[question._id]; // Expected: ["value1", "value2"] or "value"

      console.log(
        `[DEBUG] Question ID: ${question._id}, Correct Answer: ${JSON.stringify(correctAnswer)}, Student Answer: ${JSON.stringify(studentAnswer)}`
      );

      if (question.answerType === "checkbox") {
        let partialScore = 0;

        // Validate if all student answers are valid options
        const correctOptionsSet = new Set(correctAnswer.map((item) => item.option));
        const hasInvalidAnswer = studentAnswer.some((answer) => !correctOptionsSet.has(answer));

        if (hasInvalidAnswer) {
          console.log(`[DEBUG] Invalid Answer Detected. Score for this question: 0`);
          return; // Skip scoring if any invalid answer is found
        }

        // Calculate partial score for valid answers
        correctAnswer.forEach((correctOption) => {
          console.log(
            `[DEBUG] Comparing Option: "${correctOption.option}" with Student Answers: ${JSON.stringify(studentAnswer)}`
          );

          const scoreValue = parseFloat(correctOption.score);

          if (
            studentAnswer.includes(correctOption.option) &&
            !isNaN(scoreValue) // Ensure score is a valid number
          ) {
            console.log(`[DEBUG] Match Found. Adding Score: ${scoreValue}`);
            partialScore += scoreValue;
          } else {
            console.log(`[DEBUG] No Match or Invalid Score`);
          }
        });

        console.log(`[DEBUG] Partial Score for Checkbox Question: ${partialScore}`);
        totalScore += partialScore; // Add the partial score for this question
      }

      // For radio or input types
      if (question.answerType === 'radio' || question.answerType === 'input') {
        console.log(
          `[DEBUG] Comparing Student Answer: "${studentAnswer}" with Correct Answer: "${correctAnswer}"`
        );

        if (
          typeof studentAnswer === 'string' &&
          typeof correctAnswer === 'string' &&
          studentAnswer.trim() === correctAnswer.trim()
        ) {
          console.log(`[DEBUG] Match Found. Adding Score: ${question.score || 1}`);
          totalScore += question.score || 1; // Default score is 1 if not specified
        } else {
          console.log(`[DEBUG] No Match for Radio/Input Question`);
        }
      }
    });

    // Save the submission with the calculated score
    quiz.submissions.push({
      studentEmail,
      answers,
      score: totalScore,
      submittedAt: new Date(),
    });

    await quiz.save();

    res.status(200).json({ message: 'Quiz submitted successfully!', score: totalScore });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ message: 'Server error while submitting quiz.' });
  }
});


// Fetch submissions for a quiz by student email
router.get('/:quizId/submissions', authenticate, async (req, res) => {
  const { quizId } = req.params;
  const { studentEmail } = req.query;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found." });
    }

    const submissions = studentEmail
      ? quiz.submissions.filter((submission) => submission.studentEmail === studentEmail)
      : quiz.submissions;

    res.status(200).json(submissions);
  } catch (error) {
    console.error("Error fetching submissions:", error);
    res.status(500).json({ message: "Server error fetching submissions." });
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



router.delete('/draft/:id', authenticate, async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid draft ID format." });
  }

  try {
    const deletedDraft = await Quiz.findByIdAndDelete(id);
    if (!deletedDraft) {
      return res.status(404).json({ message: "Draft not found." });
    }
    res.status(200).json({ message: "Draft deleted successfully!" });
  } catch (error) {
    console.error("Error deleting draft:", error);
    res.status(500).json({ message: "Server error deleting draft." });
  }
});

module.exports = router;
