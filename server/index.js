// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const quizRoutes = require('./routes/quizRoutes'); 
const authenticate = require('./middleware/authenticate');
const path = require('path');

dotenv.config();
const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from localhost:3000
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow these headers
}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Middleware for JSON parsing
app.use(express.json());

// Handle preflight requests for all routes
app.options('*', cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

console.log("Loading routes...");
try {
  app.use('/api/auth', authRoutes);
  console.log("Auth routes loaded successfully");
  
  app.use('/api/courses', courseRoutes);
  console.log("Course routes loaded successfully");

  app.use('/api/enrollments', enrollmentRoutes);
  console.log("Enrollment routes loaded successfully");

  app.use('/api/assignments', assignmentRoutes);
  console.log("Assignment routes loaded successfully");

  app.use('/api/quizzes',quizRoutes);
  console.log("Quiz routes loaded succesfully");
} catch (error) {
  console.error("Error loading routes:", error.message);
}

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
