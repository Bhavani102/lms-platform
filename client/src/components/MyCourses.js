// src/components/MyCourses.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseContent, setSelectedCourseContent] = useState([]);

  useEffect(() => {
    // Fetch enrolled courses (assuming this returns courses a student is enrolled in)
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses/enrolled'); // Replace with actual endpoint
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };

    fetchCourses();
  }, []);

  const fetchCourseContent = async (courseName) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/courses/${courseName}/content`);
      setSelectedCourseContent(response.data);
    } catch (error) {
      console.error('Error fetching course content:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        My Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.name}>
            <Card>
              <CardContent>
                <Typography variant="h6">{course.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {course.description}
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => fetchCourseContent(course.name)}
                  style={{ marginTop: '10px' }}
                >
                  View Content
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Container maxWidth="md" style={{ marginTop: '20px' }}>
        <Typography variant="h5">Course Content</Typography>
        {selectedCourseContent.length >= 0 ? (
          selectedCourseContent.map((content, index) => (
            <div key={index}>
              <Typography variant="body1">{content.type}</Typography>
              {content.type === 'pdf' ? (
                <a href={`http://localhost:5000/${content.content}`} target="_blank" rel="noopener noreferrer">
                  View PDF
                </a>
              ) : (
                <Typography variant="body2">{content.content}</Typography>
              )}
            </div>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            No content available for this course.
          </Typography>
        )}
      </Container>
    </Container>
  );
};

export default MyCourses;
