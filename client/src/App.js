import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import CreateCourse from './components/CourseCreation';
import CourseList from './components/CourseList';
import TakeQuiz from './components/TakeQuiz';
import QuizResults from './components/QuizResults';
import AdminDashboard from './components/AdminDashboard';
import Register from './components/Register';
import StudentDashboard from './components/StudentDashboard';
import CourseEnrollment from './components/CourseEnrollment';
import ManageCourses from './components/ManageCourses';
import MyCourses from './components/MyCourses';
import CourseContent from './components/CourseContent';
function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-course" element={<CreateCourse />} />
          <Route path="/courses" element={<CourseList />} />
          <Route path="/courses/:courseId/quiz" element={<TakeQuiz />} />
          <Route path="/courses/:courseId/results" element={<QuizResults />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/course-enrollment" element={<CourseEnrollment />} />
          <Route path="/manage-courses" element={<ManageCourses />} />
          <Route path="/my-courses" element={<MyCourses />} />
          <Route path="/courses/:courseName/content" element={<CourseContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
