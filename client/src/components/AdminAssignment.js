// src/components/AdminAssignments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';

const AdminAssignments = () => {
  const { user } = useAuthContext();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignmentText, setAssignmentText] = useState('');
  const [assignmentFile, setAssignmentFile] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/available')
      .then(response => setCourses(response.data))
      .catch(error => console.error('Error fetching courses:', error));
  }, []);

  const handlePostAssignment = async () => {
    if (!user || !user.name) {
        alert("User not logged in or user information is missing.");
        return;
      }
    const formData = new FormData();
    formData.append('courseName', selectedCourse);
    formData.append('assignmentText', assignmentText);
    formData.append('postedBy', user.name);
    if (assignmentFile) {
      formData.append('assignmentFile', assignmentFile);
    }

    try {
      const response = await axios.post('http://localhost:5000/api/assignments/post', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      setAssignmentText('');
      setAssignmentFile(null);
    } catch (error) {
      console.error('Error posting assignment:', error);
      alert('Failed to post assignment');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" marginTop={4}>
        Post Assignment
      </Typography>
      <Box component="form" noValidate autoComplete="off" mt={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              fullWidth
              variant="outlined"
              displayEmpty
            >
              <MenuItem value="" disabled>Select Course</MenuItem>
              {courses.map(course => (
                <MenuItem key={course._id} value={course.name}>{course.name}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Assignment Text"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              value={assignmentText}
              onChange={(e) => setAssignmentText(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              component="label"
              fullWidth
              color="primary"
            >
              Upload File
              <input
                type="file"
                hidden
                onChange={(e) => setAssignmentFile(e.target.files[0])}
              />
            </Button>
            {assignmentFile && <Typography variant="body2" color="textSecondary" mt={1}>{assignmentFile.name}</Typography>}
          </Grid>
          <Grid item xs={12} mt={2}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handlePostAssignment}
            >
              Post Assignment
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default AdminAssignments;
