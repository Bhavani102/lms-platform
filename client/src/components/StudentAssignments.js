// src/components/StudentAssignments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { Container, Typography, Card, CardContent, Button, TextField } from '@mui/material';

const StudentAssignments = () => {
  const { user } = useAuthContext();
  const [assignments, setAssignments] = useState([]);
  const [submissionText, setSubmissionText] = useState('');
  const [submissionFile, setSubmissionFile] = useState(null);

  useEffect(() => {
    if (user && user.email) {
      axios.get(`http://localhost:5000/api/assignments/enrolled/${user.email}`)
        .then(response => setAssignments(response.data))
        .catch(error => console.error('Error fetching assignments:', error));
    }
  }, [user]);

  const handleSubmitAssignment = async (assignmentId) => {
    if (!user) return;

    const formData = new FormData();
    formData.append('studentEmail', user.email);
    formData.append('submissionText', submissionText);
    if (submissionFile) {
      formData.append('submittedFile', submissionFile);
    }

    try {
      const response = await axios.post(`http://localhost:5000/api/assignments/${assignmentId}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert(response.data.message);
      setSubmissionText('');
      setSubmissionFile(null);
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment');
    }
  };

  if (!user) {
    return <p>Loading user information...</p>;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h2" gutterBottom>Assignments</Typography>
      {assignments.map((assignment) => (
        <Card key={assignment._id} style={{ marginBottom: '1rem' }}>
          <CardContent>
            <Typography variant="h6">{assignment.courseName}</Typography>
            {assignment.assignmentText && <Typography>{assignment.assignmentText}</Typography>}
            {assignment.assignmentFile && (
              <a href={`http://localhost:5000/${assignment.assignmentFile}`} target="_blank" rel="noopener noreferrer">
                View Assignment File
              </a>
            )}
            <TextField
              label="Submission Text"
              multiline
              rows={4}
              fullWidth
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              style={{ marginTop: '1rem' }}
            />
            <input
              type="file"
              onChange={(e) => setSubmissionFile(e.target.files[0])}
              style={{ marginTop: '1rem' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSubmitAssignment(assignment._id)}
              style={{ marginTop: '1rem' }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
};

export default StudentAssignments;
