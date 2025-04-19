const BACKEND_URL = window.location.origin.includes("localhost")
  ? "http://localhost:10000/api/chat"
  : "https://smartcrewchat.onrender.com/api/chat";  // <-- Your Render server

// Send user message to SmartCrew backend
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

// Handle user sending a message
async function handleUserSend() {
  const input = document.getElementById("userInput");
  const chat = document.getElementById("chatBody");
  const message = input.value.trim();

  if (!message) return;

  // Display user's message
  chat.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  input.value = "";

  // Show loading indicator
  chat.innerHTML += `<p><strong>SmartCrew:</strong> <em>Typing...</em></p>`;
  chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });

  // Send message and wait for reply
  const reply = await sendToSmartCrew(message);

  // Update chatbot reply
  chat.lastElementChild.innerHTML = `<strong>SmartCrew:</strong> ${reply}`;
  chat.scrollTo({ top: chat.scrollHeight, behavior: "smooth" });

  // Refocus on input
  input.focus();
}

// Open/Close chat window
function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  if (chatWindow.style.display === "none" || chatWindow.style.display === "") {
    chatWindow.style.display = "block";
  } else {
    chatWindow.style.display = "none";
  }
}

// Handle send button
function sendMessage() {
  handleUserSend();
}

// Listen for "Enter" key to send message
document.getElementById("userInput").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    event.preventDefault(); // Prevents adding a newline
    sendMessage();
  }
});
