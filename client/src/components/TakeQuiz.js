import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const TakeQuiz = () => {
  const { courseId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(null);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`/api/quizzes/course/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuiz(res.data);
        startTimer();
      } catch (error) {
        console.error('Error fetching quiz', error);
      }
    };
    fetchQuiz();

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [courseId]);

  const startTimer = () => {
    const id = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);
    setIntervalId(id);
  };

  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    if (currentQuestionIndex + 1 < quiz.questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (intervalId) clearInterval(intervalId);

    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `/api/quizzes/${quiz._id}/attempt`,
        { answers, timeTaken: timer },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScore(res.data.score);
    } catch (error) {
      console.error('Error submitting quiz', error);
    }
  };

  if (!quiz) return <div>Loading quiz...</div>;

  if (score !== null) {
    return (
      <div>
        <h2>Quiz Completed!</h2>
        <p>Your Score: {score} / {quiz.questions.length}</p>
        <p>Time Taken: {timer} seconds</p>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];

  return (
    <div>
      <h2>Quiz: {quiz.course.title}</h2>
      <h3>Question {currentQuestionIndex + 1}</h3>
      <p>{currentQuestion.questionText}</p>
      {currentQuestion.options.map((option, index) => (
        <button key={index} onClick={() => handleAnswer(option)}>
          {option}
        </button>
      ))}
      <div>Time Elapsed: {timer} seconds</div>
    </div>
  );
};

export default TakeQuiz;
