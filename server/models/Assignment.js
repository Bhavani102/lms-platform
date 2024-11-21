const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  assignmentText: { type: String },
  assignmentFile: { type: String },
  postedBy: { type: String, required: true },
  deadline: { type: Date, required: true },
  submissions: [
    {
      studentEmail: { type: String, required: true },
      submittedText: { type: String },
      submittedFile: { type: String },
      submittedAt: { type: Date, default: Date.now },
    },
  ],
});

const Assignment = mongoose.model('Assignment', assignmentSchema);
module.exports = Assignment;
