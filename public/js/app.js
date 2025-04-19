const BACKEND_URL = window.location.origin.includes("localhost")
  ? "http://localhost:10000/api/chat"
  : "https://smartcrewchat.onrender.com/api/chat";   // <--- Your Render App URL


async function sendToSmartCrew(userMessage) {
  try {
    const response = await fetch(BACKEND_URL, {
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
      return "Something went wrong with SmartCrew.";
    }
  } catch (err) {
    console.error("❌ Network error:", err);
    return "Unable to connect to SmartCrew. Please try again.";
  }
}

async function handleUserSend() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatBody");
  const message = input.value.trim();

  if (!message) return;

  // Display user's message
  chat.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = "";

  // Show loading/typing message
  chat.innerHTML += `<p><strong>SmartCrew:</strong> <em>Typing...</em></p>`;
  chat.scrollTop = chat.scrollHeight;

  // Get reply from backend
  const reply = await sendToSmartCrew(message);

  // Display SmartCrew's response
  chat.lastElementChild.innerHTML = `<strong>SmartCrew:</strong> ${reply}`;
  chat.scrollTop = chat.scrollHeight;
}

function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
    chatWindow.style.display = "block";
  } else {
    chatWindow.style.display = "none";
  }
}

function sendMessage() {
  handleUserSend();
}
