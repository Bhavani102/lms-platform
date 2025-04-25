const express = require('express');
const axios = require('axios');
const PDFDocument = require('../models/pdfModel');  // MongoDB Model for PDFs
const router = express.Router();

router.post('/query', async (req, res) => {
    try {
        const { query } = req.body;

        // Retrieve relevant document content
        const results = await PDFDocument.find({ $text: { $search: query } }).limit(1);
        const context = results.length ? results[0].content : "No relevant documents found.";

        // Call OpenAI API
        const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: "gpt-4",
            messages: [
                { role: "system", content: `Answer based on the following document: ${context}` },
                { role: "user", content: query }
            ]
        }, {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` }
        });

        res.json({ answer: openaiResponse.data.choices[0].message.content });

    } catch (error) {
        console.error("Chatbot error:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
