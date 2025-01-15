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
import StudentAssignments from './components/StudentAssignments';
import AdminAssignments from './components/AdminAssignment';
import FormBuilder from './components/FormBuilder';
import StudentQuizDashboard from './components/StudentQuizDashboard';
import LecturerSubmissions from './components/AdminSubmissions';
import AdminASubmissions from './components/AdminASubmissions';
import PlagiarismDetector from './components/PlagiarismDetector';
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
          <Route path="/student-assignments" element={<StudentAssignments />} />
          <Route path="/admin-assignments" element={<AdminAssignments />} />
           <Route path="/admin/post-quiz" element={<FormBuilder />} />
          <Route path="/quiz-submissions" element={<LecturerSubmissions />} />
          {/* <Route path="/student/quiz/:quizId" element={<TakeQuiz />} /> */}
          <Route path="/quiz-dashboard" element={<StudentQuizDashboard />} />
          <Route path="/assignment-submissions" element={<AdminASubmissions />} />
          <Route path="/plagiarism-detection" element={<PlagiarismDetector />} />
          
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
