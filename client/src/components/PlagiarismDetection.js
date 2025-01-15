import React, { useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import axios from 'axios';

const PlagiarismChecker = () => {
  const [folderPath, setFolderPath] = useState('');
  const [results, setResults] = useState([]);

  // Handle folder submission
  const handleFolderSubmit = async () => {
    if (!folderPath) {
      alert('Please enter a valid folder path!');
      return;
    }

    try {
      // Send folder path to backend
      const response = await axios.post(
        'http://localhost:5001/upload-folder',
        { folder_path: folderPath },
        { headers: { 'Content-Type': 'application/json' } }
      );
      alert(response.data.message);
      fetchResults(); // Fetch the results after processing
    } catch (error) {
      console.error('Error submitting folder:', error.response || error);
      alert('Failed to process folder for plagiarism check.');
    }
  };

  // Fetch results from the backend
  const fetchResults = async () => {
    try {
      const response = await axios.get('http://localhost:5001/results');
      setResults(response.data); // Populate results state with fetched data
    } catch (error) {
      console.error('Error fetching results:', error.response || error);
      alert('Failed to fetch plagiarism results.');
    }
  };

  return (
    <Container maxWidth="md" sx={{ marginTop: '2rem' }}>
      <Typography
        variant="h4"
        component="h1"
        align="center"
        gutterBottom
        sx={{ marginBottom: '2rem' }}
      >
        Plagiarism Checker
      </Typography>

      <Box sx={{ marginBottom: '1.5rem' }}>
        <Typography variant="body1" gutterBottom>
          Enter the path to the folder containing the files:
        </Typography>
        <TextField
          fullWidth
          label="Folder Path"
          variant="outlined"
          value={folderPath}
          onChange={(e) => setFolderPath(e.target.value)}
          placeholder="Enter folder path"
          sx={{ marginBottom: '1rem' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleFolderSubmit}
          fullWidth
          sx={{ padding: '0.75rem' }}
        >
          Check Plagiarism
        </Button>
      </Box>

      <Typography
        variant="h5"
        component="h2"
        align="center"
        gutterBottom
        sx={{ marginTop: '2rem', marginBottom: '1rem' }}
      >
        Results
      </Typography>

      {results.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Test Document</strong></TableCell>
                <TableCell><strong>Compared With</strong></TableCell>
                <TableCell><strong>Similarity (%)</strong></TableCell>
                <TableCell><strong>Unique Percentage (%)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.Test_Document}</TableCell>
                  <TableCell>{result.Compared_With}</TableCell>
                  <TableCell>{(result.Similarity * 100).toFixed(2)}</TableCell>
                  <TableCell>{result.Unique_Percentage.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{ marginTop: '1rem' }}
        >
          No results available. Enter a folder path to start.
        </Typography>
      )}
    </Container>
  );
};

export default PlagiarismChecker;
