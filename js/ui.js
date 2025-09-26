class UI {
    constructor() {
        this.currentChat = null;
    }

    showRegister() {
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'flex';
    }

    showLogin() {
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('register-container').style.display = 'flex';
    }

    showMainInterface(user) {
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('main-container').style.display = 'flex';

        this.applyUserSettings(user.settings);
    }

    applyUserSettings(settings) {
        document.body.style.fontSize = settings.fontSize === 'small' ? '14px' :
                                      settings.fontSize === 'large' ? '18px' : '16px';
        document.body.style.fontFamily = settings.fontFamily;
    }

    loadChats(chats, users, currentUserId, onChatSelect) {
        const chatsList = document.getElementById('chats-list');
        chatsList.innerHTML = '';

        if (chats.length === 0) {
            chatsList.innerHTML = '<div style="padding: 15px; text-align: center; color: rgba(255,255,255,0.7);">Чатов пока нет</div>';
            return;
        }

        chats.forEach(chat => {
            const chatElement = document.createElement('div');
            chatElement.className = 'chat-item';
            chatElement.dataset.chatId = chat.id;

            let chatName, lastMessage, avatarText;
            if (chat.type === 'private') {
                const otherUserId = chat.user1 === currentUserId ? chat.user2 : chat.user1;
                const otherUser = users.find(u => u.id === otherUserId);
                chatName = otherUser ? otherUser.username : 'Неизвестный пользователь';
                avatarText = chatName.charAt(0).toUpperCase();
            } else {
                chatName = chat.name;
                avatarText = chatName.charAt(0).toUpperCase();
            }

            // В реальном приложении здесь нужно получать последнее сообщение
            lastMessage = 'Нет сообщений';

            chatElement.innerHTML = `
                <div class="chat-avatar">${avatarText}</div>
                <div class="chat-info">
                    <div class="chat-name">${chatName}</div>
                    <div class="last-message">${lastMessage}</div>
                </div>
            `;

            chatElement.addEventListener('click', () => {
                onChatSelect(chat);
                this.setActiveChat(chat.id);
            });

            chatsList.appendChild(chatElement);
        });
    }

    setActiveChat(chatId) {
        document.querySelectorAll('.chat-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`.chat-item[data-chat-id="${chatId}"]`)?.classList.add('active');
    }

    loadMessages(messages, users, currentUserId, chat) {
        const messagesContainer = document.getElementById('messages-container');
        messagesContainer.innerHTML = '';

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            const isOwn = message.senderId === currentUserId;

            const sender = users.find(u => u.id === message.senderId);
            const senderName = sender ? sender.username : 'Неизвестный';
            const avatarText = senderName.charAt(0).toUpperCase();

            messageElement.className = `message ${isOwn ? 'own' : 'other'}`;
            messageElement.innerHTML = `
                <div class="message-avatar">${avatarText}</div>
                <div class="message-content">
                    ${chat.type === 'group' && !isOwn ? `<div class="message-sender">${senderName}</div>` : ''}
                    <div class="message-text">${message.text}</div>
                    <div class="message-time">${new Date(message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
            `;

            messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    updateChatHeader(chat, users, currentUserId) {
        let chatName, avatarText;
        if (chat.type === 'private') {
            const otherUserId = chat.user1 === currentUserId ? chat.user2 : chat.user1;
            const otherUser = users.find(u => u.id === otherUserId);
            chatName = otherUser ? otherUser.username : 'Неизвестный пользователь';
            avatarText = chatName.charAt(0).toUpperCase();
        } else {
            chatName = chat.name;
            avatarText = chatName.charAt(0).toUpperCase();
        }

        document.getElementById('current-chat-title').textContent = chatName;
        document.getElementById('current-chat-avatar').textContent = avatarText;

        document.getElementById('message-input').disabled = false;
        document.getElementById('send-btn').disabled = false;
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'flex';
    }

    hideModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    createSettingsForm(settings) {
        return `
            <div class="form-group">
                <label for="font-size">Размер шрифта</label>
                <select id="font-size">
                    <option value="small" ${settings.fontSize === 'small' ? 'selected' : ''}>Маленький</option>
                    <option value="medium" ${settings.fontSize === 'medium' ? 'selected' : ''}>Средний</option>
                    <option value="large" ${settings.fontSize === 'large' ? 'selected' : ''}>Большой</option>
                </select>
            </div>
            <div class="form-group">
                <label for="font-family">Выбор шрифта</label>
                <select id="font-family">
                    <option value="Arial, sans-serif" ${settings.fontFamily === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
                    <option value="'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" ${settings.fontFamily.includes('Segoe UI') ? 'selected' : ''}>Segoe UI</option>
                    <option value="'Times New Roman', serif" ${settings.fontFamily === "'Times New Roman', serif" ? 'selected' : ''}>Times New Roman</option>
                </select>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="notifications-sound" ${settings.notificationsSound ? 'checked' : ''}> Звук уведомлений
                </label>
            </div>
            <div class="form-group">
                <label for="microphone">Выбор микрофона</label>
                <select id="microphone">
                    <option value="default" ${settings.microphone === 'default' ? 'selected' : ''}>Микрофон по умолчанию</option>
                </select>
            </div>
        `;
    }

    createProfileForm(user) {
        return `
            <div class="avatar-preview" id="avatar-preview">${user.username.charAt(0).toUpperCase()}</div>
            <div class="form-group">
                <label for="avatar-url">Смена аватара (URL)</label>
                <input type="text" id="avatar-url" placeholder="Введите URL изображения">
            </div>
            <div class="form-group">
                <label for="profile-username">Смена никнейма</label>
                <input type="text" id="profile-username" placeholder="Новый никнейм" value="${user.username}">
            </div>
            <div class="form-group">
                <label for="profile-tag">Смена тега</label>
                <input type="text" id="profile-tag" placeholder="Новый тег (3 латинские буквы)" value="${user.tag}">
                <div class="tag-format">Тег должен содержать 3 латинские буквы (A-Z)</div>
            </div>
            <div class="form-group">
                <label for="new-password">Смена пароля</label>
                <input type="password" id="new-password" placeholder="Новый пароль">
            </div>
        `;
    }

    createGroupForm() {
        return `
            <div class="form-group">
                <label for="group-name">Название группы</label>
                <input type="text" id="group-name" placeholder="Введите название группы">
            </div>
            <div id="group-code-display" style="display: none; margin-top: 15px; padding: 10px; background-color: var(--light-gray); border-radius: var(--border-radius);">
                <strong>Код группы: </strong><span id="group-code"></span>
            </div>
        `;
    }
}


window.Ui = Ui;
