export class ChatSystem {
    constructor() {
        this.chatMessages = document.getElementById('chat-messages');
        this.chatInput = document.getElementById('chat-input');
        this.sendButton = document.getElementById('send-button');
        this.messages = [];
        this.maxMessages = 100;
        
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    setupEventListeners() {
        // Send button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter key to send message
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        // Listen for system messages
        document.addEventListener('chatMessage', (event) => {
            this.addMessage(event.detail);
        });

        // Listen for close panels event
        document.addEventListener('closeAllPanels', () => {
            this.chatInput.blur();
        });
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (message === '') return;

        // Create message object
        const messageData = {
            type: 'user',
            username: 'You', // This will be replaced with actual username
            message: message,
            timestamp: new Date().toLocaleTimeString()
        };

        // Add to local chat
        this.addMessage(messageData);

        // Clear input
        this.chatInput.value = '';

        // Emit message event for socket.io (to be implemented)
        document.dispatchEvent(new CustomEvent('sendChatMessage', {
            detail: messageData
        }));
    }

    addMessage(messageData) {
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message';

        let messageHTML = '';
        
        if (messageData.type === 'system') {
            messageHTML = `
                <span style="color: #f39c12; font-style: italic;">${messageData.message}</span>
                <span class="timestamp">${messageData.timestamp}</span>
            `;
        } else {
            messageHTML = `
                <span class="username">${messageData.username}:</span>
                <span class="message-text">${this.escapeHtml(messageData.message)}</span>
                <span class="timestamp">${messageData.timestamp}</span>
            `;
        }

        messageElement.innerHTML = messageHTML;

        // Add to messages array
        this.messages.push(messageData);

        // Remove old messages if we exceed max
        if (this.messages.length > this.maxMessages) {
            this.messages.shift();
            if (this.chatMessages.firstChild) {
                this.chatMessages.removeChild(this.chatMessages.firstChild);
            }
        }

        // Add to DOM
        this.chatMessages.appendChild(messageElement);

        // Scroll to bottom
        this.scrollToBottom();
    }

    addWelcomeMessage() {
        this.addMessage({
            type: 'system',
            message: 'Welcome to WonderWorld! Click to move around, right-click or press C to customize your avatar.',
            timestamp: new Date().toLocaleTimeString()
        });
    }

    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Methods for multiplayer chat (to be implemented with socket.io)
    addPlayerMessage(playerId, username, message) {
        this.addMessage({
            type: 'player',
            username: username,
            message: message,
            timestamp: new Date().toLocaleTimeString(),
            playerId: playerId
        });
    }

    addPlayerJoinMessage(username) {
        this.addMessage({
            type: 'system',
            message: `${username} joined the world`,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    addPlayerLeaveMessage(username) {
        this.addMessage({
            type: 'system',
            message: `${username} left the world`,
            timestamp: new Date().toLocaleTimeString()
        });
    }

    clear() {
        this.chatMessages.innerHTML = '';
        this.messages = [];
    }
}