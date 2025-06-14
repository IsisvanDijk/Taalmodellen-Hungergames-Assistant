const chatInput = document.querySelector("#chatfield");
const output = document.querySelector("#output");
const button = document.querySelector("button");
const resetButton = document.querySelector("#resetChat");
const chatForm = document.querySelector('.chat-section form');

const messages = [
    { role: "system", content: "" }
];

function renderMessages() {
    output.innerHTML = '';
    messages.forEach(({ role, content }) => {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${role === 'user' ? 'user-message' : role === 'assistant' ? 'ai-message' : ''}`;
        messageEl.textContent = content;
        output.appendChild(messageEl);
    });
    output.scrollTop = output.scrollHeight;
}

function updateLastAssistantMessage(text) {
    const lastMsgEl = output.querySelector('.ai-message:last-child');
    if (lastMsgEl) {
        lastMsgEl.textContent = text;
        output.scrollTop = output.scrollHeight;
    }
}

async function sendMessage(userText) {
    messages.push({ role: 'user', content: userText });
    renderMessages();

    chatInput.disabled = true;
    chatForm.querySelector('button[type="submit"]').disabled = true;

    try {
        const response = await fetch('http://localhost:3000/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ messages }),
        });

        if (!response.ok) throw new Error('Server error: ' + response.status);

        // Add an empty assistant message to stream into
        messages.push({ role: 'assistant', content: '' });
        renderMessages();

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let assistantMessage = '';

        while (!done) {
            const { value, done: doneReading } = await reader.read();
            done = doneReading;
            assistantMessage += decoder.decode(value || new Uint8Array(), { stream: !done });

            messages[messages.length - 1].content = assistantMessage;
            updateLastAssistantMessage(assistantMessage);
        }
    } catch (err) {
        messages.push({ role: 'assistant', content: 'Er is een fout opgetreden: ' + err.message });
        renderMessages();
    } finally {
        chatInput.disabled = false;
        chatForm.querySelector('button[type="submit"]').disabled = false;
        chatInput.focus();
    }
}

chatForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    chatInput.value = '';
    sendMessage(text);
});

resetButton.addEventListener('click', () => {
    messages.length = 0; // clear array
    messages.push({ role: "system", content: "" });
    renderMessages();
    chatInput.value = '';
    chatInput.focus();
});

renderMessages();
