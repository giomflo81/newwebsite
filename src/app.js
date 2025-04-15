const OPENAI_API_KEY = "your-openai-key";
const ASSISTANT_ID = "asst_mAw3g3ZxGdPiCcMHxzZPdq2"; // Your HandyBuddy Assistant ID
let threadId = null;

async function createThreadIfNeeded() {
  if (!threadId) {
    const res = await fetch("https://api.openai.com/v1/threads", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      }
    });
    const data = await res.json();
    threadId = data.id;
  }
}

aasync function sendToHandyBuddy(userMessage) {
    try {
      await createThreadIfNeeded();
  
      // 1. Add user message
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          role: "user",
          content: userMessage
        })
      });
  
      // 2. Run assistant
      const runRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID
        })
      });
  
      const runData = await runRes.json();
  
      // 3. Polling
      let status = "queued";
      while (status !== "completed" && status !== "failed") {
        await new Promise(res => setTimeout(res, 1000));
        const pollRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runData.id}`, {
          headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` }
        });
        const pollData = await pollRes.json();
        status = pollData.status;
      }
  
      if (status === "failed") {
        return "Sorry, something went wrong with the assistant run.";
      }
  
      // 4. Get final message
      const msgRes = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: { "Authorization": `Bearer ${OPENAI_API_KEY}` }
      });
      const msgData = await msgRes.json();
      const assistantMessage = msgData.data.find(msg => msg.role === "assistant")?.content[0]?.text?.value;
  
      return assistantMessage || "Sorry, I didn't understand that.";
    } catch (err) {
      console.error("❌ Error in sendToHandyBuddy:", err);
      return "Sorry, there was an error processing your request.";
    }
  }
  