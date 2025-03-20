const CLIENT_TOKEN = "KGCGSYJH74N7LWUZSHSX35BOLEUX3TNL"; // Replace with actual token

async function getWitIntent(userMessage) {
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
        return data;
    } catch (error) {
        console.error("Error fetching Wit.ai response:", error);
        return null;
    }
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
        if (!witResponse) throw new Error("No response from Wit.ai");

        // Extract intent
        const intent = witResponse.intents?.[0]?.name || "fallback";

        // Define chatbot responses based on detected intent
        const responses = {
            "greeting": "Hello! How can I help you?",
            "set_alarm": "Okay, setting an alarm for you!",
            "fallback": "I'm not sure I understand. Can you rephrase?"
        };

        // Get chatbot response
        const botResponse = responses[intent] || responses["fallback"];

        // Update UI with chatbot response
        document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> ${botResponse}`;
    } catch (error) {
        console.error("Chatbot error:", error);
        document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> Sorry, there was an error. Please try again.`;
    }

    chatBody.scrollTop = chatBody.scrollHeight;
}
