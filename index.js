import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

const app = express();

app.use(cors({ origin: "https://anirudhgkulkarni.github.io/assisstant-frontend" }));

dotenv.config(); // Load .env variables

app.use(cors());
app.use(express.json());

// API endpoint for AI chat
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
        model: 'gpt-3.5-turbo', // or "gpt-3.5-turbo" if you don't have GPT-4 access
        messages: [{ role: 'user', content: question }],
      }),
    });

    const data = await response.json();

    if (!data.choices || !data.choices[0].message) {
      throw new Error('Invalid response from OpenAI API');
    }

    res.json({ answer: data.choices[0].message.content });
  } catch (err) {
    console.error('OpenAI API error:', err);
    res.json({ answer: 'Error fetching AI response.' });
  }
});

// Start backend server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
});
app.get("/", (req, res) => {
  res.send("✅ Backend is working");
});
