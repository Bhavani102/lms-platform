const express = require('express');
const multer = require('multer');
const path = require('path');
const authenticate = require('../middleware/authenticate');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/assignments'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Admin posts a new assignment
router.post('/post', authenticate, upload.single('assignmentFile'), async (req, res) => {
  try {
    const { courseName, assignmentText, deadline } = req.body;
    const postedBy = req.user.name;
    const assignmentFile = req.file?.path;

    if (!courseName || !deadline) {
      return res.status(400).json({ message: 'courseName and deadline are required.' });
    }

    const assignment = new Assignment({
      courseName,
      assignmentText,
      assignmentFile,
      postedBy,
      deadline,
    });

    await assignment.save();
    res.status(201).json({ message: 'Assignment posted successfully!' });
  } catch (error) {
    console.error('Error posting assignment:', error);
    res.status(500).json({ message: 'Server error while posting assignment.' });
  }
});

// Fetch assignments for enrolled courses
router.get('/student/enrolled-assignments', authenticate, async (req, res) => {
  const studentEmail = req.user.email;

  try {
    // Find courses where the student is enrolled
    const enrolledCourses = await Course.find({ students: studentEmail });

    // Fetch assignments for those courses
    const assignments = await Assignment.find({
      courseName: { $in: enrolledCourses.map((course) => course.name) },
    });

    res.status(200).json(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).json({ message: 'Server error fetching assignments.' });
  }
});

// Submit an assignment
router.post('/:assignmentId/submit', authenticate, upload.single('submittedFile'), async (req, res) => {
  const { assignmentId } = req.params;
  const { submissionText } = req.body;
  const submittedFile = req.file?.path;
  const studentEmail = req.user.email;

  try {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found.' });
    }

    // Check if already submitted
    const alreadySubmitted = assignment.submissions.some(
      (submission) => submission.studentEmail === studentEmail
    );
    if (alreadySubmitted) {
      return res.status(400).json({ message: 'Assignment already submitted.' });
    }

    assignment.submissions.push({
      studentEmail,
      submittedText: submissionText,
      submittedFile,
      submittedAt: new Date(),
    });

    await assignment.save();
    res.status(200).json({ message: 'Assignment submitted successfully!' });
  } catch (error) {
    console.error('Error submitting assignment:', error);
    res.status(500).json({ message: 'Server error while submitting assignment.' });
  }
});

module.exports = router;


// const express = require('express');
// const multer = require('multer');
// const path = require('path');
// const Assignment = require('../models/Assignment');
// const Course = require('../models/Course');
// const authenticate = require('../middleware/authenticate');
// const router = express.Router();

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, '../uploads/assignments'));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });
// const upload = multer({ storage });

// // Admin posts a new assignment
// router.post('/post', authenticate, upload.single('assignmentFile'), async (req, res) => {
//   const { courseName, assignmentText, deadline } = req.body;
//   const postedBy = req.user.name; // Ensure req.user is set by the authenticate middleware
//   const assignmentFile = req.file?.path;

//   try {
//     if (!courseName || !deadline) {
//       return res.status(400).json({ message: 'courseName and deadline are required.' });
//     }

//     const assignment = new Assignment({
//       courseName,
//       assignmentText,
//       assignmentFile,
//       postedBy,
//       deadline,
//     });

//     await assignment.save();
//     res.status(201).json({ message: 'Assignment posted successfully!' });
//   } catch (error) {
//     console.error('Error posting assignment:', error);
//     res.status(500).json({ message: 'Server error while posting assignment.' });
//   }
// });


// // Fetch assignments for a student
// router.get('/enrolled/:studentEmail', authenticate, async (req, res) => {
//   const { studentEmail } = req.params;

//   try {
//     // Find courses where the student is enrolled
//     const enrolledCourses = await Course.find({ students: studentEmail });

//     // Fetch assignments for those courses
//     const assignments = await Assignment.find({
//       courseName: { $in: enrolledCourses.map((course) => course.name) },
//     });

//     res.status(200).json(assignments);
//   } catch (error) {
//     console.error('Error fetching assignments:', error);
//     res.status(500).json({ message: 'Server error fetching assignments' });
//   }
// });

// // Submit assignment
// router.post('/:assignmentId/submit', authenticate, upload.single('submittedFile'), async (req, res) => {
//   const { assignmentId } = req.params;
//   const { submissionText } = req.body;
//   const submittedFile = req.file?.path;
//   const studentEmail = req.user.email;

//   try {
//     const assignment = await Assignment.findById(assignmentId);

//     if (!assignment) {
//       return res.status(404).json({ message: 'Assignment not found.' });
//     }

//     // Check if already submitted
//     const alreadySubmitted = assignment.submissions.some(
//       (submission) => submission.studentEmail === studentEmail
//     );
//     if (alreadySubmitted) {
//       return res.status(400).json({ message: 'Assignment already submitted.' });
//     }

//     assignment.submissions.push({
//       studentEmail,
//       submittedText: submissionText,
//       submittedFile,
//     });

//     await assignment.save();
//     res.status(200).json({ message: 'Assignment submitted successfully!' });
//   } catch (error) {
//     console.error('Error submitting assignment:', error);
//     res.status(500).json({ message: 'Server error while submitting assignment.' });
//   }
// });

// router.get('/admin-courses', authenticate, async (req, res) => {
//   try {
//     const courses = await Course.find({ instructor: req.user.name });
//     res.status(200).json(courses);
//   } catch (error) {
//     console.error('Error fetching admin courses:', error);
//     res.status(500).json({ message: 'Server error fetching admin courses' });
//   }
// });
