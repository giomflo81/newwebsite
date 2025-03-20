let chatbotData = {};
const CLIENT_TOKEN = "KGCGSYJH74N7LWUZSHSX35BOLEUX3TNL"; // Replace with actual token

async function getWitIntent(userMessage) {
  console.log("📡 Sending message to Wit.ai:", userMessage); // Debugging log

  const q = encodeURIComponent(userMessage);
  const uri = `https://api.wit.ai/message?v=20240304&q=${q}`;
  const headers = {
      "Authorization": `Bearer ${CLIENT_TOKEN}`,
      "Content-Type": "application/json"
  };

  try {
      const response = await fetch(uri, { headers: headers });

      if (!response.ok) {
          throw new Error(`Wit.ai API error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ Received response from Wit.ai:", data); // Debugging log
      return data;
  } catch (error) {
      console.error("❌ Error fetching Wit.ai response:", error);
      return null;
  }
}

function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
}

async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const message = userInput.value.trim(); // Get user input

  if (!message) return;

  // Append user message
  chatBody.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  userInput.value = ""; // Clear input

  // Show loading indicator
  chatBody.innerHTML += `<p><strong>Chatbot:</strong> <span id="loading">Loading...</span></p>`;
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
      // Get response from Wit.ai
      const witResponse = await getWitIntent(message);
      if (!witResponse || !witResponse.intents || witResponse.intents.length === 0) {
          throw new Error("No valid intent detected");
      }

      // Extract intent
      const intent = witResponse.intents?.[0]?.name || "fallback";
      console.log("🧠 Detected Intent:", intent); // Debugging log

      // Define chatbot responses based on detected intent
      const responses = {
          "greeting": "Hello! How can I help you?",
          "set_alarm": "Okay, setting an alarm for you!",
          "I_want_a_home_repair_service": "Sure, how can I assist you with home repair services?",
          "fallback": "I'm not sure I understand. Can you rephrase?"
      };
 
 // Get chatbot response
 const botResponse = responses[intent] || responses["fallback"];
 console.log("💬 Bot Response:", botResponse); // Debugging log

 // Update UI with chatbot response
 document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> ${botResponse}`;
} catch (error) {
 console.error("❌ Chatbot error:", error);
 document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> Sorry, there was an error. Please try again.`;
}

chatBody.scrollTop = chatBody.scrollHeight;
}