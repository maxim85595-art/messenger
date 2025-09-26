class Settings {
    constructor(db, ui, auth) {
        this.db = db;
        this.ui = ui;
        this.auth = auth;
        this.initSettingsEvents();
    }

    initSettingsEvents() {
        document.getElementById('settings-btn').addEventListener('click', () => {
            this.openSettings();
        });

        document.getElementById('close-settings').addEventListener('click', () => {
            this.ui.hideModal('settings-modal');
        });

        document.getElementById('save-settings').addEventListener('click', () => {
            this.saveSettings();
        });
    }

    openSettings() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const settingsForm = this.ui.createSettingsForm(currentUser.settings);
        document.getElementById('settings-body').innerHTML = settingsForm;
        this.ui.showModal('settings-modal');
    }

    saveSettings() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const newSettings = {
            fontSize: document.getElementById('font-size').value,
            fontFamily: document.getElementById('font-family').value,
            notificationsSound: document.getElementById('notifications-sound').checked,
            microphone: document.getElementById('microphone').value
        };

        this.db.updateUser(currentUser.username, { settings: newSettings });
        const updatedUser = { ...currentUser, settings: newSettings };
        this.auth.updateCurrentUser(updatedUser);

        this.ui.applyUserSettings(newSettings);
        this.ui.hideModal('settings-modal');
        alert('Настройки сохранены!');
    }
}

export default Settings;