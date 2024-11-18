// server/models/Assignment.js
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  assignmentText: { type: String, required: false },
  postedBy: { type: String, required: true },
  assignmentFile: { type: String, required: false }, // Path to uploaded file
  postedDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Assignment', assignmentSchema);
