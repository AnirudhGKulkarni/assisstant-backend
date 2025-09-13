import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config(); // Load .env

const app = express();
const PORT = process.env.PORT || 5000;

// Allow requests from your frontend
app.use(cors({ origin: "https://assisstant-frontend.vercel.app" }));
app.use(express.json());

// Gemini API endpoint
const GEMINI_API_URL = "https://generativeai.googleapis.com/v1beta2/models/gemini-1.5:generateText";

app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.json({ answer: "Please provide a valid question." });
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: { text: question },
        temperature: 0.7,
        maxOutputTokens: 300,
      }),
    });

    const data = await response.json();

    if (!data.candidates || !data.candidates[0].output) {
      return res.json({ answer: "No response from Gemini." });
    }

    res.json({ answer: data.candidates[0].output });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.json({ answer: "Error fetching AI response." });
  }
});

// Test endpoint
app.get("/", (req, res) => {
  res.send("✅ Backend is working");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
