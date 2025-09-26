// Имитация базы данных через localStorage
class Database {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('siruxx_users')) || [];
        this.chats = JSON.parse(localStorage.getItem('siruxx_chats')) || [];
        this.messages = JSON.parse(localStorage.getItem('siruxx_messages')) || [];
        this.groups = JSON.parse(localStorage.getItem('siruxx_groups')) || [];
    }

    saveUsers() {
        localStorage.setItem('siruxx_users', JSON.stringify(this.users));
    }

    saveChats() {
        localStorage.setItem('siruxx_chats', JSON.stringify(this.chats));
    }

    saveMessages() {
        localStorage.setItem('siruxx_messages', JSON.stringify(this.messages));
    }

    saveGroups() {
        localStorage.setItem('siruxx_groups', JSON.stringify(this.groups));
    }

    // Методы для работы с пользователями
    addUser(user) {
        this.users.push(user);
        this.saveUsers();
        return user;
    }

    getUserByUsername(username) {
        return this.users.find(user => user.username === username);
    }

    getUserById(id) {
        return this.users.find(user => user.id === id);
    }

    updateUser(username, updates) {
        const userIndex = this.users.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            this.users[userIndex] = { ...this.users[userIndex], ...updates };
            this.saveUsers();
            return true;
        }
        return false;
    }

    deleteUser(username) {
        const userIndex = this.users.findIndex(user => user.username === username);
        if (userIndex !== -1) {
            this.users.splice(userIndex, 1);
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Методы для работы с чатами
    addChat(chat) {
        this.chats.push(chat);
        this.saveChats();
        return chat;
    }

    getChatsForUser(userId) {
        return this.chats.filter(chat =>
            chat.type === 'private' && (chat.user1 === userId || chat.user2 === userId) ||
            chat.type === 'group' && chat.members.includes(userId)
        );
    }

    getChatById(chatId) {
        return this.chats.find(chat => chat.id === chatId);
    }

    // Методы для работы с сообщениями
    addMessage(message) {
        this.messages.push(message);
        this.saveMessages();
        return message;
    }

    getMessagesForChat(chatId) {
        return this.messages.filter(message => message.chatId === chatId)
            .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    // Методы для работы с группами
    addGroup(group) {
        this.groups.push(group);
        this.saveGroups();
        return group;
    }

    getGroupByCode(code) {
        return this.groups.find(group => group.code === code);
    }

    getGroupById(id) {
        return this.groups.find(group => group.id === id);
    }
}


// УДАЛИТЬ: export default Database;
// ДОБАВИТЬ:
window.Database = Database;
