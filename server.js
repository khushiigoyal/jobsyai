const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const API_KEY = process.env.GEMINI_API_KEY;

app.get("/", (req, res) => {
  res.send("✅ Backend is RUNNING! You can now go to your website.");
});

app.post("/api/generate", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return res.status(500).json({ error: "Gemini API error" });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
