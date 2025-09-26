import Database from './database.js';
import Auth from './auth.js';
import UI from './ui.js';
import Chat from './chat.js';
import Settings from './settings.js';
import Profile from './profile.js';
import Groups from './groups.js';

class SiruxxMessenger {
    constructor() {
        this.db = new Database();
        this.ui = new UI();
        this.auth = new Auth(this.db, this.ui);
        this.chat = new Chat(this.db, this.ui, this.auth);
        this.settings = new Settings(this.db, this.ui, this.auth);
        this.profile = new Profile(this.db, this.ui, this.auth);
        this.groups = new Groups(this.db, this.ui, this.auth, this.chat);

        this.init();
    }

    init() {
        this.checkAuthStatus();
    }

    checkAuthStatus() {
        const currentUser = this.auth.getCurrentUser();
        if (currentUser) {
            this.ui.showMainInterface(currentUser);
            this.chat.loadChats();
        }
    }
}

// Инициализация приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    new SiruxxMessenger();
});