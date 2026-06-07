const BRIDGE_URL = window.CHAT_BRIDGE_URL || "http://127.0.0.1:8090";

const messagesEl = document.getElementById("messages");
const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");

function appendMessage(text, role) {
  const item = document.createElement("div");
  item.className = `message message-${role}`;
  item.textContent = text;
  messagesEl.appendChild(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

async function sendMessage(text) {
  appendMessage(text, "user");
  appendMessage("...", "bot");

  const pending = messagesEl.lastElementChild;

  try {
    const response = await fetch(`${BRIDGE_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Blad polaczenia z serwisem");
    }

    pending.textContent = data.reply;
  } catch (error) {
    pending.textContent = `Blad: ${error.message}`;
    pending.classList.add("message-error");
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) {
    return;
  }
  input.value = "";
  sendMessage(text);
});

appendMessage("Czesc! W czym moge pomoc?", "bot");
