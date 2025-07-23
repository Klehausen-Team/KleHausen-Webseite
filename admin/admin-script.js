// Admin Panel JavaScript
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
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        
        // Password Toggle
        const togglePassword = document.getElementById('togglePassword');
        togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
        
        // User Dropdown
        const userDropdown = document.getElementById('userDropdown');
        const dropdownMenu = document.getElementById('dropdownMenu');
        
        userDropdown?.addEventListener('click', () => {
            dropdownMenu.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userDropdown?.contains(e.target)) {
                dropdownMenu?.classList.remove('show');
            }
        });
        
        // Logout
        const logoutBtn = document.getElementById('logoutBtn');
        logoutBtn?.addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });
        
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
        
        errorMessage.textContent = message;
        errorDiv.classList.add('show');
        
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 3000);
    }
    
    showDashboard() {
        document.getElementById('loginContainer').style.display = 'none';
        document.getElementById('adminDashboard').style.display = 'grid';
        
        // Update user name
        document.getElementById('userName').textContent = this.currentUser.name;
        
        // Load default page
        this.navigateToPage('overview');
        this.updateMessageCount();
    }
    
    logout() {
        localStorage.removeItem('adminUser');
        this.currentUser = null;
        
        document.getElementById('adminDashboard').style.display = 'none';
        document.getElementById('loginContainer').style.display = 'flex';
        
        // Clear form
        document.getElementById('loginForm').reset();
        
        this.showSuccess('Erfolgreich abgemeldet!');
    }
    
    navigateToPage(page) {
        // Update active menu item
        document.querySelectorAll('.menu-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelector(`[data-page="${page}"]`)?.classList.add('active');
        
        this.currentPage = page;
        this.loadPageContent(page);
    }
    
    loadPageContent(page) {
        const contentDiv = document.getElementById('adminContent');
        
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
        const messagesHTML = this.messages.map(msg => `
            <div class="message-item" data-id="${msg.id}">
                <div class="message-header">
                    <div class="message-sender">
                        <strong>${msg.name}</strong>
                        <span class="message-email">${msg.email}</span>
                    </div>
                    <div class="message-meta">
                        <span class="message-subject">${msg.subject}</span>
                        <span class="message-time">${msg.timestamp}</span>
                    </div>
                </div>
                <div class="message-content">
                    <p>${msg.message}</p>
                </div>
                <div class="message-actions">
                    <button class="btn-reply" onclick="adminPanel.replyToMessage(${msg.id})">
                        <i class="fas fa-reply"></i> Antworten
                    </button>
                    <button class="btn-delete" onclick="adminPanel.deleteMessage(${msg.id})">
                        <i class="fas fa-trash"></i> Löschen
                    </button>
                </div>
            </div>
        `).join('');
        
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-envelope"></i> Nachrichten</h1>
                    <p>Kontaktformular-Nachrichten verwalten</p>
                </div>
                
                <div class="messages-container">
                    ${this.messages.length > 0 ? messagesHTML : '<div class="no-messages"><i class="fas fa-inbox"></i><p>Keine Nachrichten vorhanden</p></div>'}
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
                    
                    <div class="tab-content" id="team-tab">
                        <div class="editor-section">
                            <h3>Team Bereich</h3>
                            <div class="form-group">
                                <label>Team Größe</label>
                                <input type="text" id="team-size" value="4-8" />
                            </div>
                            <div class="form-group">
                                <label>Team Beschreibung</label>
                                <textarea id="team-description" rows="4">Unser Team besteht aus leidenschaftlichen Content Creators, Entwicklern und Gamern, die zusammen innovative Projekte realisieren.</textarea>
                            </div>
                        </div>
                        
                        <div class="editor-actions">
                            <button class="btn-save" onclick="adminPanel.savePageContent('team')">
                                <i class="fas fa-save"></i> Änderungen speichern
                            </button>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="contact-tab">
                        <div class="editor-section">
                            <h3>Kontakt Bereich</h3>
                            <div class="form-group">
                                <label>Social Media Links</label>
                                <input type="url" id="github-link" placeholder="GitHub URL" value="https://github.com/your-github" />
                                <input type="url" id="youtube-link" placeholder="YouTube URL" value="https://youtube.com/your-channel" />
                                <input type="url" id="twitch-link" placeholder="Twitch URL" value="https://twitch.tv/your-channel" />
                            </div>
                        </div>
                        
                        <div class="editor-actions">
                            <button class="btn-save" onclick="adminPanel.savePageContent('contact')">
                                <i class="fas fa-save"></i> Änderungen speichern
                            </button>
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
    
    getProjectsHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-project-diagram"></i> Projekte verwalten</h1>
                    <p>Projekt-Inhalte bearbeiten und verwalten</p>
                </div>
                
                <div class="projects-grid">
                    <div class="project-editor-card">
                        <h3>Web-basierter Desktop</h3>
                        <div class="form-group">
                            <label>Status</label>
                            <select>
                                <option selected>Aktiv in Entwicklung</option>
                                <option>Pausiert</option>
                                <option>Abgeschlossen</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Beschreibung</label>
                            <textarea rows="3">Ein innovatives webbasiertes Desktop-System, das eine vollständige Desktop-Erfahrung im Browser bietet.</textarea>
                        </div>
                        <button class="btn-save">Speichern</button>
                    </div>
                    
                    <div class="project-editor-card">
                        <h3>Minecraft Server</h3>
                        <div class="form-group">
                            <label>Status</label>
                            <select>
                                <option>Aktiv in Entwicklung</option>
                                <option selected>Pausiert</option>
                                <option>Abgeschlossen</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Beschreibung</label>
                            <textarea rows="3">Unser eigener Minecraft Server mit custom Features und Plugins für die Community.</textarea>
                        </div>
                        <button class="btn-save">Speichern</button>
                    </div>
                    
                    <div class="project-editor-card">
                        <h3>Content Creator Gruppe</h3>
                        <div class="form-group">
                            <label>Status</label>
                            <select>
                                <option selected>Aktiv</option>
                                <option>Pausiert</option>
                                <option>Abgeschlossen</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Beschreibung</label>
                            <textarea rows="3">Unsere kleine aber feine Content Creator Gruppe produziert gemeinsam verschiedensten Content.</textarea>
                        </div>
                        <button class="btn-save">Speichern</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    getMediaHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-images"></i> Medien verwalten</h1>
                    <p>Bilder und Dateien hochladen und verwalten</p>
                </div>
                
                <div class="media-upload">
                    <div class="upload-area" id="uploadArea">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Dateien hierher ziehen oder klicken zum Hochladen</h3>
                        <p>Unterstützte Formate: JPG, PNG, SVG, PDF</p>
                        <input type="file" id="fileInput" multiple accept="image/*,.pdf" style="display: none;">
                    </div>
                </div>
                
                <div class="media-grid">
                    <div class="media-item">
                        <div class="media-preview">
                            <i class="fas fa-image"></i>
                        </div>
                        <div class="media-info">
                            <h4>logo.png</h4>
                            <p>125 KB</p>
                        </div>
                        <div class="media-actions">
                            <button class="btn-copy">URL kopieren</button>
                            <button class="btn-delete">Löschen</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getAnalyticsHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-chart-bar"></i> Statistiken</h1>
                    <p>Website-Analytik und Metriken</p>
                </div>
                
                <div class="analytics-dashboard">
                    <div class="analytics-card">
                        <h3>Besucher heute</h3>
                        <div class="metric">
                            <span class="number">42</span>
                            <span class="trend up">+12%</span>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>PWA Installationen</h3>
                        <div class="metric">
                            <span class="number">8</span>
                            <span class="trend up">+3</span>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>Discord Klicks</h3>
                        <div class="metric">
                            <span class="number">23</span>
                            <span class="trend up">+5</span>
                        </div>
                    </div>
                    
                    <div class="analytics-card">
                        <h3>Kontakt-Nachrichten</h3>
                        <div class="metric">
                            <span class="number">${this.messages.length}</span>
                            <span class="trend">Neu</span>
                        </div>
                    </div>
                </div>
                
                <div class="analytics-chart">
                    <h3>Besucher-Verlauf (7 Tage)</h3>
                    <div class="chart-placeholder">
                        <i class="fas fa-chart-line"></i>
                        <p>Chart wird hier angezeigt</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindMessageEvents() {
        // Message events are bound inline in the HTML
    }
    
    bindPageEditEvents() {
        // Tab switching
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const tab = btn.dataset.tab;
                
                // Update active tab button
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update active tab content
                tabContents.forEach(content => {
                    content.classList.remove('active');
                });
                document.getElementById(`${tab}-tab`).classList.add('active');
            });
        });
    }
    
    bindUserEvents() {
        // User events are bound inline in the HTML
    }
    
    // Message Management
    loadMessages() {
        // Load messages from localStorage or API
        const savedMessages = localStorage.getItem('adminMessages');
        if (savedMessages) {
            this.messages = JSON.parse(savedMessages);
        } else {
            // Demo messages
            this.messages = [
                {
                    id: 1,
                    name: 'Max Mustermann',
                    email: 'max@example.com',
                    subject: 'collaboration',
                    message: 'Hallo! Ich würde gerne bei euren Projekten mitmachen. Ich bin Entwickler und interessiere mich für eure Web-Desktop Lösung.',
                    timestamp: '2025-01-23 14:30'
                },
                {
                    id: 2,
                    name: 'Anna Schmidt',
                    email: 'anna@example.com',
                    subject: 'feedback',
                    message: 'Eure Website sieht super aus! Besonders der Splash Screen gefällt mir. Weiter so!',
                    timestamp: '2025-01-23 12:15'
                }
            ];
            this.saveMessages();
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
    
    replyToMessage(id) {
        const message = this.messages.find(m => m.id === id);
        if (message) {
            // Create mailto link
            const subject = `Re: ${message.subject}`;
            const body = `\n\n---\nUrsprüngliche Nachricht von ${message.name}:\n${message.message}`;
            const mailtoLink = `mailto:${message.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            window.open(mailtoLink);
            this.showSuccess('E-Mail Client geöffnet');
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
    
    // Page Content Management
    savePageContent(page) {
        this.showLoading();
        
        // Simulate API call
        setTimeout(() => {
            this.hideLoading();
            this.showSuccess('Änderungen gespeichert!');
            
            // Here you would normally send the data to your backend
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
    
    // UI Helper Methods
    showLoading() {
        document.getElementById('loadingOverlay').classList.add('show');
    }
    
    hideLoading() {
        document.getElementById('loadingOverlay').classList.remove('show');
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        const icon = toast.querySelector('.toast-icon');
        const messageSpan = toast.querySelector('.toast-message');
        
        // Set icon based on type
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        icon.className = `toast-icon ${icons[type]}`;
        messageSpan.textContent = message;
        
        // Reset classes and add new ones
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

// Add message from contact form (to be called from main website)
window.addContactMessage = function(messageData) {
    const newMessage = {
        id: Math.max(...adminPanel.messages.map(m => m.id), 0) + 1,
        name: messageData.name,
        email: messageData.email,
        subject: messageData.subject,
        message: messageData.message,
        timestamp: new Date().toLocaleString('de-DE')
    };
    
    adminPanel.messages.push(newMessage);
    adminPanel.saveMessages();
};
