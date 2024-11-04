import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const QuizResults = () => {
  const { courseId } = useParams();
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`/api/quizzes/course/${courseId}/results`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizResults(res.data);
      } catch (error) {
        console.error('Error fetching quiz results', error);
      }
    };
    fetchQuizResults();
  }, [courseId]);

  if (!quizResults) return <div>Loading results...</div>;

  return (
    <div>
      <h2>Quiz Results for Course: {quizResults.course.title}</h2>
      <ul>
        {quizResults.results.map((result, index) => (
          <li key={index}>{result.student.name}: {result.score} / {result.totalQuestions}</li>
        ))}
      </ul>
    </div>
  );
};

export default QuizResults;