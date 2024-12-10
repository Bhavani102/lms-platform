import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { Container, Typography, Card, CardContent, Button, Grid } from '@mui/material';

const MyCourses = () => {
  const { user } = useAuthContext();
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  useEffect(() => {
    if (user) {
      axios
        .get(`http://localhost:5000/api/courses/student/${user.email}/enrolled-content`)
        .then(response => setEnrolledCourses(response.data))
        .catch(error => console.error('Error fetching enrolled courses:', error));
    }
  }, [user]);

  const handleViewContent = (courseName) => {
    // Open the content page for the course in a new tab
    window.open(`/courses/${courseName}/content`, '_blank');
  };

  return (
    <Container maxWidth="lg">
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        align="center"
        sx={{
          marginTop: '2rem',
          marginBottom: '2rem',
        }}
      >
        My Courses
      </Typography>
      <Grid container spacing={3}>
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
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
                    onClick={() => handleViewContent(course.name)}
                    style={{ marginTop: '10px' }}
                  >
                    View Content
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No courses enrolled yet.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default MyCourses;
