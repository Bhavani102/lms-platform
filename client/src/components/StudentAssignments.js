import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissionTexts, setSubmissionTexts] = useState({});
  const [submissionFiles, setSubmissionFiles] = useState({});

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/assignments/student/enrolled-assignments', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
        setAssignments(response.data);
      } catch (error) {
        console.error('Error fetching assignments:', error);
      }
    };

    fetchAssignments();
  }, []);

  const handleTextChange = (assignmentId, text) => {
    setSubmissionTexts((prev) => ({ ...prev, [assignmentId]: text }));
  };

  const handleFileChange = (assignmentId, file) => {
    setSubmissionFiles((prev) => ({ ...prev, [assignmentId]: file }));
  };

  const handleSubmitAssignment = async (assignmentId) => {
    const formData = new FormData();
    formData.append('submissionText', submissionTexts[assignmentId] || '');
    if (submissionFiles[assignmentId]) {
      formData.append('submittedFile', submissionFiles[assignmentId]);
    }

    try {
      const response = await axios.post(
        `http://localhost:5000/api/assignments/${assignmentId}/submit`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert(response.data.message);
      setSubmissionTexts((prev) => ({ ...prev, [assignmentId]: '' }));
      setSubmissionFiles((prev) => ({ ...prev, [assignmentId]: null }));
    } catch (error) {
      console.error('Error submitting assignment:', error);
      alert('Failed to submit assignment');
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        My Assignments
      </Typography>
      <Grid container spacing={3}>
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <Grid item xs={12} sm={6} md={4} key={assignment._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{assignment.courseName}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    {assignment.assignmentText}
                  </Typography>
                  {assignment.assignmentFile && (
                    <a
                      href={`http://localhost:5000/${assignment.assignmentFile}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', margin: '10px 0' }}
                    >
                      View Assignment File
                    </a>
                  )}
                  <TextField
                    label="Submission Text"
                    multiline
                    rows={4}
                    fullWidth
                    value={submissionTexts[assignment._id] || ''}
                    onChange={(e) => handleTextChange(assignment._id, e.target.value)}
                    style={{ marginTop: '10px' }}
                  />
                  <input
                    type="file"
                    onChange={(e) => handleFileChange(assignment._id, e.target.files[0])}
                    style={{ marginTop: '10px' }}
                  />
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleSubmitAssignment(assignment._id)}
                    fullWidth
                  >
                    Submit Assignment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No assignments available at this moment.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default StudentAssignments;
