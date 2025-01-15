const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const ExcelJS = require('exceljs');
const Assignment = require('../models/Assignment');
const router = express.Router();

// Helper: Extract text from files
const extractText = async (filePath) => {
  const fileExtension = path.extname(filePath).toLowerCase();

  if (fileExtension === '.pdf') {
    try {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text || '';
    } catch (error) {
      console.error(`Error parsing PDF file ${filePath}:`, error.message);
      throw new Error('Invalid or unsupported PDF structure');
    }
  } else if (fileExtension === '.txt') {
    try {
      const textData = fs.readFileSync(filePath, 'utf8');
      return textData;
    } catch (error) {
      console.error(`Error reading TXT file ${filePath}:`, error.message);
      throw new Error('Error reading text file');
    }
  } else {
    throw new Error(`Unsupported file type: ${fileExtension}`);
  }
};

// Helper: Create vocabulary from all documents
const createVocabulary = (documents) => {
  const vocab = new Set();
  documents.forEach((doc) => {
    doc.text.split(/\s+/).forEach((word) => vocab.add(word.toLowerCase()));
  });
  return Array.from(vocab); // Convert Set to Array
};

// Helper: Create vectors based on vocabulary
const createVector = (text, vocabulary) => {
  const wordCount = {};
  text.split(/\s+/).forEach((word) => {
    const lowerWord = word.toLowerCase();
    wordCount[lowerWord] = (wordCount[lowerWord] || 0) + 1;
  });

  return vocabulary.map((word) => wordCount[word] || 0);
};

// Helper: Cosine similarity calculation
const calculateCosineSimilarity = (vec1, vec2) => {
  const dotProduct = vec1.reduce((sum, val, idx) => sum + val * vec2[idx], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));

  if (magnitude1 === 0 || magnitude2 === 0) {
    console.warn('One or both vectors have zero magnitude; returning 0 similarity.');
    return 0;
  }

  return dotProduct / (magnitude1 * magnitude2);
};

// Helper: Process submissions and extract text
const processSubmissions = async (submissions) => {
  const documents = [];
  for (const submission of submissions) {
    if (submission.submittedFile) {
      try {
        console.log(`Processing file: ${submission.submittedFile}`);
        const text = await extractText(submission.submittedFile);
        documents.push({ student: submission.studentName, text });
      } catch (error) {
        console.warn(`Skipping file ${submission.submittedFile} due to error: ${error.message}`);
      }
    }
  }
  return documents;
};

// Route: Check plagiarism
router.post('/plagiarism-check', async (req, res) => {
  const { assignmentId } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const documents = await processSubmissions(assignment.submissions);

    if (documents.length < 2) {
      return res.status(400).json({ message: 'Not enough valid submissions to compare' });
    }

    const vocabulary = createVocabulary(documents);
    const results = [];

    for (let i = 0; i < documents.length; i++) {
      for (let j = i + 1; j < documents.length; j++) {
        const vec1 = createVector(documents[i].text, vocabulary);
        const vec2 = createVector(documents[j].text, vocabulary);

        const similarityScore = calculateCosineSimilarity(vec1, vec2) * 100;

        results.push({
          student1: documents[i].student,
          student2: documents[j].student,
          similarityScore: isNaN(similarityScore) ? '0.00' : similarityScore.toFixed(2),
        });

        console.log(
          `Checked plagiarism between ${documents[i].student} and ${documents[j].student}: ${
            isNaN(similarityScore) ? '0.00' : similarityScore.toFixed(2)
          }%`
        );
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error during plagiarism check:', error);
    res.status(500).json({ message: 'Server error during plagiarism check' });
  }
});

// Route: Export plagiarism report to Excel
router.get('/plagiarism-export/:assignmentId', async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const documents = await processSubmissions(assignment.submissions);

    if (documents.length < 2) {
      return res.status(400).json({ message: 'Not enough valid submissions to compare' });
    }

    const vocabulary = createVocabulary(documents);
    const results = [];

    for (let i = 0; i < documents.length; i++) {
      for (let j = i + 1; j < documents.length; j++) {
        const vec1 = createVector(documents[i].text, vocabulary);
        const vec2 = createVector(documents[j].text, vocabulary);

        const similarityScore = calculateCosineSimilarity(vec1, vec2) * 100;

        results.push({
          student1: documents[i].student,
          student2: documents[j].student,
          similarityScore: isNaN(similarityScore) ? '0.00' : similarityScore.toFixed(2),
        });
      }
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Plagiarism Report');
    sheet.columns = [
      { header: 'Student 1', key: 'student1', width: 30 },
      { header: 'Student 2', key: 'student2', width: 30 },
      { header: 'Similarity Score (%)', key: 'similarityScore', width: 20 },
    ];

    results.forEach((result) => sheet.addRow(result));

    const filePath = `uploads/PlagiarismReport-${assignmentId}.xlsx`;
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({ filePath });
  } catch (error) {
    console.error('Error exporting plagiarism report:', error);
    res.status(500).json({ message: 'Server error exporting plagiarism report' });
  }
});

module.exports = router;
