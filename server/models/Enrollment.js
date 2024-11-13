// server/models/Enrollment.js
const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
  studentEmail: {
    type: String,
    required: true,
  },
  courseName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Enrollment', enrollmentSchema);
