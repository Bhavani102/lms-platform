import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";

const StudentQuizDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState({});

  useEffect(() => {
    fetchQuizzes();
    return () => clearInterval(timer); // Clean up timer on unmount
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quizzes/student", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };

  const startQuiz = (quiz) => {
    const deadline = new Date(quiz.deadline).getTime();
    const now = new Date().getTime();

    if (now > deadline) {
      alert("This quiz has expired.");
      return;
    }

    setCurrentQuiz(quiz);
    setTimeRemaining(Math.floor((deadline - now) / 1000)); // Time in seconds
    const newTimer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(newTimer);
          alert("Time's up!");
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    setTimer(newTimer);
  };

  const handleAnswerChange = (questionId, value, type) => {
    setQuizAnswers((prevAnswers) => {
      if (type === "checkbox") {
        const currentAnswers = prevAnswers[questionId] || [];
        const updatedAnswers = currentAnswers.includes(value)
          ? currentAnswers.filter((answer) => answer !== value)
          : [...currentAnswers, value];
        return { ...prevAnswers, [questionId]: updatedAnswers };
      }
      return { ...prevAnswers, [questionId]: value };
    });
  };

  const handleSubmitQuiz = async () => {
    if (!currentQuiz) return;

    try {
      const response = await axios.post(
        `http://localhost:5000/api/quizzes/${currentQuiz._id}/submit`,
        { answers: quizAnswers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        }
      );
      alert(`Quiz submitted successfully! Your score: ${response.data.score}`);
      setCurrentQuiz(null);
      setQuizAnswers({});
      fetchQuizzes(); // Refresh available quizzes
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Failed to submit quiz. Please try again.");
    }
  };

  if (currentQuiz) {
    return (
      <Container maxWidth="md">
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ marginTop: "2rem", marginBottom: "2rem" }}
        >
          {currentQuiz.title}
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Time Remaining: {Math.floor(timeRemaining / 60)}:
          {String(timeRemaining % 60).padStart(2, "0")} minutes
        </Typography>
        {currentQuiz.questions.map((question, index) => (
          <Card key={question._id} style={{ marginBottom: "1rem" }}>
            <CardContent>
              <Typography variant="h6">
                Q{index + 1}: {question.questionText}
              </Typography>
              {question.answerType === "input" && (
                <input
                  type="text"
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                />
              )}
              {["radio", "checkbox"].includes(question.answerType) && (
                <div>
                  {question.options.map((option, idx) => (
                    <div key={idx}>
                      <label>
                        <input
                          type={question.answerType}
                          name={question._id}
                          value={option}
                          checked={
                            question.answerType === "checkbox"
                              ? quizAnswers[question._id]?.includes(option)
                              : quizAnswers[question._id] === option
                          }
                          onChange={(e) =>
                            handleAnswerChange(
                              question._id,
                              option,
                              question.answerType
                            )
                          }
                        />
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmitQuiz}
          style={{ marginTop: "1rem" }}
        >
          Submit Quiz
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ marginTop: "2rem", marginBottom: "2rem" }}
      >
        Available Quizzes
      </Typography>
      {quizzes.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          No quizzes available at the moment.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {quizzes.map((quiz) => (
            <Grid item xs={12} sm={6} md={4} key={quiz._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{quiz.title}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Course: {quiz.courseName}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Deadline: {new Date(quiz.deadline).toLocaleString()}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => startQuiz(quiz)}
                    style={{ marginTop: "1rem" }}
                  >
                    Start Quiz
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default StudentQuizDashboard;
