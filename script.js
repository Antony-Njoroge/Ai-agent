async function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = input.value.trim();
  const selectedModel = document.getElementById("model-select").value;

  if (!userMessage) return;

  chatBox.innerHTML += `<div class="message user">You: ${userMessage}</div>`;
  chatBox.innerHTML += `<div class="message bot">AI: ⏳ Thinking...</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userMessage, model: selectedModel })
    });

    const data = await res.json();
    chatBox.innerHTML = chatBox.innerHTML.replace(/AI: ⏳ Thinking...<\/div>/,
      `<div class="message bot">AI: ${data.reply}</div>`);
  } catch (err) {
    chatBox.innerHTML = chatBox.innerHTML.replace(/AI: ⏳ Thinking...<\/div>/,
      `<div class="message bot">AI: 😵‍💫 Error.</div>`);
    console.error(err);
  }
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}
