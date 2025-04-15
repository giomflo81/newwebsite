require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

const app = express();
const PORT = process.env.PORT || 10000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSISTANT_ID = process.env.ASSISTANT_ID;
let threadId = null;

app.use(cors());
app.use(express.json());

// 🔁 Create thread once
async function createThreadIfNeeded() {
  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
    console.log("🧵 Thread created:", threadId);
  }
}

// 🤖 HandyBuddy chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required.' });

  try {
    await createThreadIfNeeded();

    await openai.beta.threads.messages.create({
      thread_id: threadId,
      role: 'user',
      content: message
    });

    const run = await openai.beta.threads.runs.create({
      thread_id: threadId,
      assistant_id: ASSISTANT_ID
    });

    let status = run.status;
    while (status !== 'completed' && status !== 'failed') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      status = runStatus.status;
    }

    if (status === 'failed') {
      console.error("❌ Assistant failed to complete.");
      return res.status(500).json({ error: 'Assistant failed to respond.' });
    }

    const messages = await openai.beta.threads.messages.list(threadId);
    const reply = messages.data
      .filter(msg => msg.role === 'assistant')
      .map(msg => msg.content?.[0]?.text?.value)
      .filter(Boolean)
      .join('\n');

    console.log("🤖 Assistant reply:", reply);
    res.json({ reply });

  } catch (err) {
    console.error("❌ Error in /api/chat:", err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ HandyBuddy server running at http://localhost:${PORT}`);
});
