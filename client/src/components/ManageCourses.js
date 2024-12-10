import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [contentType, setContentType] = useState('pdf');
  const [pdfFile, setPdfFile] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/courses/admin-courses', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Token from localStorage
          },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
  
    fetchCourses();
  }, []);

  const handleAddContent = async (courseName) => {
    const formData = new FormData();
    formData.append('type', contentType);
    if (contentType === 'pdf' && pdfFile) {
      formData.append('pdfFile', pdfFile);
    }

    try {
      await axios.post(`http://localhost:5000/api/courses/${courseName}/content`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Content added successfully!');
      setPdfFile(null);
    } catch (error) {
      console.error('Error adding content:', error);
      alert('Failed to add content. Please try again.');
    }
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
        Manage your Courses
      </Typography>
      <Grid container spacing={3}>
        {courses.length > 0 ? (
          courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{course.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {course.description}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Add Content
                  </Typography>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files[0])}
                    style={{ display: contentType === 'pdf' ? 'block' : 'none' }}
                  />
                  <Select
                    value={contentType}
                    onChange={(e) => setContentType(e.target.value)}
                    fullWidth
                    variant="outlined"
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="video">Video</MenuItem>
                  </Select>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleAddContent(course.name)}
                    fullWidth
                    style={{ marginTop: '10px' }}
                  >
                    Add Content
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No courses available to manage.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ManageCourses;
