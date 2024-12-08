import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const FormBuilder = () => {
  const [title, setTitle] = useState("");
  const [forms, setForms] = useState([
    {
      id: uuid(),
      questions: [
        {
          id: uuid(),
          questionText: "",
          options: [],
          correctAnswer: "",
          answerType: "",
        },
      ],
    },
  ]);

  const [showSaveButton, setShowSaveButton] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: uuid(),
      questionText: "",
      answerType: "",
      options: [],
      correctAnswer: "",
    },
  ]);

  const handleQuestionTextChange = (questionId, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId ? { ...question, questionText: value } : question
      )
    );
  };

  const handleAnswerTypeChange = (questionId, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? { ...question, answerType: value, options: [], correctAnswer: "" }
          : question
      )
    );
  };

  const handleOptionChange = (questionId, optionIndex, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? {
              ...question,
              options: question.options.map((option, index) =>
                index === optionIndex ? value : option
              ),
            }
          : question
      )
    );
  };

  const handleCorrectAnswerChange = (questionId, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId ? { ...question, correctAnswer: value } : question
      )
    );
  };

  const handleAddOption = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((question) =>
        question.id === questionId
          ? { ...question, options: [...question.options, ""] }
          : question
      )
    );
  };

  const handleAddQuestion = () => {
    setQuestions((prevQuestions) => [
      ...prevQuestions,
      {
        id: uuid(),
        questionText: "",
        answerType: "",
        options: [],
        correctAnswer: "",
      },
    ]);
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions((prevQuestions) =>
      prevQuestions.filter((question) => question.id !== questionId)
    );
  };

  const handleCopyQuestion = (questionId) => {
    const copiedQuestion = {
      ...questions.find((question) => question.id === questionId),
      id: uuid(),
    };
    setQuestions((prevQuestions) => [...prevQuestions, copiedQuestion]);
  };

  const handleSaveForm = async () => {
    // Extracting relevant quiz data from the state
    const quizData = {
      courseIdentifier: "CS101", // Replace with dynamic course identifier if needed
      questions: forms[0].questions.map((question) => ({
        questionText: question.questionText,
        options: question.options,
        correctAnswer: question.correctAnswer, // Include correctAnswer field if needed
      })),
    };
  
    try {
      const response = await axios.post("http://localhost:5000/api/quizzes", quizData, {
        headers: { "Content-Type": "application/json" },
      });
      alert("Quiz saved successfully!");
      setShowSaveButton(true);
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Failed to save quiz. Please try again.");
    }
  };
  

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Create Quiz
      </Typography>
      <TextField
        label="Quiz Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((question, index) => (
        <Card key={question.id} style={{ marginBottom: "1rem" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Question {index + 1}
            </Typography>
            <TextField
              label="Question Text"
              variant="outlined"
              fullWidth
              margin="normal"
              value={question.questionText}
              onChange={(e) =>
                handleQuestionTextChange(question.id, e.target.value)
              }
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Answer Type</InputLabel>
              <Select
                value={question.answerType}
                onChange={(e) =>
                  handleAnswerTypeChange(question.id, e.target.value)
                }
              >
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="input">Input</MenuItem>
                <MenuItem value="checkbox">Checkbox</MenuItem>
                <MenuItem value="radio">Radio</MenuItem>
              </Select>
            </FormControl>
            {["checkbox", "radio"].includes(question.answerType) && (
              <>
                {question.options.map((option, idx) => (
                  <Grid container spacing={1} key={idx} alignItems="center">
                    <Grid item xs={10}>
                      <TextField
                        label={`Option ${idx + 1}`}
                        variant="outlined"
                        fullWidth
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(question.id, idx, e.target.value)
                        }
                      />
                    </Grid>
                  </Grid>
                ))}
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={() => handleAddOption(question.id)}
                  style={{ marginTop: "1rem" }}
                >
                  Add Option
                </Button>
              </>
            )}
            <TextField
              label="Correct Answer"
              variant="outlined"
              fullWidth
              margin="normal"
              value={question.correctAnswer}
              onChange={(e) =>
                handleCorrectAnswerChange(question.id, e.target.value)
              }
            />
            <Grid container spacing={2}>
              <Grid item>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<DeleteIcon />}
                  onClick={() => handleDeleteQuestion(question.id)}
                >
                  Delete
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<FileCopyIcon />}
                  onClick={() => handleCopyQuestion(question.id)}
                >
                  Copy
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={handleAddQuestion}
        style={{ marginTop: "1rem" }}
      >
        Add New Question
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSaveForm}
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        Save Quiz
      </Button>
    </Container>
  );
};

export default FormBuilder;