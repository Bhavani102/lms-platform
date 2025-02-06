const express = require('express');
const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');
const ExcelJS = require('exceljs');
const Assignment = require('../models/Assignment');
const esprima = require('esprima');
const estraverse = require('estraverse');
const router = express.Router();

// ------------------------------
// Helper: Extract text from a file
// ------------------------------
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
  } else if (fileExtension === '.txt' || fileExtension === '.js' || fileExtension === '.py' || fileExtension === '.java') {
    try {
      const textData = fs.readFileSync(filePath, 'utf8');
      return textData;
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error.message);
      throw new Error('Error reading text file');
    }
  } else {
    throw new Error(`Unsupported file type: ${fileExtension}`);
  }
};

// ------------------------------
// Helper: Normalize code using AST
// ------------------------------
const normalizeCode = (code) => {
  try {
    const ast = esprima.parseScript(code, { tolerant: true });
    const tokens = [];
    estraverse.traverse(ast, {
      enter: function (node) {
        if (node.type === 'Identifier') {
          tokens.push('ID');
        } else if (node.type === 'Literal') {
          tokens.push('LIT');
        } else {
          tokens.push(node.type);
        }
      },
    });
    return tokens.join(' ');
  } catch (error) {
    console.warn('Error normalizing code:', error.message);
    // Fallback: return original code
    return code;
  }
};

// ------------------------------
// Helper: Create vocabulary from documents
// ------------------------------
const createVocabulary = (documents) => {
  const vocab = new Set();
  documents.forEach((doc) => {
    doc.text.split(/\s+/).forEach((word) => vocab.add(word.toLowerCase()));
  });
  return Array.from(vocab);
};

// ------------------------------
// Helper: Create a vector for a document based on the vocabulary
// ------------------------------
const createVector = (text, vocabulary) => {
  const wordCount = {};
  text.split(/\s+/).forEach((word) => {
    const lowerWord = word.toLowerCase();
    wordCount[lowerWord] = (wordCount[lowerWord] || 0) + 1;
  });
  return vocabulary.map((word) => wordCount[word] || 0);
};

// ------------------------------
// Helper: Cosine similarity calculation
// ------------------------------
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

// ------------------------------
// Helper: Detect code similarity
// ------------------------------
const detectCodeSimilarity = (text1, text2) => {
  // Normalize each code text via AST-based normalization
  const norm1 = normalizeCode(text1);
  const norm2 = normalizeCode(text2);

  // Tokenize normalized code into words
  const tokens1 = norm1.split(/\s+/);
  const tokens2 = norm2.split(/\s+/);

  // Build a unified vocabulary
  const vocabulary = Array.from(new Set([...tokens1, ...tokens2]));

  // Create frequency vectors
  const vector1 = createVector(norm1, vocabulary);
  const vector2 = createVector(norm2, vocabulary);

  // Calculate and return cosine similarity (value between 0 and 1)
  return calculateCosineSimilarity(vector1, vector2);
};

// ------------------------------
// Helper: Process submissions and extract text
// ------------------------------
const processSubmissions = async (submissions) => {
  const documents = [];
  for (const submission of submissions) {
    if (submission.submittedFile) {
      try {
        console.log(`Processing file: ${submission.submittedFile}`);
        const fullPath = path.join(__dirname, '..', submission.submittedFile);
        const text = await extractText(fullPath);
        documents.push({ student: submission.studentName, text });
      } catch (error) {
        console.warn(`Skipping file ${submission.submittedFile} due to error: ${error.message}`);
      }
    }
  }
  return documents;
};

// ------------------------------
// Route: Plagiarism Check
// ------------------------------
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
        // Calculate text similarity using basic TF (here, word-length vectors are for simplicity)
        const vec1 = createVector(documents[i].text, vocabulary);
        const vec2 = createVector(documents[j].text, vocabulary);
        const textSimilarity = calculateCosineSimilarity(vec1, vec2) * 100;

        // Calculate code similarity using normalized code tokens
        const codeSimilarity = detectCodeSimilarity(documents[i].text, documents[j].text) * 100;

        results.push({
          student1: documents[i].student,
          student2: documents[j].student,
          textSimilarity: isNaN(textSimilarity) ? '0.00' : textSimilarity.toFixed(2),
          codeSimilarity: isNaN(codeSimilarity) ? '0.00' : codeSimilarity.toFixed(2),
        });

        console.log(
          `Checked plagiarism between ${documents[i].student} and ${documents[j].student}: Text ${isNaN(textSimilarity) ? '0.00' : textSimilarity.toFixed(2)}%, Code ${isNaN(codeSimilarity) ? '0.00' : codeSimilarity.toFixed(2)}%`
        );
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error during plagiarism check:', error);
    res.status(500).json({ message: 'Server error during plagiarism check' });
  }
});

// ------------------------------
// Route: Export Plagiarism Report to Excel
// ------------------------------
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
        const textSimilarity = calculateCosineSimilarity(vec1, vec2) * 100;
        const codeSimilarity = detectCodeSimilarity(documents[i].text, documents[j].text) * 100;

        results.push({
          student1: documents[i].student,
          student2: documents[j].student,
          textSimilarity: isNaN(textSimilarity) ? '0.00' : textSimilarity.toFixed(2),
          codeSimilarity: isNaN(codeSimilarity) ? '0.00' : codeSimilarity.toFixed(2),
        });
      }
    }

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Plagiarism Report');
    sheet.columns = [
      { header: 'Student 1', key: 'student1', width: 30 },
      { header: 'Student 2', key: 'student2', width: 30 },
      { header: 'Text Similarity (%)', key: 'textSimilarity', width: 20 },
      { header: 'Code Similarity (%)', key: 'codeSimilarity', width: 20 },
    ];

    results.forEach((result) => sheet.addRow(result));

    const filePath = `uploads/PlagiarismReport-${assignmentId}.xlsx`;
    await workbook.xlsx.writeFile(filePath);

    res.status(200).json({ filePath, message: 'Plagiarism report exported successfully.' });
  } catch (error) {
    console.error('Error exporting plagiarism report:', error);
    res.status(500).json({ message: 'Server error exporting plagiarism report' });
  }
});

module.exports = router;
