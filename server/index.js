// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
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

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/courses', courseRoutes); // Course-related routes
app.use('/api/enrollments', enrollmentRoutes);

app.use('/api/assignments', assignmentRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
