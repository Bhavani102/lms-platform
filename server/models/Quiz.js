const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseName: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      answerType: { type: String, enum: ['input', 'radio', 'checkbox'], required: true },
      options: [String], // For multiple-choice questions
      correctAnswer: mongoose.Schema.Types.Mixed, // Can be string or array depending on `answerType`
    },
  ],
  submissions: [
    {
      studentEmail: { type: String, required: true },
      answers: { type: Map, of: mongoose.Schema.Types.Mixed }, // Allows string or array values
      score: { type: Number },
      submittedAt: { type: Date, default: Date.now },
    },
  ],
  deadline: { type: Date, required: true },
  postedBy: { type: String, required: true },
  isDraft: { type: Boolean, default: false },
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = Quiz;
