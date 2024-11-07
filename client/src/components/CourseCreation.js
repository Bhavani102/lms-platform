// src/components/CourseCreation.js
import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const CreateCourse = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructor, setInstructor] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/courses/create', {
        name,
        description,
        instructor,
      });
      alert('Course created successfully');
      setName('');
      setDescription('');
      setInstructor('');
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Create a New Course
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Course Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Description"
          variant="outlined"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          label="Instructor"
          variant="outlined"
          fullWidth
          margin="normal"
          value={instructor}
          onChange={(e) => setInstructor(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Create Course
        </Button>
      </form>
    </Container>
  );
};

export default CreateCourse;
