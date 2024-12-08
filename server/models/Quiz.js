const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  answerType: { type: String, required: true }, // "radio", "checkbox", "input"
});

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  courseName: { type: String, required: true },
  postedBy: { type: String, required: true }, // Lecturer name
  questions: [questionSchema],
  isDraft: { type: Boolean, default: true },
  deadline: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Quiz', quizSchema);
