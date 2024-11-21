import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
} from '@mui/material';

const AdminAssignments = () => {
  const { user } = useAuthContext();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);
  const [deadline, setDeadline] = useState('');

  useEffect(() => {
    // Fetch courses created by the admin
    axios.get('http://localhost:5000/api/courses/admin-courses', {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    })
      .then((response) => setCourses(response.data))
      .catch((error) => console.error('Error fetching courses:', error));
  }, []);

  const handlePostAssignment = async () => {
    const formData = new FormData();
    formData.append('courseName', selectedCourse);
    formData.append('assignmentText', assignmentText);
    formData.append('deadline', deadline);
    if (assignmentFile) {
      formData.append('assignmentFile', assignmentFile);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/assignments/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      alert(response.data.message);
      setAssignmentText('');
      setAssignmentFile(null);
      setDeadline('');
    } catch (error) {
      console.error('Error posting assignment:', error);
      alert('Failed to post assignment');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Post Assignments
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            fullWidth
            variant="outlined"
          >
            <MenuItem value="">Select Course</MenuItem>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course.name}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Assignment Text"
            value={assignmentText}
            onChange={(e) => setAssignmentText(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Deadline"
            type="datetime-local"
            InputLabelProps={{ shrink: true }}
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <input
            type="file"
            onChange={(e) => setAssignmentFile(e.target.files[0])}
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostAssignment}
            fullWidth
          >
            Post Assignment
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminAssignments;
