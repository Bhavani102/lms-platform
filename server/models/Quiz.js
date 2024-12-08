const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    courseIdentifier: {
      type: String,
      required: true, // If every quiz must have a course identifier
      unique: true,   // Ensure it is unique (optional, based on use case)
    },
    questions: [
      {
        questionText: {
          type: String,
          required: true,
        },
        options: {
          type: [String],
          validate: {
            validator: function (arr) {
              return arr.length > 0; // Ensure at least one option exists
            },
            message: 'A question must have at least one option.',
          },
        },
        correctAnswer: {
          type: String,
          required: true, // Ensure a correct answer is provided
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Quiz', QuizSchema);