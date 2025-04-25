const mongoose = require('mongoose');

const pdfSchema = new mongoose.Schema({
    title: String,
    content: String,  // Extracted text
    createdAt: { type: Date, default: Date.now }
});

pdfSchema.index({ content: "text" });  // Enable full-text search

const PDFDocument = mongoose.model('PDFDocument', pdfSchema);
module.exports = PDFDocument;
