import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();

app.use(cors({ origin: "https://assisstant-frontend.vercel.app" })); // update with your Vercel frontend domain
app.use(express.json());

app.post('/api/ask', async (req, res) => {
  const { question } = req.body;
  if (!question || question.trim() === '') {
    return res.json({ answer: 'Please provide a valid question.' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await response.json();
    res.json({ answer: data.choices?.[0]?.message?.content || "No response from AI." });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.json({ answer: "Error fetching AI response." });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
