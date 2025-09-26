import Database from './database.js';
import UI from './ui.js';

class Auth {
    constructor(db, ui) {
        this.db = db;
        this.ui = ui;
        this.currentUser = null;
        this.initAuthEvents();
    }

    initAuthEvents() {
        // Переключение между окнами регистрации и входа
        document.getElementById('go-to-login').addEventListener('click', () => {
            this.ui.showLogin();
        });

        document.getElementById('go-to-register').addEventListener('click', () => {
            this.ui.showRegister();
        });

        // Формы регистрации и входа
        document.getElementById('register-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.register();
        });

        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });
    }

    register() {
        const username = document.getElementById('reg-username').value;
        const password = document.getElementById('reg-password').value;

        if (this.db.getUserByUsername(username)) {
            alert('Пользователь с таким именем уже существует');
            return;
        }

        const tag = this.generateTag();

        const newUser = {
            id: Date.now().toString(),
            username,
            password, // В реальном приложении пароль должен хешироваться!
            tag,
            avatar: '',
            settings: {
                fontSize: 'medium',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                notificationsSound: true,
                microphone: 'default'
            }
        };

        this.db.addUser(newUser);
        alert('Регистрация успешна! Теперь вы можете войти в систему.');
        this.ui.showLogin();
        document.getElementById('register-form').reset();
    }

    generateTag() {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let tag = '';
        for (let i = 0; i < 3; i++) {
            tag += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        return tag;
    }

    login() {
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        const user = this.db.getUserByUsername(username);
        if (!user || user.password !== password) {
            alert('Неверное имя пользователя или пароль');
            return;
        }

        this.currentUser = user;
        localStorage.setItem('siruxx_currentUser', JSON.stringify(user));
        this.ui.showMainInterface(user);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('siruxx_currentUser');
        this.ui.showLogin();
        document.getElementById('login-form').reset();
    }

    getCurrentUser() {
        if (!this.currentUser) {
            const savedUser = localStorage.getItem('siruxx_currentUser');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
            }
        }
        return this.currentUser;
    }

    updateCurrentUser(updatedUser) {
        this.currentUser = updatedUser;
        localStorage.setItem('siruxx_currentUser', JSON.stringify(updatedUser));
    }
}

export default Auth;