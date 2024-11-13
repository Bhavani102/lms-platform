// server/models/Course.js
const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  students: [{ type: String }],
  content: [
    {
      type: { type: String, required: true },
      content: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Course', courseSchema);
