class Profile {
    constructor(db, ui, auth) {
        this.db = db;
        this.ui = ui;
        this.auth = auth;
        this.initProfileEvents();
    }

    initProfileEvents() {
        document.getElementById('profile-btn').addEventListener('click', () => {
            this.openProfile();
        });

        document.getElementById('close-profile').addEventListener('click', () => {
            this.ui.hideModal('profile-modal');
        });

        document.getElementById('save-profile').addEventListener('click', () => {
            this.saveProfile();
        });

        document.getElementById('logout-btn').addEventListener('click', () => {
            this.auth.logout();
        });

        document.getElementById('delete-account').addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить.')) {
                this.deleteAccount();
            }
        });
    }

    openProfile() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const profileForm = this.ui.createProfileForm(currentUser);
        document.getElementById('profile-body').innerHTML = profileForm;
        this.ui.showModal('profile-modal');
    }

    saveProfile() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const newUsername = document.getElementById('profile-username').value.trim();
        const newTag = document.getElementById('profile-tag').value.trim().toUpperCase();
        const newPassword = document.getElementById('new-password').value;
        const avatarUrl = document.getElementById('avatar-url').value.trim();

        // Проверка тега
        if (newTag && !/^[A-Z]{3}$/.test(newTag)) {
            alert('Тег должен содержать ровно 3 латинские буквы (A-Z)');
            return;
        }

        // Проверка уникальности имени пользователя
        if (newUsername && newUsername !== currentUser.username) {
            if (this.db.getUserByUsername(newUsername)) {
                alert('Пользователь с таким именем уже существует');
                return;
            }
        }

        const updates = {};
        if (newUsername) updates.username = newUsername;
        if (newTag) updates.tag = newTag;
        if (newPassword) updates.password = newPassword;
        if (avatarUrl) updates.avatar = avatarUrl;

        if (Object.keys(updates).length > 0) {
            this.db.updateUser(currentUser.username, updates);
            const updatedUser = { ...currentUser, ...updates };
            this.auth.updateCurrentUser(updatedUser);

            alert('Профиль обновлен!');
        }

        this.ui.hideModal('profile-modal');
    }

    deleteAccount() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        this.db.deleteUser(currentUser.username);
        this.auth.logout();
        alert('Аккаунт удален');
    }
}

export default Profile;