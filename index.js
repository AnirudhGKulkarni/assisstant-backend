import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

// Load environment variables from .env
dotenv.config();

const app = express();

// Middlewares
app.use(express.json());

// Set CORS to allow your frontend
app.use(
  cors({
    origin: "https://assisstant-frontend.vercel.app", // <-- put your deployed frontend URL here
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Backend is working");
});

// AI Chat endpoint
app.post("/api/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.json({ answer: "Please provide a valid question." });
  }

  // Log the question for debugging
  console.log("Received question:", question);

  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error("OPENAI_API_KEY is missing!");
      return res.json({ answer: "OpenAI API key not set in backend." });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // You can change to "gpt-4o" if available
        messages: [{ role: "user", content: question }],
      }),
    });

    const data = await response.json();

    console.log("OpenAI API response:", data);

    if (!data.choices || !data.choices[0].message) {
      return res.json({ answer: "No response from AI." });
    }

    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error("Error fetching AI response:", err);
    res.json({ answer: "⚠️ Error fetching AI response." });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
