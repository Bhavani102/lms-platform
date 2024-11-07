// src/components/CourseEnrollment.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';

const CourseEnrollment = () => {
  const [availableCourses, setAvailableCourses] = useState([]);

  // Fetch available courses on component mount
  useEffect(() => {
    const fetchAvailableCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses/available');
        setAvailableCourses(response.data);
      } catch (error) {
        console.error('Error fetching available courses:', error);
      }
    };

    fetchAvailableCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      // Placeholder action; replace this with actual enrollment logic when needed
      alert(`Enrolled in course with ID: ${courseId}`);
    } catch (error) {
      console.error('Error enrolling in course:', error);
      alert('Failed to enroll in course');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom>
        Enroll in Available Courses
      </Typography>
      <Grid container spacing={3}>
        {availableCourses.length > 0 ? (
          availableCourses.map(course => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" component="div">
                    {course.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {course.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEnroll(course._id)}
                    style={{ marginTop: '1rem' }}
                  >
                    Enroll
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No available courses to enroll in.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default CourseEnrollment;
