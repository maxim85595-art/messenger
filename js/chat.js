class Chat {
    constructor(db, ui, auth) {
        this.db = db;
        this.ui = ui;
        this.auth = auth;
        this.currentChat = null;
        this.initChatEvents();
    }

    initChatEvents() {
        document.getElementById('send-btn').addEventListener('click', () => {
            this.sendMessage();
        });

        document.getElementById('message-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchUsersAndGroups(e.target.value);
        });
    }

    loadChats() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const userChats = this.db.getChatsForUser(currentUser.id);
        this.ui.loadChats(userChats, this.db.users, currentUser.id, (chat) => {
            this.selectChat(chat);
        });
    }

    selectChat(chat) {
        this.currentChat = chat;
        const currentUser = this.auth.getCurrentUser();

        this.ui.updateChatHeader(chat, this.db.users, currentUser.id);

        const messages = this.db.getMessagesForChat(chat.id);
        this.ui.loadMessages(messages, this.db.users, currentUser.id, chat);
    }

    sendMessage() {
        const input = document.getElementById('message-input');
        const text = input.value.trim();
        const currentUser = this.auth.getCurrentUser();

        if (!text || !this.currentChat || !currentUser) return;

        const newMessage = {
            id: Date.now().toString(),
            chatId: this.currentChat.id,
            senderId: currentUser.id,
            text,
            timestamp: new Date().toISOString()
        };

        this.db.addMessage(newMessage);
        input.value = '';

        this.selectChat(this.currentChat);
        this.loadChats(); // Обновляем список чатов
    }

    searchUsersAndGroups(query) {
        if (query.length > 2) {
            // В реальном приложении здесь был бы поиск по пользователям и группам
            console.log(`Поиск: ${query}`);
        }
    }

    createPrivateChat(otherUserId) {
        const currentUser = this.auth.getCurrentUser();
        const existingChat = this.db.chats.find(chat =>
            chat.type === 'private' &&
            ((chat.user1 === currentUser.id && chat.user2 === otherUserId) ||
             (chat.user1 === otherUserId && chat.user2 === currentUser.id))
        );

        if (existingChat) {
            return existingChat;
        }

        const newChat = {
            id: `private_${Date.now()}`,
            type: 'private',
            user1: currentUser.id,
            user2: otherUserId,
            createdAt: new Date().toISOString()
        };

        return this.db.addChat(newChat);
    }
}

export default Chat;