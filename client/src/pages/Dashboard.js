// src/pages/Dashboard.js
import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h2>Welcome to the Dashboard, {user?.name}</h2>
      <p>Explore courses and quizzes to enhance your skills!</p>
    </div>
  );
};

export default Dashboard;
