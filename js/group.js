class Groups {
    constructor(db, ui, auth, chat) {
        this.db = db;
        this.ui = ui;
        this.auth = auth;
        this.chat = chat;
        this.initGroupEvents();
    }

    initGroupEvents() {
        document.getElementById('group-btn').addEventListener('click', () => {
            this.openGroupModal();
        });

        document.getElementById('close-group').addEventListener('click', () => {
            this.ui.hideModal('group-modal');
        });

        document.getElementById('cancel-group').addEventListener('click', () => {
            this.ui.hideModal('group-modal');
        });

        document.getElementById('create-group').addEventListener('click', () => {
            this.createGroup();
        });
    }

    openGroupModal() {
        const groupForm = this.ui.createGroupForm();
        document.getElementById('group-body').innerHTML = groupForm;
        document.getElementById('group-code-display').style.display = 'none';
        this.ui.showModal('group-modal');
    }

    createGroup() {
        const groupName = document.getElementById('group-name').value.trim();
        const currentUser = this.auth.getCurrentUser();

        if (!groupName) {
            alert('Введите название группы');
            return;
        }

        const code = this.generateGroupCode();

        const newGroup = {
            id: `group_${Date.now()}`,
            name: groupName,
            code,
            createdBy: currentUser.id,
            members: [currentUser.id],
            createdAt: new Date().toISOString()
        };

        this.db.addGroup(newGroup);

        // Создаем чат для группы
        const newChat = {
            id: newGroup.id,
            type: 'group',
            name: groupName,
            members: [currentUser.id]
        };

        this.db.addChat(newChat);

        // Показываем код группы
        document.getElementById('group-code').textContent = code;
        document.getElementById('group-code-display').style.display = 'block';

        // Обновляем список чатов
        setTimeout(() => {
            this.chat.loadChats();
            this.ui.hideModal('group-modal');
        }, 2000);
    }

    generateGroupCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    joinGroup(code) {
        const group = this.db.getGroupByCode(code);
        if (!group) {
            alert('Группа с таким кодом не найдена');
            return null;
        }

        const currentUser = this.auth.getCurrentUser();
        if (group.members.includes(currentUser.id)) {
            alert('Вы уже состоите в этой группе');
            return this.db.getChatById(group.id);
        }

        group.members.push(currentUser.id);
        this.db.saveGroups();

        const chat = this.db.getChatById(group.id);
        if (chat) {
            chat.members.push(currentUser.id);
            this.db.saveChats();
        }

        return chat;
    }
}


window.Group = Group;
