// Messages App
window.messages = {
    container: null,
    currentChat: null,
    contactList: [
        { id: 'kai', name: 'Prakit Chetia (Kai)', avatar: '👨‍💻', online: true, lastSeen: 'now', isTyping: false },
        { id: 'ubuntu', name: 'Ubuntu Support', avatar: '🐧', online: true, lastSeen: 'now', isTyping: false },
        { id: 'system', name: 'System Administrator', avatar: '🔧', online: false, lastSeen: '3h ago', isTyping: false }
    ],
    
    // Chat history
    chats: {
        'kai': [
            { sender: 'kai', message: 'Hello! Welcome to RonakOS!', time: '12:30' },
            { sender: 'user', message: 'Hi Kai! Thanks for developing this amazing web OS!', time: '12:35' }
        ],
        'ubuntu': [
            { sender: 'ubuntu', message: 'Welcome to Ubuntu Support. How can I help you today?', time: '10:15' },
            { sender: 'user', message: 'I wanted to learn more about this Ubuntu-inspired OS.', time: '10:17' },
            { sender: 'ubuntu', message: 'RonakOS is a web-based OS with a UI inspired by Ubuntu. You can use the file explorer, terminal, browser, and more!', time: '10:18' }
        ],
        'system': [
            { sender: 'system', message: 'System update available. Would you like to install now?', time: 'Yesterday' }
        ]
    },
    
    // Predefined responses
    autoResponses: {
        'kai': [
            'I\'m glad you like RonakOS!',
            'Yes, RonakOS is built with HTML, CSS, and JavaScript.',
            'Feel free to explore all the features!',
            'The terminal has over 30 commands, try them out!',
            'You can customize the interface in Settings.'
        ],
        'ubuntu': [
            'Ubuntu is one of the most popular Linux distributions.',
            'RonakOS includes many Ubuntu-inspired features.',
            'Have you tried the terminal? It works just like Ubuntu\'s!',
            'Let me know if you need any help using the system.',
            'The file system is very similar to Ubuntu\'s directory structure.'
        ],
        'system': [
            'System check completed. All services running normally.',
            'Your system is up to date.',
            'Security scan completed. No threats detected.',
            'Backup completed successfully.',
            'Network connection is stable and secure.'
        ]
    },
    
    // Initialize the messages app
    init: function(containerElement) {
        this.container = containerElement;
        
        // Auto-select first chat if none is selected
        if (!this.currentChat) {
            this.currentChat = this.contactList[0].id;
        }
        
        this.render();
    },
    
    // Render the messages app
    render: function() {
        if (!this.container) return;
        
        const html = `
            <div class="messages-app font-ubuntu">
                <div class="messages-sidebar">
                    <div class="messages-header">
                        <h2>Messages</h2>
                        <div class="new-message-btn">
                            <span>+</span>
                        </div>
                    </div>
                    
                    <div class="contact-list">
                        ${this.contactList.map(contact => `
                            <div class="contact-item ${this.currentChat === contact.id ? 'active' : ''}" data-contact="${contact.id}">
                                <div class="contact-avatar ${contact.online ? 'online' : ''}">
                                    ${contact.avatar}
                                </div>
                                <div class="contact-info">
                                    <div class="contact-name">${contact.name}</div>
                                    <div class="contact-status">
                                        ${contact.isTyping ? 'typing...' : contact.online ? 'online' : contact.lastSeen}
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="chat-area">
                    ${this.renderCurrentChat()}
                </div>
            </div>
        `;
        
        this.container.innerHTML = html;
        
        // Add custom styles
        const style = document.createElement('style');
        style.textContent = `
            .messages-app {
                display: flex;
                height: 100%;
                overflow: hidden;
            }
            
            .messages-sidebar {
                width: 280px;
                background-color: #f5f5f5;
                border-right: 1px solid #ddd;
                display: flex;
                flex-direction: column;
            }
            
            .messages-header {
                padding: 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #ddd;
            }
            
            .messages-header h2 {
                margin: 0;
                color: #333;
            }
            
            .new-message-btn {
                width: 32px;
                height: 32px;
                background-color: var(--primary-color);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 18px;
                transition: background-color 0.2s;
            }
            
            .new-message-btn:hover {
                background-color: var(--secondary-color);
            }
            
            .contact-list {
                flex: 1;
                overflow-y: auto;
            }
            
            .contact-item {
                padding: 12px 15px;
                display: flex;
                align-items: center;
                cursor: pointer;
                transition: background-color 0.2s;
                animation: fadeIn 0.3s ease;
            }
            
            .contact-item:hover {
                background-color: rgba(0, 0, 0, 0.05);
            }
            
            .contact-item.active {
                background-color: rgba(233, 84, 32, 0.1);
            }
            
            .contact-avatar {
                width: 40px;
                height: 40px;
                background-color: #e1e1e1;
                border-radius: 50%;
                margin-right: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                position: relative;
            }
            
            .contact-avatar.online::after {
                content: '';
                position: absolute;
                bottom: 0;
                right: 0;
                width: 10px;
                height: 10px;
                background-color: #4CAF50;
                border-radius: 50%;
                border: 2px solid #f5f5f5;
            }
            
            .contact-info {
                flex: 1;
                overflow: hidden;
            }
            
            .contact-name {
                font-weight: 500;
                margin-bottom: 3px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .contact-status {
                font-size: 12px;
                color: #666;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .chat-area {
                flex: 1;
                display: flex;
                flex-direction: column;
                background-color: #fff;
            }
            
            .chat-header {
                padding: 15px;
                border-bottom: 1px solid #ddd;
                display: flex;
                align-items: center;
            }
            
            .chat-header .contact-avatar {
                width: 36px;
                height: 36px;
                font-size: 18px;
            }
            
            .chat-messages {
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background-color: #f9f9f9;
            }
            
            .message {
                margin-bottom: 15px;
                display: flex;
                flex-direction: column;
                max-width: 80%;
                animation: fadeIn 0.3s ease;
            }
            
            .message.user-message {
                align-self: flex-end;
            }
            
            .message-bubble {
                padding: 10px 15px;
                border-radius: 18px;
                background-color: #e1e1e1;
                color: #333;
                position: relative;
            }
            
            .user-message .message-bubble {
                background-color: var(--primary-color);
                color: white;
                border-bottom-right-radius: 4px;
            }
            
            .message-time {
                font-size: 11px;
                color: #888;
                margin-top: 4px;
                padding: 0 5px;
            }
            
            .user-message .message-time {
                align-self: flex-end;
            }
            
            .chat-input {
                padding: 15px;
                border-top: 1px solid #ddd;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .chat-input-field {
                flex: 1;
                padding: 10px 15px;
                border: 1px solid #ddd;
                border-radius: 20px;
                outline: none;
                resize: none;
                max-height: 100px;
                overflow-y: auto;
            }
            
            .chat-send-btn {
                width: 40px;
                height: 40px;
                background-color: var(--primary-color);
                color: white;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                font-size: 18px;
                border: none;
                transition: background-color 0.2s;
            }
            
            .chat-send-btn:hover {
                background-color: var(--secondary-color);
            }
            
            @media (max-width: 700px) {
                .messages-sidebar {
                    width: 80px;
                }
                
                .messages-header h2 {
                    display: none;
                }
                
                .messages-header {
                    justify-content: center;
                }
                
                .contact-info {
                    display: none;
                }
                
                .contact-item {
                    justify-content: center;
                }
                
                .contact-avatar {
                    margin-right: 0;
                }
            }
        `;
        this.container.appendChild(style);
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Scroll chat to bottom
        const chatMessages = this.container.querySelector('.chat-messages');
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    },
    
    // Render the current chat
    renderCurrentChat: function() {
        if (!this.currentChat) return '';
        
        const contact = this.contactList.find(c => c.id === this.currentChat);
        const chatHistory = this.chats[this.currentChat] || [];
        
        return `
            <div class="chat-header">
                <div class="contact-avatar ${contact.online ? 'online' : ''}">
                    ${contact.avatar}
                </div>
                <div class="contact-info">
                    <div class="contact-name">${contact.name}</div>
                    <div class="contact-status">
                        ${contact.isTyping ? 'typing...' : contact.online ? 'online' : contact.lastSeen}
                    </div>
                </div>
            </div>
            
            <div class="chat-messages">
                ${chatHistory.map(msg => `
                    <div class="message ${msg.sender === 'user' ? 'user-message' : ''}">
                        <div class="message-bubble">${msg.message}</div>
                        <div class="message-time">${msg.time}</div>
                    </div>
                `).join('')}
            </div>
            
            <div class="chat-input">
                <textarea class="chat-input-field" id="message-input" placeholder="Type a message..."></textarea>
                <button class="chat-send-btn" id="send-button">➤</button>
            </div>
        `;
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Contact selection
        const contactItems = this.container.querySelectorAll('.contact-item');
        contactItems.forEach(item => {
            item.addEventListener('click', () => {
                const contactId = item.dataset.contact;
                this.currentChat = contactId;
                this.render();
            });
        });
        
        // Send message
        const sendButton = this.container.querySelector('#send-button');
        const messageInput = this.container.querySelector('#message-input');
        
        if (sendButton && messageInput) {
            // Send on button click
            sendButton.addEventListener('click', () => {
                this.sendMessage(messageInput.value);
            });
            
            // Send on Enter key (but allow Shift+Enter for new line)
            messageInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage(messageInput.value);
                }
            });
        }
    },
    
    // Send a message
    sendMessage: function(messageText) {
        if (!messageText.trim() || !this.currentChat) return;
        
        const messageInput = this.container.querySelector('#message-input');
        messageInput.value = '';
        
        // Get current time
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const time = `${hours}:${minutes}`;
        
        // Add message to chat history
        if (!this.chats[this.currentChat]) {
            this.chats[this.currentChat] = [];
        }
        
        this.chats[this.currentChat].push({
            sender: 'user',
            message: messageText.trim(),
            time: time
        });
        
        // Re-render to show the new message
        this.render();
        
        // Simulate "typing" state
        const contact = this.contactList.find(c => c.id === this.currentChat);
        contact.isTyping = true;
        this.render();
        
        // Simulate a reply after a delay
        setTimeout(() => {
            contact.isTyping = false;
            
            // Get a random response from the auto-responses
            const responses = this.autoResponses[this.currentChat];
            const response = responses[Math.floor(Math.random() * responses.length)];
            
            // Add response to chat history
            this.chats[this.currentChat].push({
                sender: this.currentChat,
                message: response,
                time: time
            });
            
            // Re-render with the response
            this.render();
        }, 2000);
    }
}; 