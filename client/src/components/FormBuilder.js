import React, { useState, useEffect } from "react";
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
  const [courseName, setCourseName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [draftedQuizzes, setDraftedQuizzes] = useState([]);
  const [questions, setQuestions] = useState([
    {
      id: uuid(),
      questionText: "",
      answerType: "",
      options: [],
      correctAnswer: "",
    },
  ]);

  const fetchDrafts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/quizzes/drafts", {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });
      setDraftedQuizzes(response.data);
    } catch (error) {
      console.error("Error fetching drafted quizzes:", error);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, []);
 
  const formatISOToDatetimeLocal = (isoString) => {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  
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

  const handleSaveDraft = async () => {
    try {
      const quizData = {
        title,
        courseName,
        deadline,
        questions,
        isDraft: true,
      };

      const response = await axios.post("http://localhost:5000/api/quizzes/save", quizData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      alert("Quiz saved as draft successfully!");
      fetchDrafts(); // Refresh drafts
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save quiz as draft. Please try again.");
    }
  };

  const handlePostQuiz = async () => {
    try {
      const quizData = {
        title,
        courseName,
        deadline,
        questions,
        isDraft: false,
      };

      const response = await axios.post("http://localhost:5000/api/quizzes/post", quizData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      alert("Quiz posted successfully!");
      fetchDrafts(); // Refresh drafts
    } catch (error) {
      console.error("Error posting quiz:", error);
      alert("Failed to post quiz. Please try again.");
    }
  };

  const handleEditDraft = (quiz) => {
    setTitle(quiz.title);
    setCourseName(quiz.courseName);
    setDeadline(formatISOToDatetimeLocal(quiz.deadline));
    setQuestions(quiz.questions.map((q) => ({ ...q, id: uuid() }))); // Add unique IDs for editing
  };

  return (
    <Container maxWidth="md">
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
        Create or Edit Quiz
      </Typography>

      {/* New Quiz Form */}
      <TextField
        label="Quiz Title"
        variant="outlined"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Course Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
      />
      <TextField
        label="Deadline"
        type="datetime-local"
        variant="outlined"
        fullWidth
        margin="normal"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        InputLabelProps={{
          shrink: true,
        }}
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
        Add Question
      </Button>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleSaveDraft}
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        Save Draft
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handlePostQuiz}
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        Post Quiz
      </Button>

      {/* Drafted Quizzes */}
      <Typography variant="h5" gutterBottom style={{ marginTop: "2rem" }}>
        Drafted Quizzes
      </Typography>
      {draftedQuizzes.map((quiz) => (
        <Card key={quiz._id} style={{ marginBottom: "1rem" }}>
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
              onClick={() => handleEditDraft(quiz)}
              style={{ marginTop: "1rem" }}
            >
              Edit Quiz
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default FormBuilder;
