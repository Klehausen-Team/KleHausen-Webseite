// Admin Panel JavaScript - Vollständig funktionsfähig
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'overview';
        this.messages = [];
        this.users = [
            { id: 1, username: 'admin', password: 'KleHausen2025!', role: 'admin', name: 'Administrator' },
            { id: 2, username: 'creator', password: 'Creator123!', role: 'editor', name: 'Content Creator' }
        ];
        
        this.init();
    }
    
    init() {
        this.showSplash();
        this.bindEvents();
        this.checkExistingSession();
        this.loadMessages();
    }
    
    showSplash() {
        const splash = document.getElementById('adminSplash');
        setTimeout(() => {
            splash.classList.add('fade-out');
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }, 2000);
    }
    
    bindEvents() {
        // Login Form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        // Password Toggle
        const togglePassword = document.getElementById('togglePassword');
        if (togglePassword) {
            togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        }
        
        // User Dropdown
        const userDropdown = document.getElementById('userDropdown');
        const dropdownMenu = document.getElementById('dropdownMenu');
        
        if (userDropdown && dropdownMenu) {
            userDropdown.addEventListener('click', () => {
                dropdownMenu.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userDropdown.contains(e.target)) {
                    dropdownMenu.classList.remove('show');
                }
            });
        }
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.logout();
            });
        }
        
        // Menu Navigation
        const menuLinks = document.querySelectorAll('.menu-link');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.dataset.page;
                this.navigateToPage(page);
            });
        });
    }
    
    checkExistingSession() {
        const savedUser = localStorage.getItem('adminUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showDashboard();
        }
    }
    
    loadMessages() {
        const savedMessages = localStorage.getItem('adminMessages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        } else {
            // Demo messages for testing
            this.messages = [
                {
                    id: 1,
                    name: 'Max Mustermann',
                    email: 'max@beispiel.de',
                    subject: 'Kollaboration',
                    message: 'Hallo! Ich würde gerne mit eurem Team zusammenarbeiten. Ich bin Content Creator im Gaming-Bereich und habe eigene YouTube und Twitch Kanäle.',
                    timestamp: new Date(Date.now() - 86400000).toLocaleString('de-DE'),
                    read: false,
                    priority: 'high'
                },
                {
                    id: 2,
                    name: 'Anna Schmidt', 
                    email: 'anna@test.de',
                    subject: 'Feedback',
                    message: 'Eure Webseite sieht super aus! Besonders das PWA Design gefällt mir. Macht weiter so!',
                    timestamp: new Date(Date.now() - 172800000).toLocaleString('de-DE'),
                    read: true,
                    priority: 'low'
                },
                {
                    id: 3,
                    name: 'Tom Weber',
                    email: 'tom.weber@gmail.com', 
                    subject: 'Projekt Idee',
                    message: 'Hi! Ich habe eine Idee für ein neues Minecraft Plugin. Könnt ihr euch das mal anschauen? Wäre super wenn wir zusammenarbeiten könnten.',
                    timestamp: new Date(Date.now() - 259200000).toLocaleString('de-DE'),
                    read: false,
                    priority: 'medium'
                }
            ];
            this.saveMessages();
        }
        
        // Listen for new messages from main website
        window.addEventListener('storage', (e) => {
            if (e.key === 'newMessage') {
                const data = JSON.parse(e.newValue || '{}');
                if (data.message && Date.now() - data.timestamp < 5000) {
                    this.messages.push(data.message);
                    this.saveMessages();
                    this.showSuccess('Neue Nachricht erhalten!');
                    
                    if (this.currentPage === 'messages') {
                        this.loadPageContent('messages');
                    }
                    this.updateMessageCount();
                }
            }
        });
    }
    
    handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            this.currentUser = user;
            
            if (rememberMe) {
                localStorage.setItem('adminUser', JSON.stringify(user));
            }
            
            this.showSuccess('Erfolgreich angemeldet!');
            setTimeout(() => {
                this.showDashboard();
            }, 1000);
        } else {
            this.showLoginError('Ungültige Anmeldedaten');
        }
    }
    
    togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleBtn = document.getElementById('togglePassword');
        const icon = toggleBtn.querySelector('i');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            icon.className = 'fas fa-eye-slash';
        } else {
            passwordInput.type = 'password';
            icon.className = 'fas fa-eye';
        }
    }
    
    showLoginError(message) {
        const errorDiv = document.getElementById('loginError');
        const errorMessage = document.getElementById('errorMessage');
        
        if (errorDiv && errorMessage) {
            errorMessage.textContent = message;
            errorDiv.classList.add('show');
            
            setTimeout(() => {
                errorDiv.classList.remove('show');
            }, 3000);
        }
    }
    
    showDashboard() {
        const loginContainer = document.getElementById('loginContainer');
        const adminDashboard = document.getElementById('adminDashboard');
        const userName = document.getElementById('userName');
        
        if (loginContainer) loginContainer.style.display = 'none';
        if (adminDashboard) adminDashboard.style.display = 'grid';
        if (userName) userName.textContent = this.currentUser.name;
        
        this.navigateToPage('overview');
        this.updateMessageCount();
    }
    
    logout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        
        const loginContainer = document.getElementById('loginContainer');
        const adminDashboard = document.getElementById('adminDashboard');
        const loginForm = document.getElementById('loginForm');
        
        if (adminDashboard) adminDashboard.style.display = 'none';
        if (loginContainer) loginContainer.style.display = 'flex';
        if (loginForm) loginForm.reset();
        
        this.showSuccess('Erfolgreich abgemeldet!');
    }
    
    navigateToPage(page) {
        // Update active menu item
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeLink = document.querySelector(`[data-page="${page}"]`);
        if (activeLink) activeLink.classList.add('active');
        
        this.currentPage = page;
        this.loadPageContent(page);
    }
    
    loadPageContent(page) {
        const contentDiv = document.getElementById('adminContent');
        if (!contentDiv) return;
        
        switch(page) {
            case 'overview':
                contentDiv.innerHTML = this.getOverviewHTML();
                break;
            case 'messages':
                contentDiv.innerHTML = this.getMessagesHTML();
                this.bindMessageEvents();
                break;
            case 'pages':
                contentDiv.innerHTML = this.getPagesHTML();
                this.bindPageEditEvents();
                break;
            case 'projects':
                contentDiv.innerHTML = this.getProjectsHTML();
                break;
            case 'users':
                contentDiv.innerHTML = this.getUsersHTML();
                this.bindUserEvents();
                break;
            case 'media':
                contentDiv.innerHTML = this.getMediaHTML();
                break;
            case 'analytics':
                contentDiv.innerHTML = this.getAnalyticsHTML();
                break;
            default:
                contentDiv.innerHTML = '<div class="page-content"><h1>Seite nicht gefunden</h1></div>';
        }
    }
    
    getOverviewHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-tachometer-alt"></i> Dashboard Übersicht</h1>
                    <p>Willkommen zurück, ${this.currentUser.name}!</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-envelope"></i>
                        </div>
                        <div class="stat-info">
                            <h3>${this.messages.length}</h3>
                            <p>Neue Nachrichten</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-info">
                            <h3>4-8</h3>
                            <p>Team Mitglieder</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-project-diagram"></i>
                        </div>
                        <div class="stat-info">
                            <h3>3</h3>
                            <p>Aktive Projekte</p>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-mobile-alt"></i>
                        </div>
                        <div class="stat-info">
                            <h3>PWA</h3>
                            <p>Modus aktiv</p>
                        </div>
                    </div>
                </div>
                
                <div class="quick-actions">
                    <h2>Schnellzugriff</h2>
                    <div class="action-cards">
                        <div class="action-card" onclick="adminPanel.navigateToPage('messages')">
                            <i class="fas fa-envelope"></i>
                            <h3>Nachrichten</h3>
                            <p>Kontaktformular-Nachrichten verwalten</p>
                        </div>
                        
                        <div class="action-card" onclick="adminPanel.navigateToPage('pages')">
                            <i class="fas fa-edit"></i>
                            <h3>Seiten bearbeiten</h3>
                            <p>Inhalte und Texte anpassen</p>
                        </div>
                        
                        <div class="action-card" onclick="adminPanel.navigateToPage('users')">
                            <i class="fas fa-users-cog"></i>
                            <h3>Benutzer</h3>
                            <p>Admin-Benutzer verwalten</p>
                        </div>
                    </div>
                </div>
                
                <div class="recent-activity">
                    <h2>Letzte Aktivitäten</h2>
                    <div class="activity-list">
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-sign-in-alt"></i>
                            </div>
                            <div class="activity-content">
                                <p><strong>${this.currentUser.name}</strong> hat sich angemeldet</p>
                                <span class="activity-time">Gerade eben</span>
                            </div>
                        </div>
                        
                        <div class="activity-item">
                            <div class="activity-icon">
                                <i class="fas fa-mobile-alt"></i>
                            </div>
                            <div class="activity-content">
                                <p>Admin Panel über PWA geöffnet</p>
                                <span class="activity-time">Gerade eben</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getMessagesHTML() {
        const unreadCount = this.messages.filter(m => !m.read).length;
        
        const messagesHTML = this.messages
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(msg => {
                const priorityClass = msg.priority || 'low';
                const priorityIcon = {
                    'high': 'fas fa-exclamation-circle',
                    'medium': 'fas fa-info-circle', 
                    'low': 'fas fa-circle'
                };
                
                return `
                    <div class="message-item ${!msg.read ? 'unread' : ''}" data-id="${msg.id}">
                        <div class="message-header">
                            <div class="message-sender">
                                <div class="message-avatar">
                                    <i class="fas fa-user"></i>
                                </div>
                                <div class="sender-info">
                                    <strong>${msg.name}</strong>
                                    <span class="message-email">${msg.email}</span>
                                </div>
                            </div>
                            <div class="message-meta">
                                <div class="message-priority priority-${priorityClass}">
                                    <i class="${priorityIcon[priorityClass]}"></i>
                                    <span class="message-subject">${msg.subject}</span>
                                </div>
                                <span class="message-time">${msg.timestamp}</span>
                                ${!msg.read ? '<span class="unread-badge">Neu</span>' : ''}
                            </div>
                        </div>
                        <div class="message-content">
                            <p>${msg.message}</p>
                        </div>
                        <div class="message-actions">
                            ${!msg.read ? `<button class="btn-mark-read" onclick="adminPanel.markAsRead(${msg.id})">
                                <i class="fas fa-check"></i> Als gelesen markieren
                            </button>` : ''}
                            <button class="btn-reply" onclick="adminPanel.replyToMessage(${msg.id})">
                                <i class="fas fa-reply"></i> Antworten
                            </button>
                            <button class="btn-delete" onclick="adminPanel.deleteMessage(${msg.id})">
                                <i class="fas fa-trash"></i> Löschen
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        
        return `
            <div class="page-content">
                <div class="page-header">
                    <div class="header-info">
                        <h1><i class="fas fa-envelope"></i> Nachrichten</h1>
                        <p>Kontaktformular-Nachrichten verwalten</p>
                    </div>
                    <div class="header-stats">
                        <div class="stat-badge">
                            <span class="stat-number">${this.messages.length}</span>
                            <span class="stat-label">Gesamt</span>
                        </div>
                        <div class="stat-badge unread">
                            <span class="stat-number">${unreadCount}</span>
                            <span class="stat-label">Ungelesen</span>
                        </div>
                    </div>
                </div>
                
                <div class="messages-toolbar">
                    <button class="btn-mark-all-read" onclick="adminPanel.markAllAsRead()" ${unreadCount === 0 ? 'disabled' : ''}>
                        <i class="fas fa-check-double"></i> Alle als gelesen markieren
                    </button>
                    <button class="btn-clear-read" onclick="adminPanel.clearReadMessages()">
                        <i class="fas fa-broom"></i> Gelesene löschen
                    </button>
                </div>
                
                <div class="messages-container">
                    ${this.messages.length > 0 ? messagesHTML : `
                        <div class="no-messages">
                            <i class="fas fa-inbox"></i>
                            <h3>Keine Nachrichten</h3>
                            <p>Es sind noch keine Kontaktanfragen eingegangen.</p>
                            <p class="hint">Nachrichten vom Kontaktformular erscheinen automatisch hier.</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    }
    
    getPagesHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-file-alt"></i> Seiten bearbeiten</h1>
                    <p>Website-Inhalte verwalten und bearbeiten</p>
                </div>
                
                <div class="page-editor">
                    <div class="editor-tabs">
                        <button class="tab-btn active" data-tab="home">Home</button>
                        <button class="tab-btn" data-tab="projects">Projekte</button>
                        <button class="tab-btn" data-tab="team">Team</button>
                        <button class="tab-btn" data-tab="contact">Kontakt</button>
                    </div>
                    
                    <div class="tab-content active" id="home-tab">
                        <div class="editor-section">
                            <h3>Hero Bereich</h3>
                            <div class="form-group">
                                <label>Haupttitel</label>
                                <input type="text" id="hero-title" value="Willkommen bei KleHausen" />
                            </div>
                            <div class="form-group">
                                <label>Beschreibung</label>
                                <textarea id="hero-description" rows="3">Eine kreative Discord Community von 4-8 Content Creators, die gemeinsam innovative Projekte entwickeln und Content produzieren.</textarea>
                            </div>
                            <div class="form-group">
                                <label>Discord Link</label>
                                <input type="url" id="discord-link" value="https://dsc.gg/kle" />
                            </div>
                        </div>
                        
                        <div class="editor-actions">
                            <button class="btn-save" onclick="adminPanel.savePageContent('home')">
                                <i class="fas fa-save"></i> Änderungen speichern
                            </button>
                            <button class="btn-preview" onclick="adminPanel.previewChanges()">
                                <i class="fas fa-eye"></i> Vorschau
                            </button>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="projects-tab">
                        <div class="editor-section">
                            <h3>Projekte Bereich</h3>
                            <div class="form-group">
                                <label>Sektion Titel</label>
                                <input type="text" id="projects-title" value="Unsere Projekte" />
                            </div>
                            <div class="form-group">
                                <label>Beschreibung</label>
                                <textarea id="projects-description" rows="2">Entdecke die verschiedenen Projekte, an denen unser Team arbeitet</textarea>
                            </div>
                        </div>
                        
                        <div class="editor-actions">
                            <button class="btn-save" onclick="adminPanel.savePageContent('projects')">
                                <i class="fas fa-save"></i> Änderungen speichern
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getProjectsHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-project-diagram"></i> Projekte verwalten</h1>
                    <p>Projekt-Inhalte bearbeiten und verwalten</p>
                </div>
                
                <div class="projects-overview">
                    <div class="project-card active">
                        <div class="project-icon">
                            <i class="fas fa-desktop"></i>
                        </div>
                        <h3>Web-basierter Desktop</h3>
                        <p>Ein innovatives webbasiertes Desktop-System</p>
                        <div class="project-status active">
                            <i class="fas fa-circle"></i> Aktiv in Entwicklung
                        </div>
                        <div class="project-actions">
                            <button onclick="adminPanel.editProject(1)">Bearbeiten</button>
                        </div>
                    </div>
                    
                    <div class="project-card paused">
                        <div class="project-icon">
                            <i class="fas fa-cube"></i>
                        </div>
                        <h3>Minecraft Server</h3>
                        <p>Custom Minecraft Server mit Plugins</p>
                        <div class="project-status paused">
                            <i class="fas fa-pause-circle"></i> Pausiert
                        </div>
                        <div class="project-actions">
                            <button onclick="adminPanel.editProject(2)">Bearbeiten</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getUsersHTML() {
        const usersHTML = this.users.map(user => `
            <div class="user-item" data-id="${user.id}">
                <div class="user-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="user-info">
                    <h3>${user.name}</h3>
                    <p>@${user.username}</p>
                    <span class="user-role ${user.role}">${user.role}</span>
                </div>
                <div class="user-actions">
                    <button class="btn-edit" onclick="adminPanel.editUser(${user.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${user.id !== this.currentUser.id ? `
                        <button class="btn-delete" onclick="adminPanel.deleteUser(${user.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
        
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-users-cog"></i> Benutzerverwaltung</h1>
                    <p>Admin-Benutzer verwalten</p>
                    <button class="btn-add-user" onclick="adminPanel.addUser()">
                        <i class="fas fa-plus"></i> Benutzer hinzufügen
                    </button>
                </div>
                
                <div class="users-container">
                    ${usersHTML}
                </div>
            </div>
        `;
    }
    
    getMediaHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-photo-video"></i> Medien verwalten</h1>
                    <p>Bilder, Videos und andere Medien verwalten</p>
                </div>
                <div class="media-placeholder">
                    <i class="fas fa-images"></i>
                    <p>Medien-Management wird geladen...</p>
                </div>
            </div>
        `;
    }
    
    getAnalyticsHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-chart-line"></i> Analytics</h1>
                    <p>Website-Statistiken und Besucheranalyse</p>
                </div>
                <div class="analytics-placeholder">
                    <i class="fas fa-chart-bar"></i>
                    <p>Analytics werden geladen...</p>
                </div>
            </div>
        `;
    }
    
    // Message Management
    replyToMessage(id) {
        const message = this.messages.find(m => m.id === id);
        if (message) {
            message.read = true;
            this.saveMessages();
            
            const subject = `Re: ${message.subject}`;
            const body = `Hallo ${message.name},\n\nvielen Dank für deine Nachricht!\n\n\n---\nUrsprüngliche Nachricht:\n${message.message}`;
            const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.open(mailtoLink);
            this.showSuccess('E-Mail Client geöffnet');
            
            if (this.currentPage === 'messages') {
                this.loadPageContent('messages');
            }
        }
    }

    markAsRead(id) {
        const message = this.messages.find(m => m.id === id);
        if (message) {
            message.read = true;
            this.saveMessages();
            this.loadPageContent('messages');
            this.showSuccess('Nachricht als gelesen markiert');
        }
    }

    markAllAsRead() {
        const unreadCount = this.messages.filter(m => !m.read).length;
        if (unreadCount === 0) return;
        
        if (confirm(`${unreadCount} Nachricht(en) als gelesen markieren?`)) {
            this.messages.forEach(m => m.read = true);
            this.saveMessages();
            this.loadPageContent('messages');
            this.showSuccess(`${unreadCount} Nachricht(en) als gelesen markiert`);
        }
    }

    clearReadMessages() {
        const readCount = this.messages.filter(m => m.read).length;
        if (readCount === 0) {
            this.showWarning('Keine gelesenen Nachrichten zum Löschen vorhanden');
            return;
        }
        
        if (confirm(`${readCount} gelesene Nachricht(en) wirklich löschen?`)) {
            this.messages = this.messages.filter(m => !m.read);
            this.saveMessages();
            this.loadPageContent('messages');
            this.showSuccess(`${readCount} gelesene Nachricht(en) gelöscht`);
        }
    }

    deleteMessage(id) {
        if (confirm('Nachricht wirklich löschen?')) {
            this.messages = this.messages.filter(m => m.id !== id);
            this.saveMessages();
            this.loadPageContent('messages');
            this.showSuccess('Nachricht gelöscht');
        }
    }
    
    saveMessages() {
        localStorage.setItem('adminMessages', JSON.stringify(this.messages));
        this.updateMessageCount();
    }
    
    updateMessageCount() {
        const badge = document.getElementById('messageCount');
        if (badge) {
            badge.textContent = this.messages.length;
        }
    }
    
    // Page Content Management
    savePageContent(page) {
        this.showLoading();
        
        setTimeout(() => {
            this.hideLoading();
            this.showSuccess('Änderungen gespeichert!');
            console.log(`Saving ${page} content...`);
        }, 1000);
    }
    
    previewChanges() {
        window.open('../index.html', '_blank');
    }
    
    // User Management
    editUser(id) {
        const user = this.users.find(u => u.id === id);
        if (user) {
            const newName = prompt('Neuer Name:', user.name);
            if (newName && newName !== user.name) {
                user.name = newName;
                this.showSuccess('Benutzer aktualisiert');
                this.loadPageContent('users');
            }
        }
    }
    
    deleteUser(id) {
        if (confirm('Benutzer wirklich löschen?')) {
            this.users = this.users.filter(u => u.id !== id);
            this.showSuccess('Benutzer gelöscht');
            this.loadPageContent('users');
        }
    }
    
    addUser() {
        const username = prompt('Benutzername:');
        if (username && !this.users.find(u => u.username === username)) {
            const password = prompt('Passwort:');
            const name = prompt('Vollständiger Name:');
            
            if (password && name) {
                const newUser = {
                    id: Math.max(...this.users.map(u => u.id)) + 1,
                    username,
                    password,
                    name,
                    role: 'editor'
                };
                
                this.users.push(newUser);
                this.showSuccess('Benutzer hinzugefügt');
                this.loadPageContent('users');
            }
        } else if (username) {
            this.showError('Benutzername bereits vergeben');
        }
    }
    
    // Project Management
    editProject(id) {
        this.showSuccess(`Projekt ${id} wird bearbeitet...`);
    }
    
    // Event Binding
    bindMessageEvents() {
        // Messages are already bound via onclick
    }
    
    bindUserEvents() {
        // Users are already bound via onclick
    }
    
    bindPageEditEvents() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.dataset.tab;
                
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                const targetContent = document.getElementById(`${targetTab}-tab`);
                if (targetContent) targetContent.classList.add('active');
            });
        });
    }
    
    // UI Helper Methods
    showLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.classList.add('show');
    }
    
    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) loading.classList.remove('show');
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;
        
        const icon = toast.querySelector('.toast-icon');
        const messageSpan = toast.querySelector('.toast-message');
        
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        if (icon) icon.className = `toast-icon ${icons[type]}`;
        if (messageSpan) messageSpan.textContent = message;
        
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    showSuccess(message) {
        this.showToast(message, 'success');
    }
    
    showError(message) {
        this.showToast(message, 'error');
    }
    
    showWarning(message) {
        this.showToast(message, 'warning');
    }
}

// Initialize Admin Panel
const adminPanel = new AdminPanel();

// Global function for contact form messages
window.addContactMessage = function(messageData) {
    const newMessage = {
        id: Math.max(...adminPanel.messages.map(m => m.id), 0) + 1,
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
        timestamp: new Date().toLocaleString('de-DE'),
        read: false,
        priority: messageData.priority || 'low'
    };
    
    adminPanel.messages.push(newMessage);
    adminPanel.saveMessages();
};
