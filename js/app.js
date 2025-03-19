let chatbotData = {};
const WIT_API_TOKEN = "MAGNYTFVCZ7X7W7A7T0S5TE0VQEX73P6"; // Your Wit.ai Server Access Token

// Fetch chatbot responses from your API
fetch('https://your-api-url.com/chatbot-data')
  .then(response => response.json())
  .then(data => {
    chatbotData = data;
  })
  .catch(error => console.error('Error fetching chatbot data:', error));

async function getWitIntent(message) {
  try {
    const response = await fetch(
      `https://api.wit.ai/message?v=20230215&q=${encodeURIComponent(message)}`,
      {
        headers: {
          "Authorization": `Bearer ${WIT_API_TOKEN}`
        }
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Wit.ai API error:', error);
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
    const message = userInput.value.trim(); // Store message before clearing
    
    if (!message) return;

    // Append user message
    chatBody.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
    userInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Show loading indicator
    chatBody.innerHTML += `<p><strong>Chatbot:</strong> <span id="loading">Loading...</span></p>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        // Get intent from Wit.ai
        const witResponse = await getWitIntent(message);
        const intent = witResponse?.intents[0]?.name || 'fallback';

        // Get appropriate response
        const responses = chatbotData[intent]?.[0]?.responses || chatbotData.fallback[0].responses;
        const response = responses[Math.floor(Math.random() * responses.length)];

        // Update chat
        document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> ${response}`;
    } catch (error) {
        document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> Sorry, there was an error. Please try again.`;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}