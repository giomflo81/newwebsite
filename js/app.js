let chatbotData = {};

 

async function getWitIntent(userMessage) {
  const WIT_API_TOKEN = "KGCGSYJH74N7LWUZSHSX35BOLEUX3TNL"; // Your Wit.ai token
  const url = `https://api.wit.ai/message?v=20230215&q=${encodeURIComponent(userMessage)}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Authorization": `Bearer ${WIT_API_TOKEN}`
      }
    });
    return await response.json();
  } catch (error) {
    console.error('Wit.ai API error:', error);
    return null;
  }
}

async function sendMessage() {
  const userInput = document.getElementById("userInput");
  const chatBody = document.getElementById("chatBody");
  const message = userInput.value.trim(); // Store message BEFORE clearing input
  
  if (!message) return;

  // Append user message
  chatBody.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
  userInput.value = ""; // Clear input AFTER storing message
  chatBody.scrollTop = chatBody.scrollHeight;

  // Show loading indicator
  chatBody.innerHTML += `<p><strong>Chatbot:</strong> <span id="loading">Loading...</span></p>`;
  chatBody.scrollTop = chatBody.scrollHeight;

  try {
    // Get intent from Wit.ai API
    const witResponse = await getWitIntent(message);
    const intent = witResponse?.intents?.[0]?.name || 'fallback'; // Use detected intent

    // Get response from chatbotData
    const responses = chatbotData[intent]?.[0]?.responses || chatbotData.fallback[0].responses;
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Update UI
    document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> ${response}`;
  } catch (error) {
    document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> Sorry, there was an error. Please try again.`;
  }

  chatBody.scrollTop = chatBody.scrollHeight;
}

// Toggle function remains the same
function toggleChat() {
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
}