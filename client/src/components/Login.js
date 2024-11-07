import React, { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useNavigate, Link } from 'react-router-dom';
import Box from '@mui/material/Box';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student'); // Default role
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Pass email, password, and role to login function
      const userRole = await login(email, password, role);

      // Check the returned role and navigate accordingly
      if (userRole === 'admin' && role === 'admin') {
        navigate('/admin-dashboard');
      } else if (userRole === 'student' && role === 'student') {
        navigate('/student-dashboard');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
      alert('Invalid credentials. Please check your email, password, and role.');
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login 
      </Typography>
      <form onSubmit={handleSubmit}>
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
            Login
          </Button>
        </Box>
        
      </form>
      <Typography variant="body2" align="center" style={{ marginTop: '1rem' }}>
        New user? <Link to="/register">Register here</Link>
      </Typography>
    </Container>
  );
};

export default Login;
