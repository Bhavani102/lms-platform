const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true,
  },
  questions: [
    {
      questionText: String,
      options: [String],
      correctAnswer: String,
    },
  ],
}, { timestamps: true });

module.exports = mongoose.model('Quiz', QuizSchema);