const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 5000;

// --- 1. PASTE YOUR KEY HERE ---
const API_KEY = process.env.GEMINI_API_KEY;

// --- 2. ALLOW CONNECTION (CORS) ---
app.use(cors({ origin: '*' })); 
app.use(express.json());

const genAI = new GoogleGenerativeAI(API_KEY);

// --- 3. WELCOME MESSAGE (Fixes "Cannot GET /") ---
app.get('/', (req, res) => {
    res.send('✅ Backend is RUNNING! You can now go to your website.');
});

app.post('/api/generate', async (req, res) => {
    console.log("📩 Request received from website...");
    try {
        const { prompt } = req.body;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("✅ Success! Sending answer.");
        res.json({ text });
    } catch (error) {
        console.error("❌ Error:", error.message);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
});
