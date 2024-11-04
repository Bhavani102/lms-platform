// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to set the token and manage axios headers
  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Login function to authenticate and fetch user data
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { token, user } = response.data;
      
      // Set token and user data
      setAuthToken(token);
      setUser(user);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid login credentials');
    }
  };

  // Logout function to clear token and user data
  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

  // Check for existing token on mount and fetch user data
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setAuthToken(token);
      axios.get('http://localhost:5000/api/auth/user')
        .then((res) => setUser(res.data))
        .catch((error) => {
          console.error('Failed to fetch user data:', error);
          logout();
        });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
