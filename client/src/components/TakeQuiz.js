import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';

const TakeQuiz = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    // Fetch available quizzes for the student
    const fetchQuizzes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/quizzes/student', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`, // Include token for authentication
          },
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
      }
    };

    fetchQuizzes();
  }, []);

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmitQuiz = async () => {
    const submissionData = {
      quizId: selectedQuiz._id,
      answers,
    };

    try {
      const response = await axios.post(
        `http://localhost:5000/api/quizzes/${selectedQuiz._id}/submit`,
        submissionData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );
      alert(response.data.message);
      setSelectedQuiz(null); // Reset the selected quiz after submission
      setAnswers({});
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      {!selectedQuiz ? (
        <>
          <Typography variant="h4" gutterBottom>
            Available Quizzes
          </Typography>
          <Grid container spacing={3}>
            {quizzes.map((quiz) => (
              <Grid item xs={12} sm={6} md={4} key={quiz._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{quiz.courseName}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      {quiz.questions.length} questions
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => setSelectedQuiz(quiz)}
                      style={{ marginTop: '10px' }}
                    >
                      Take Quiz
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      ) : (
        <>
          <Typography variant="h4" gutterBottom>
            Quiz: {selectedQuiz.courseName}
          </Typography>
          {selectedQuiz.questions.map((question, index) => (
            <Card key={question._id} style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6">
                  Q{index + 1}: {question.questionText}
                </Typography>
                <RadioGroup
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                >
                  {question.options.map((option, idx) => (
                    <FormControlLabel
                      key={idx}
                      value={option}
                      control={<Radio />}
                      label={option}
                    />
                  ))}
                </RadioGroup>
              </CardContent>
            </Card>
          ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmitQuiz}
            style={{ marginTop: '20px' }}
          >
            Submit Quiz
          </Button>
        </>
      )}
    </Container>
  );
};

export default TakeQuiz;