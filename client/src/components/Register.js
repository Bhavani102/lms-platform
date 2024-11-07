// src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default to 'student'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send user data to backend for registration
      await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role });
      alert('Registration successful! Please log in.');
      
      // Redirect to Login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration failed', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        {/* Role Selection Dropdown */}
        <Select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          fullWidth
          margin="normal"
          variant="outlined"
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="admin">Admin</MenuItem>
        </Select>
        <Box mt={2}>
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Register
        </Button>
        </Box>
      </form>
    </Container>
  );
};

export default Register;
