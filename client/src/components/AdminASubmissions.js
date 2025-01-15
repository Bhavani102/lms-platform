import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
} from '@mui/material';

const AdminASubmissions = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [submissions, setSubmissions] = useState([]);

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  // Fetch students enrolled in a course
  const fetchStudents = async () => {
    if (!selectedCourse) {
      alert('Please select a course first.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/admin/${selectedCourse}/students`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
      alert('Failed to fetch students.');
    }
  };
  

  // Fetch submissions for the selected student
  const fetchSubmissions = async () => {
    if (!selectedStudent || !selectedCourse) {
      alert('Please select a course and a student.');
      return;
    }
    try {
      const response = await axios.get(`http://localhost:5000/api/assignments/${selectedCourse}/submissions`, {
        params: { studentEmail: selectedStudent },
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
      });
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      alert('Failed to fetch submissions.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Assignment Submissions
      </Typography>
      <Typography variant="h6" gutterBottom>
        Select a Course
      </Typography>
      <Select
        value={selectedCourse}
        onChange={(e) => setSelectedCourse(e.target.value)}
        fullWidth
        displayEmpty
      >
        <MenuItem value="">Select Course</MenuItem>
        {courses.map((course) => (
          <MenuItem key={course.name} value={course.name}>
            {course.name}
          </MenuItem>
        ))}
      </Select>
      <Button variant="contained" color="primary" onClick={fetchStudents} style={{ marginTop: '20px' }}>
        Fetch Students
      </Button>

      {students.length > 0 && (
        <>
          <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
            Select a Student
          </Typography>
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            fullWidth
            displayEmpty
          >
            <MenuItem value="">Select Student</MenuItem>
            {students.map((student, index) => (
              <MenuItem key={index} value={student.email}>
                {student.name} ({student.email})
              </MenuItem>
            ))}
          </Select>
          <Button
            variant="contained"
            color="secondary"
            onClick={fetchSubmissions}
            style={{ marginTop: '20px' }}
          >
            Fetch Submissions
          </Button>
        </>
      )}

      <Grid container spacing={3} style={{ marginTop: '20px' }}>
        {submissions.length > 0 ? (
          submissions.map((submission, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{submission.studentName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Submitted at: {new Date(submission.submittedAt).toLocaleString()}
                  </Typography>
                  {submission.submittedFile && (
                    <a
                      href={`http://localhost:5000/${submission.submittedFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', marginTop: '10px' }}
                    >
                      View Submission File
                    </a>
                  )}
                  <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    {submission.submittedText}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary" style={{ marginTop: '20px' }}>
            No submissions available for this course or student.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default AdminASubmissions;
