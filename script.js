// Load saved chat on page load
document.addEventListener("DOMContentLoaded", () => {
  const savedChat = localStorage.getItem("chatHistory");
  if (savedChat) {
    document.getElementById("chat-box").innerHTML = savedChat;
  }
});

// Save chat to local storage
function saveChat() {
  const chatBox = document.getElementById("chat-box");
  localStorage.setItem("chatHistory", chatBox.innerHTML);
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// Send message and get response
async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = input.value.trim();
  const selectedModel = document.getElementById("model-select").value;

  if (!userMessage) return;

  // Show user message
  chatBox.innerHTML += `<div class="message user">You: ${userMessage}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  // Show loading indicator
  chatBox.innerHTML += `<div class="message bot">AI: ⏳ Thinking...</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch(`https://api-inference.huggingface.co/models/ ${selectedModel}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        inputs: userMessage,
        parameters: { max_new_tokens: 200, temperature: 0.7 }
      })
    });

    const result = await response.json();
    const aiResponse = result.generated_text || "I couldn't understand that.";

    // Replace loading with actual response
    chatBox.innerHTML = chatBox.innerHTML.replace(/AI: ⏳ Thinking...<\/div>/, `<div class="message bot">AI: ${aiResponse}</div>`);
    chatBox.scrollTop = chatBox.scrollHeight;

    // Save chat
    saveChat();
  } catch (error) {
    chatBox.innerHTML = chatBox.innerHTML.replace(/AI: ⏳ Thinking...<\/div>/, `<div class="message bot">AI: 😵‍💫 Something went wrong.</div>`);
    console.error("Error:", error);
  }
}
