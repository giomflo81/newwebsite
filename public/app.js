async function sendToHandyBuddy(userMessage) {
  try {
    const response = await fetch("http://localhost:10000/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userMessage })
    });

    const data = await response.json();

    if (response.ok) {
      return data.reply || "Sorry, I didn’t get a response.";
    } else {
      console.error("❌ API error:", data.error);
      return "Something went wrong with HandyBuddy.";
    }
  } catch (err) {
    console.error("❌ Network error:", err);
    return "Unable to connect to the assistant. Please try again.";
  }
}

async function handleUserSend() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatBox");
  const message = input.value.trim();

  if (!message) return;

  // Display user's message
  chat.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = "";

  // Show loading/typing message
  chat.innerHTML += `<p><strong>HandyBuddy:</strong> <em>Typing...</em></p>`;
  chat.scrollTop = chat.scrollHeight;

  // Get reply from backend
  const reply = await sendToHandyBuddy(message);

  // Display assistant's response
  chat.lastElementChild.innerHTML = `<strong>HandyBuddy:</strong> ${reply}`;
  chat.scrollTop = chat.scrollHeight;
}
