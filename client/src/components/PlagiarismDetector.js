import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
  CircularProgress,
} from '@mui/material';

const PlagiarismDetector = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [plagiarismResults, setPlagiarismResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/admin/courses', {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      }
    };
    fetchCourses();
  }, []);

  const fetchAssignments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/assignments', {
        headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        params: { courseName: selectedCourse },
      });
      setAssignments(response.data);
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };

  const handlePlagiarismCheck = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/plagiarism/plagiarism-check',
        { assignmentId: selectedAssignment },
        { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
      );
      setPlagiarismResults(response.data);
    } catch (error) {
      console.error('Error checking plagiarism:', error);
      alert('Failed to check plagiarism.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportToExcel = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/plagiarism/plagiarism-export/${selectedAssignment}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        }
      );

      const link = document.createElement('a');
      link.href = `http://localhost:5000/${response.data.filePath}`;
      link.download = 'PlagiarismReport.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert('Plagiarism report exported successfully!');
    } catch (error) {
      console.error('Error exporting plagiarism report:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" gutterBottom>
        Plagiarism Detector
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Select Course</Typography>
          <Select
            value={selectedCourse}
            onChange={(e) => {
              setSelectedCourse(e.target.value);
              setAssignments([]);
              setSelectedAssignment('');
              setPlagiarismResults([]);
            }}
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Course
            </MenuItem>
            {courses.map((course) => (
              <MenuItem key={course._id} value={course.name}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button
            variant="contained"
            color="primary"
            onClick={fetchAssignments}
            disabled={!selectedCourse}
            fullWidth
          >
            Fetch Assignments
          </Button>
        </Grid>
        {assignments.length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">Select Assignment</Typography>
            <Select
              value={selectedAssignment}
              onChange={(e) => {
                setSelectedAssignment(e.target.value);
                setPlagiarismResults([]);
              }}
              fullWidth
            >
              <MenuItem value="" disabled>
                Select Assignment
              </MenuItem>
              {assignments.map((assignment) => (
                <MenuItem key={assignment._id} value={assignment._id}>
                  {assignment.assignmentText}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        )}
        {selectedAssignment && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handlePlagiarismCheck}
              fullWidth
            >
              Check Plagiarism
            </Button>
          </Grid>
        )}
        {plagiarismResults.length > 0 && (
          <Grid item xs={12}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Student 1</TableCell>
                  <TableCell>Student 2</TableCell>
                  <TableCell>Similarity Score</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {plagiarismResults.map((result, index) => (
                  <TableRow key={index}>
                    <TableCell>{result.student1}</TableCell>
                    <TableCell>{result.student2}</TableCell>
                    <TableCell>{result.similarityScore}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        )}
        {plagiarismResults.length > 0 && (
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleExportToExcel}
              fullWidth
            >
              Export to Excel
            </Button>
          </Grid>
        )}
        {loading && (
          <Grid item xs={12} align="center">
            <CircularProgress />
            <Typography variant="body2">Checking plagiarism...</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );
};

export default PlagiarismDetector;
