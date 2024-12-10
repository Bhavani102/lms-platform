import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Container, Typography, Card, CardContent, Button, TextField } from "@mui/material";

const QuizTimer = ({ deadline, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const remainingTime = new Date(deadline) - now;
      if (remainingTime <= 0) {
        clearInterval(timer);
        setTimeLeft("Time is up!");
        onTimeUp();
      } else {
        const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
        setTimeLeft(`${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline, onTimeUp]);

  return (
    <Typography variant="h6" color="error">
      Time Remaining: {timeLeft}
    </Typography>
  );
};

const TakeQuiz = () => {
  const { quizId } = useParams(); // Assuming quizId is passed as a route parameter
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/quizzes/${quizId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setQuiz(response.data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const handleAnswerChange = (questionId, value) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: value,
    }));
  };

  const handleSubmitQuiz = async () => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/quizzes/${quizId}/submit`,
        { answers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      alert(response.data.message);
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  const handleTimeUp = () => {
    if (!isSubmitted) {
      alert("Time is up! Your quiz will be auto-submitted.");
      handleSubmitQuiz();
    }
  };

  if (!quiz) {
    return <Typography>Loading quiz...</Typography>;
  }

  return (
    <Container>
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
        {quiz.title}
      </Typography>
      <QuizTimer deadline={quiz.deadline} onTimeUp={handleTimeUp} />
      {quiz.questions.map((question, index) => (
        <Card key={question._id} style={{ marginBottom: "1rem" }}>
          <CardContent>
            <Typography variant="h6">
              Question {index + 1}: {question.questionText}
            </Typography>
            {["radio", "checkbox"].includes(question.answerType) ? (
              question.options.map((option, idx) => (
                <div key={idx}>
                  <label>
                    <input
                      type={question.answerType}
                      name={question._id}
                      value={option}
                      onChange={(e) =>
                        handleAnswerChange(question._id, e.target.value)
                      }
                    />
                    {option}
                  </label>
                </div>
              ))
            ) : (
              <TextField
                fullWidth
                variant="outlined"
                label="Your Answer"
                value={answers[question._id] || ""}
                onChange={(e) =>
                  handleAnswerChange(question._id, e.target.value)
                }
              />
            )}
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitQuiz}
        disabled={isSubmitted}
      >
        Submit Quiz
      </Button>
    </Container>
  );
};

export default TakeQuiz;
