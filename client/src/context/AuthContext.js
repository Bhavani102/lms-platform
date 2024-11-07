// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const setAuthToken = (token) => {
    if (token) {
      localStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const login = async (email, password, role) => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password, role });
      const { token, user } = response.data;

      setAuthToken(token);
      setUser(user);

      return user.role; // Return user's role for role-based navigation
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Invalid login credentials');
    }
  };

  const logout = () => {
    setAuthToken(null);
    setUser(null);
  };

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
