
const CLIENT_TOKEN = "KGCGSYJH74N7LWUZSHSX35BOLEUX3TNL"; // Replace with actual token

async function getWitIntent(userMessage) {
  console.log("📡 Sending message to Wit.ai:", userMessage); // Debugging log

  const q = encodeURIComponent(userMessage);
  const uri = `https://api.wit.ai/message?v=20240304&q=${q}`;
  const headers = {
      "Authorization": `Bearer ${CLIENT_TOKEN}`,
      
  };

  try {
    const response = await fetch(uri, { headers });
    if (!response.ok) throw new Error(`Wit.ai API error! Status: ${response.status}`);
    return await response.json();
} catch (error) {
    console.error("❌ Wit.ai API error:", error);
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
      // Get Wit.ai response
      const witResponse = await getWitIntent(message);

      /// Extract intent or fallback
      const intent = witResponse?.intents?.[0]?.name || "fallback";

      // Define chatbot responses based on detected intent
      const responses = {
          "greeting": "Hello! How can I help you?",
          "set_alarm": "Okay, setting an alarm for you!",
          "I_want_a_home_repair_service": "Sure, how can I assist you with home repair services?",
          "fallback": "I'm not sure I understand. Can you rephrase?"
      };
 
 // Update UI with bot response
 const botResponse = responses[intent] || responses.fallback;
 document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> ${botResponse}`;
} catch (error) {
 console.error("❌ Chatbot error:", error);
 document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> Sorry, there was an error. Please try again.`;
}

chatBody.scrollTop = chatBody.scrollHeight;
}