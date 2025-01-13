import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Card,
  CardContent,
} from '@mui/material';

const AdminSubmissions = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [submission, setSubmission] = useState(null);

  // Fetch all courses created by the admin
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/quizzes', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        params: { courseName: selectedCourse },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/students', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        params: { courseName: selectedCourse },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSubmission = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/admin/submissions`,
        {
          params: { quizId: selectedQuiz, studentEmail: selectedStudent },
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );
      setSubmission(response.data);
    } catch (error) {
      console.error('Error fetching submission:', error);
      alert('Failed to fetch submission.');
    }
  };

  const handleExportScores = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/quizzes/${selectedCourse}/quiz-scores`,
        {
          params: { quizId: selectedQuiz },
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );

      // Trigger download of the Excel file
      const link = document.createElement('a');
      link.href = `http://localhost:5000/${response.data.filePath}`;
      link.download = `${selectedCourse}-quiz-scores.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Quiz scores exported successfully!');
    } catch (error) {
      console.error('Error exporting quiz scores:', error);
      alert('Failed to export quiz scores.');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{ marginTop: '2rem', marginBottom: '2rem' }}
      >
        View Submissions
      </Typography>

      {/* Course Selection */}
      <Select
        value={selectedCourse}
        onChange={(e) => {
          setSelectedCourse(e.target.value);
          setSelectedQuiz('');
          setStudents([]);
          setSubmission(null);
        }}
        fullWidth
        displayEmpty
        style={{ marginBottom: '1rem' }}
      >
        <MenuItem value="" disabled>
          Select Course
        </MenuItem>
        {courses.map((course) => (
          <MenuItem key={course._id} value={course.name}>
            {course.name}
          </MenuItem>
        ))}
      </Select>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchQuizzes}
        disabled={!selectedCourse}
        style={{ marginBottom: '1rem' }}
      >
        Fetch Quizzes
      </Button>

      {/* Quiz Selection */}
      {quizzes.length > 0 && (
        <Select
          value={selectedQuiz}
          onChange={(e) => {
            setSelectedQuiz(e.target.value);
            setSubmission(null);
          }}
          fullWidth
          displayEmpty
          style={{ marginBottom: '1rem' }}
        >
          <MenuItem value="" disabled>
            Select Quiz
          </MenuItem>
          {quizzes.map((quiz) => (
            <MenuItem key={quiz._id} value={quiz._id}>
              {quiz.title}
            </MenuItem>
          ))}
        </Select>
      )}
      <Button
        variant="contained"
        color="secondary"
        onClick={handleExportScores}
        disabled={!selectedQuiz}
        fullWidth
        style={{ marginBottom: '1rem' }}
      >
        Print Scores to Excel
      </Button>

      {/* Fetch Submission Section */}
      <Typography variant="h5" component="h2" gutterBottom>
        Fetch Submission of a Particular Student
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={fetchStudents}
        disabled={!selectedQuiz}
        style={{ marginBottom: '1rem' }}
      >
        Fetch Students
      </Button>

      {/* Student Selection */}
      {students.length > 0 && (
        <Select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          fullWidth
          displayEmpty
          style={{ marginBottom: '1rem' }}
        >
          <MenuItem value="" disabled>
            Select Student
          </MenuItem>
          {students.map((student) => (
            <MenuItem key={student.email} value={student.email}>
              {student.name} ({student.email})
            </MenuItem>
          ))}
        </Select>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={fetchSubmission}
        disabled={!selectedStudent}
        style={{ marginBottom: '1rem' }}
      >
        Fetch Submission
      </Button>

      {/* Display Submission */}
      {submission && (
        <Card style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="h6">Score: {submission.score}</Typography>
            <Typography variant="body2" color="textSecondary">
              Submitted At: {new Date(submission.submittedAt).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Answers: {JSON.stringify(submission.answers)}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default AdminSubmissions;
