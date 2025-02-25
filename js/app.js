function toggleChat() {
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.style.display = chatWindow.style.display === "flex" ? "none" : "flex";
}

async function sendMessage() {
    const userInput = document.getElementById("userInput");
    const chatBody = document.getElementById("chatBody");
    if (!userInput.value.trim()) return;

    // Append user message
    chatBody.innerHTML += `<p><strong>You:</strong> ${userInput.value}</p>`;
    userInput.value = "";
    chatBody.scrollTop = chatBody.scrollHeight;

    // Show loading indicator
    chatBody.innerHTML += `<p><strong>Chatbot:</strong> <span id="loading">Loading...</span></p>`;
    chatBody.scrollTop = chatBody.scrollHeight;

    try {
        const response = await fetch("https://your-chatbot-api-url.com/chatbot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput.value })
        });
        if (!response.ok) throw new Error("Failed to fetch response");
        const data = await response.json();
        document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> ${data.response}`;
    } catch (error) {
        document.getElementById("loading").parentElement.innerHTML = `<strong>Chatbot:</strong> Sorry, there was an error. Please try again.`;
    }
    chatBody.scrollTop = chatBody.scrollHeight;
}
