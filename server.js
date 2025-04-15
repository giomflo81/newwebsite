const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace with your Wit.ai token
const SERVER_TOKEN = 'MAGRYIFVCZ7XYM7A7IDSEI6VQEX73PG';

app.use(express.static('public')); // optional if you want to serve frontend

app.use(express.json());

app.post('/api/message', async (req, res) => {
  const { message } = req.body;

  const url = `https://api.wit.ai/message?v=20250320&q=${encodeURIComponent(message)}`;
  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${SERVER_TOKEN}`
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Wit.ai error:', err);
    res.status(500).json({ error: 'Wit.ai API error' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
