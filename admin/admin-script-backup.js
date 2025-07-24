// Admin Panel JavaScript - Vollständig funktionsfähig mit Logging
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.currentPage = 'overview';
        this.messages = [];
        this.users = [
            { id: 1, username: 'admin', password: 'KleHausen2025!', role: 'admin', name: 'Administrator' },
            { id: 2, username: 'creator', password: 'Creator123!', role: 'editor', name: 'Content Creator' }
        ];
        
        logInfo('ADMIN_PANEL', 'AdminPanel Constructor aufgerufen');
        this.init();
    }
    
    init() {
        logDebug('ADMIN_PANEL', 'AdminPanel wird initialisiert');
        
        try {
            this.showSplash();
            this.bindEvents();
            this.checkExistingSession();
            this.loadMessages();
            
            logSuccess('ADMIN_PANEL', 'AdminPanel erfolgreich initialisiert');
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler bei AdminPanel Initialisierung', error);
        }
    }
    
    showSplash() {
        logDebug('ADMIN_PANEL', 'Splash Screen wird angezeigt');
        
        const splash = document.getElementById('adminSplash');
        if (!splash) {
            logError('ADMIN_PANEL', 'Splash Screen Element nicht gefunden');
            return;
        }
        
        setTimeout(() => {
            splash.classList.add('fade-out');
            logDebug('ADMIN_PANEL', 'Splash Screen fade-out gestartet');
            
            setTimeout(() => {
                splash.style.display = 'none';
                logInfo('ADMIN_PANEL', 'Splash Screen ausgeblendet');
            }, 500);
        }, 2000);
    }
    
    bindEvents() {
        logDebug('ADMIN_PANEL', 'Event Listener werden gebunden');
        
        try {
            // Login Form
            const loginForm = document.getElementById('loginForm');
            if (loginForm) {
                loginForm.addEventListener('submit', (e) => this.handleLogin(e));
                logDebug('ADMIN_PANEL', 'Login Form Event Listener gebunden');
            } else {
                logWarn('ADMIN_PANEL', 'Login Form nicht gefunden');
            }
            
            // Password Toggle
            const togglePassword = document.getElementById('togglePassword');
            if (togglePassword) {
                togglePassword.addEventListener('click', () => this.togglePasswordVisibility());
                logDebug('ADMIN_PANEL', 'Password Toggle Event Listener gebunden');
            } else {
                logWarn('ADMIN_PANEL', 'Password Toggle nicht gefunden');
            }
            
            // User Dropdown
            const userDropdown = document.getElementById('userDropdown');
            const dropdownMenu = document.getElementById('dropdownMenu');
            
            if (userDropdown && dropdownMenu) {
                userDropdown.addEventListener('click', () => {
                    dropdownMenu.classList.toggle('show');
                    logDebug('ADMIN_PANEL', 'User Dropdown Toggle ausgeführt');
                });
                
                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!userDropdown.contains(e.target)) {
                        dropdownMenu.classList.remove('show');
                    }
                });
                logDebug('ADMIN_PANEL', 'User Dropdown Event Listener gebunden');
            } else {
                logWarn('ADMIN_PANEL', 'User Dropdown Elemente nicht gefunden');
            }
            
            // Logout
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
                logDebug('ADMIN_PANEL', 'Logout Button Event Listener gebunden');
            } else {
                logWarn('ADMIN_PANEL', 'Logout Button nicht gefunden');
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
            logDebug('ADMIN_PANEL', `${menuLinks.length} Menu Links Event Listener gebunden`);
            
            logSuccess('ADMIN_PANEL', 'Alle Event Listener erfolgreich gebunden');
            
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Binden der Event Listener', error);
        }
    }
    
    checkExistingSession() {
        logDebug('ADMIN_PANEL', 'Prüfe bestehende Session');
        
        try {
            const savedUser = localStorage.getItem('adminUser');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                logInfo('ADMIN_PANEL', `Session gefunden für Benutzer: ${this.currentUser.username}`);
                this.showDashboard();
            } else {
                logDebug('ADMIN_PANEL', 'Keine bestehende Session gefunden');
            }
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Prüfen der Session', error);
            localStorage.removeItem('adminUser');
        }
    }
    
    loadMessages() {
        logDebug('ADMIN_PANEL', 'Lade Nachrichten aus LocalStorage');
        
        try {
            const savedMessages = localStorage.getItem('adminMessages');
            if (savedMessages) {
                this.messages = JSON.parse(savedMessages);
                logInfo('ADMIN_PANEL', `${this.messages.length} Nachrichten aus LocalStorage geladen`);
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
            logInfo('ADMIN_PANEL', 'Demo Nachrichten erstellt');
        }
        
        // Listen for new messages from main website
        window.addEventListener('storage', (e) => {
            if (e.key === 'newMessage') {
                const data = JSON.parse(e.newValue || '{}');
                if (data.message && Date.now() - data.timestamp < 5000) {
                    this.messages.push(data.message);
                    this.saveMessages();
                    this.showSuccess('Neue Nachricht erhalten!');
                    logInfo('ADMIN_PANEL', 'Neue Nachricht über Storage Event erhalten');
                    
                    if (this.currentPage === 'messages') {
                        this.loadPageContent('messages');
                    }
                    this.updateMessageCount();
                }
            }
        });
        
        logSuccess('ADMIN_PANEL', 'Nachrichten erfolgreich geladen');
        
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Laden der Nachrichten', error);
            this.messages = [];
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
        logDebug('ADMIN_PANEL', `Navigation zu Seite: ${page}`);
        
        try {
            // Update active menu item
            document.querySelectorAll('.menu-link').forEach(link => {
                link.classList.remove('active');
            });
            
            const activeLink = document.querySelector(`[data-page="${page}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
                logDebug('ADMIN_PANEL', `Menu-Link aktiviert für: ${page}`);
            } else {
                logWarn('ADMIN_PANEL', `Kein Menu-Link gefunden für Seite: ${page}`);
            }
            
            this.currentPage = page;
            this.loadPageContent(page);
            
            logSuccess('ADMIN_PANEL', `Navigation erfolgreich zu: ${page}`);
        } catch (error) {
            logError('ADMIN_PANEL', `Fehler bei Navigation zu ${page}`, error);
        }
    }
    
    loadPageContent(page) {
        logDebug('ADMIN_PANEL', `Lade Content für Seite: ${page}`);
        
        const contentDiv = document.getElementById('adminContent');
        if (!contentDiv) {
            logError('ADMIN_PANEL', 'adminContent Element nicht gefunden');
            return;
        }
        
        try {
            switch(page) {
                case 'overview':
                    contentDiv.innerHTML = this.getOverviewHTML();
                    logInfo('ADMIN_PANEL', 'Overview-Content geladen');
                    break;
                case 'messages':
                    contentDiv.innerHTML = this.getMessagesHTML();
                    this.bindMessageEvents();
                    logInfo('ADMIN_PANEL', 'Messages-Content geladen');
                    break;
                case 'pages':
                    contentDiv.innerHTML = this.getPagesHTML();
                    this.bindPageEditEvents();
                    this.loadSavedPageContent('home'); // Lade gespeicherte Inhalte
                    logInfo('ADMIN_PANEL', 'Pages-Content geladen');
                    break;
                case 'projects':
                    contentDiv.innerHTML = this.getProjectsHTML();
                    logInfo('ADMIN_PANEL', 'Projects-Content geladen');
                    break;
                case 'users':
                    contentDiv.innerHTML = this.getUsersHTML();
                    this.bindUserEvents();
                    logInfo('ADMIN_PANEL', 'Users-Content geladen');
                    break;
                case 'media':
                    contentDiv.innerHTML = this.getMediaHTML();
                    logInfo('ADMIN_PANEL', 'Media-Content geladen');
                    break;
                case 'analytics':
                    contentDiv.innerHTML = this.getAnalyticsHTML();
                    logInfo('ADMIN_PANEL', 'Analytics-Content geladen');
                    break;
                case 'notifications':
                    contentDiv.innerHTML = this.getNotificationsHTML();
                    logInfo('ADMIN_PANEL', 'Notifications-Content geladen');
                    break;
                case 'backup':
                    contentDiv.innerHTML = this.getBackupHTML();
                    logInfo('ADMIN_PANEL', 'Backup-Content geladen');
                    break;
                default:
                    logWarn('ADMIN_PANEL', `Unbekannte Seite angefordert: ${page}`);
                    contentDiv.innerHTML = '<div class="error-message">Seite nicht gefunden</div>';
            }
            
            logSuccess('ADMIN_PANEL', `Content erfolgreich geladen für: ${page}`);
        } catch (error) {
            logError('ADMIN_PANEL', `Fehler beim Laden des Contents für ${page}`, error);
            contentDiv.innerHTML = '<div class="error-message">Fehler beim Laden der Seite</div>';
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
        let projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
        if (projects.length === 0) {
            projects = [
                {id: 1, name: 'Web-basierter Desktop', status: 'Aktiv in Entwicklung', desc: 'Ein innovatives webbasiertes Desktop-System', icon: 'fas fa-desktop'},
                {id: 2, name: 'Minecraft Server', status: 'Pausiert', desc: 'Custom Minecraft Server mit Plugins', icon: 'fas fa-cube'}
            ];
            localStorage.setItem('adminProjects', JSON.stringify(projects));
        }
        const projectHTML = projects.map((p, idx) => `
            <div class="project-card ${p.status.includes('Aktiv') ? 'active' : 'paused'}">
                <div class="project-icon"><i class="${p.icon}"></i></div>
                <h3>${p.name}</h3>
                <p>${p.desc}</p>
                <div class="project-status ${p.status.includes('Aktiv') ? 'active' : 'paused'}">
                    <i class="${p.status.includes('Aktiv') ? 'fas fa-circle' : 'fas fa-pause-circle'}"></i> ${p.status}
                </div>
                <div class="project-actions">
                    <button onclick="adminPanel.editProject(${p.id})">Bearbeiten</button>
                    <button onclick="adminPanel.deleteProject(${p.id})">Löschen</button>
                </div>
            </div>
        `).join('');
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-project-diagram"></i> Projekte verwalten</h1>
                    <p>Projekt-Inhalte bearbeiten und verwalten</p>
                    <button class="btn-add-project" onclick="adminPanel.addProject()"><i class="fas fa-plus"></i> Neues Projekt</button>
                </div>
                <div class="projects-overview">${projectHTML}</div>
            </div>
        `;
    }

    addProject() {
        logDebug('ADMIN_PANEL', 'Add Project Dialog geöffnet');
        
        try {
            const name = prompt('Projektname:');
            if (!name || name.trim() === '') {
                logDebug('ADMIN_PANEL', 'Add Project abgebrochen - kein Name eingegeben');
                return;
            }
            
            const desc = prompt('Beschreibung:');
            if (!desc || desc.trim() === '') {
                logWarn('ADMIN_PANEL', 'Projekt ohne Beschreibung erstellt');
            }
            
            const status = prompt('Status (z.B. Aktiv in Entwicklung, Pausiert):', 'Aktiv in Entwicklung');
            const icon = prompt('FontAwesome Icon-Klasse:', 'fas fa-rocket');
            
            let projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
            const id = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
            
            const newProject = {
                id, 
                name: name.trim(), 
                desc: desc ? desc.trim() : '', 
                status: status || 'Aktiv in Entwicklung', 
                icon: icon || 'fas fa-rocket',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            projects.push(newProject);
            localStorage.setItem('adminProjects', JSON.stringify(projects));
            
            logSuccess('ADMIN_PANEL', `Neues Projekt erstellt: ${name}`);
            this.showSuccess('Projekt hinzugefügt!');
            this.loadPageContent('projects');
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Hinzufügen des Projekts', error);
            this.showError('Fehler beim Hinzufügen des Projekts');
        }
    }

    editProject(id) {
        logDebug('ADMIN_PANEL', `Edit Project Dialog geöffnet für ID: ${id}`);
        
        try {
            let projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
            const idx = projects.findIndex(p => p.id === id);
            
            if (idx === -1) {
                logError('ADMIN_PANEL', `Projekt nicht gefunden: ID ${id}`);
                this.showError('Projekt nicht gefunden');
                return;
            }
            
            const p = projects[idx];
            logInfo('ADMIN_PANEL', `Bearbeite Projekt: ${p.name}`);
            
            const name = prompt('Projektname:', p.name);
            if (name === null) {
                logDebug('ADMIN_PANEL', 'Edit Project abgebrochen');
                return;
            }
            
            if (name.trim() === '') {
                logWarn('ADMIN_PANEL', 'Leerer Projektname eingegeben');
                this.showError('Projektname darf nicht leer sein');
                return;
            }
            
            const desc = prompt('Beschreibung:', p.desc);
            const status = prompt('Status:', p.status);
            const icon = prompt('FontAwesome Icon-Klasse:', p.icon);
            
            const updatedProject = {
                ...p, 
                name: name.trim(), 
                desc: desc ? desc.trim() : p.desc, 
                status: status || p.status, 
                icon: icon || p.icon,
                updatedAt: new Date().toISOString()
            };
            
            projects[idx] = updatedProject;
            localStorage.setItem('adminProjects', JSON.stringify(projects));
            
            logSuccess('ADMIN_PANEL', `Projekt aktualisiert: ${name}`);
            this.showSuccess('Projekt aktualisiert!');
            this.loadPageContent('projects');
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Bearbeiten des Projekts', error);
            this.showError('Fehler beim Bearbeiten des Projekts');
        }
    }

    deleteProject(id) {
        logDebug('ADMIN_PANEL', `Delete Project angefordert für ID: ${id}`);
        
        try {
            let projects = JSON.parse(localStorage.getItem('adminProjects') || '[]');
            const project = projects.find(p => p.id === id);
            
            if (!project) {
                logError('ADMIN_PANEL', `Projekt nicht gefunden: ID ${id}`);
                this.showError('Projekt nicht gefunden');
                return;
            }
            
            if (confirm(`Projekt "${project.name}" wirklich löschen?\n\nDiese Aktion kann nicht rückgängig gemacht werden.`)) {
                projects = projects.filter(p => p.id !== id);
                localStorage.setItem('adminProjects', JSON.stringify(projects));
                
                logSuccess('ADMIN_PANEL', `Projekt gelöscht: ${project.name}`);
                this.showSuccess('Projekt gelöscht!');
                this.loadPageContent('projects');
            } else {
                logDebug('ADMIN_PANEL', `Löschvorgang abgebrochen für Projekt: ${project.name}`);
            }
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Löschen des Projekts', error);
            this.showError('Fehler beim Löschen des Projekts');
        }
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
        const media = JSON.parse(localStorage.getItem('adminMedia') || '[]');
        const mediaHTML = media.length > 0 ? media.map((file, idx) => `
            <div class="media-item">
                <div class="media-preview">
                    ${file.type.startsWith('image') ? `<img src="${file.data}" alt="${file.name}" style="max-width:80px;max-height:80px;">` : `<i class=\"fas fa-file-video\"></i>`}
                </div>
                <div class="media-info">
                    <h4>${file.name}</h4>
                    <p>${file.size} KB</p>
                </div>
                <div class="media-actions">
                    <button class="btn-delete-media" onclick="adminPanel.deleteMedia(${idx})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `).join('') : '<div class="no-messages"><i class="fas fa-images"></i><p>Keine Medien hochgeladen</p></div>';
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-photo-video"></i> Medien verwalten</h1>
                    <p>Bilder, Videos und andere Medien verwalten</p>
                    <button class="btn-upload-media" onclick="adminPanel.uploadMedia()"><i class="fas fa-upload"></i> Datei hochladen</button>
                </div>
                <div class="media-grid">${mediaHTML}</div>
            </div>
        `;
    }

    uploadMedia() {
        logDebug('ADMIN_PANEL', 'Media Upload gestartet');
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.multiple = true;
        input.onchange = (e) => {
            const files = Array.from(e.target.files);
            logInfo('ADMIN_PANEL', `${files.length} Dateien für Upload ausgewählt`);
            
            files.forEach(file => {
                logDebug('ADMIN_PANEL', `Verarbeite Datei: ${file.name} (${Math.round(file.size/1024)}KB)`);
                
                const reader = new FileReader();
                reader.onload = (ev) => {
                    try {
                        const media = JSON.parse(localStorage.getItem('adminMedia') || '[]');
                        media.push({
                            name: file.name,
                            size: Math.round(file.size/1024),
                            type: file.type,
                            data: ev.target.result,
                            uploadedAt: new Date().toISOString()
                        });
                        localStorage.setItem('adminMedia', JSON.stringify(media));
                        logSuccess('ADMIN_PANEL', `Datei erfolgreich hochgeladen: ${file.name}`);
                        this.showSuccess('Datei hochgeladen!');
                        this.loadPageContent('media');
                    } catch (error) {
                        logError('ADMIN_PANEL', 'Fehler beim Speichern der Datei', error);
                        this.showError('Fehler beim Hochladen der Datei');
                    }
                };
                reader.onerror = () => {
                    logError('ADMIN_PANEL', `Fehler beim Lesen der Datei: ${file.name}`);
                    this.showError(`Fehler beim Lesen der Datei: ${file.name}`);
                };
                reader.readAsDataURL(file);
            });
        };
        input.click();
    }

    deleteMedia(idx) {
        logDebug('ADMIN_PANEL', `Media Delete angefordert für Index: ${idx}`);
        
        try {
            const media = JSON.parse(localStorage.getItem('adminMedia') || '[]');
            
            if (media[idx]) {
                const fileName = media[idx].name;
                
                if (confirm(`Datei "${fileName}" wirklich löschen?`)) {
                    media.splice(idx, 1);
                    localStorage.setItem('adminMedia', JSON.stringify(media));
                    logSuccess('ADMIN_PANEL', `Datei gelöscht: ${fileName}`);
                    this.showSuccess('Datei gelöscht!');
                    this.loadPageContent('media');
                } else {
                    logDebug('ADMIN_PANEL', `Löschvorgang abgebrochen für: ${fileName}`);
                }
            } else {
                logError('ADMIN_PANEL', `Ungültiger Media-Index: ${idx}`);
                this.showError('Datei nicht gefunden');
            }
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Löschen der Datei', error);
            this.showError('Fehler beim Löschen der Datei');
        }
    }
    
    getAnalyticsHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-chart-line"></i> Analytics</h1>
                    <p>Website-Statistiken und Besucheranalyse</p>
                </div>
                <div class="analytics-stats">
                    <div class="analytics-card"><i class="fas fa-users"></i><h3>1.247</h3><p>Besucher</p></div>
                    <div class="analytics-card"><i class="fas fa-eye"></i><h3>3.891</h3><p>Seitenaufrufe</p></div>
                    <div class="analytics-card"><i class="fas fa-clock"></i><h3>2:34</h3><p>Ø Besuchsdauer</p></div>
                    <div class="analytics-card"><i class="fas fa-mobile-alt"></i><h3>68%</h3><p>Mobile Nutzer</p></div>
                </div>
                <div class="analytics-charts">
                    <div class="chart-placeholder"><i class="fas fa-chart-area"></i><p>Chart wird geladen...</p></div>
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
    
    getNotificationsHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-bell"></i> Benachrichtigungen</h1>
                    <p>System- und Team-Benachrichtigungen</p>
                </div>
                <div class="notifications-list">
                    <div class="notification-item"><i class="fas fa-info-circle"></i> Systemupdate erfolgreich installiert.</div>
                    <div class="notification-item"><i class="fas fa-user-plus"></i> Neuer Benutzer hinzugefügt.</div>
                    <div class="notification-item"><i class="fas fa-envelope"></i> Neue Nachricht im Kontaktformular.</div>
                </div>
            </div>
        `;
    }

    getBackupHTML() {
        return `
            <div class="page-content">
                <div class="page-header">
                    <h1><i class="fas fa-cloud-download-alt"></i> Backup & Restore</h1>
                    <p>Exportiere oder importiere deine Admin-Daten</p>
                </div>
                <div class="backup-actions">
                    <button onclick="adminPanel.exportBackup()"><i class="fas fa-download"></i> Backup Exportieren</button>
                    <button onclick="adminPanel.importBackup()"><i class="fas fa-upload"></i> Backup Importieren</button>
                </div>
                <input type="file" id="backupFileInput" style="display:none;" accept="application/json">
            </div>
        `;
    }

    exportBackup() {
        logDebug('ADMIN_PANEL', 'Backup Export gestartet');
        
        try {
            const data = {
                timestamp: new Date().toISOString(),
                version: '1.0',
                messages: JSON.parse(localStorage.getItem('adminMessages') || '[]'),
                users: this.users.map(u => ({ ...u, password: '***REDACTED***' })), // Passwörter nicht exportieren
                projects: JSON.parse(localStorage.getItem('adminProjects') || '[]'),
                media: JSON.parse(localStorage.getItem('adminMedia') || '[]')
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `klehausen-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            logSuccess('ADMIN_PANEL', 'Backup erfolgreich exportiert');
            this.showSuccess('Backup exportiert!');
        } catch (error) {
            logError('ADMIN_PANEL', 'Fehler beim Backup Export', error);
            this.showError('Fehler beim Exportieren des Backups');
        }
    }

    importBackup() {
        logDebug('ADMIN_PANEL', 'Backup Import gestartet');
        
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) {
                logDebug('ADMIN_PANEL', 'Import abgebrochen - keine Datei ausgewählt');
                return;
            }
            
            logInfo('ADMIN_PANEL', `Backup-Datei ausgewählt: ${file.name} (${Math.round(file.size/1024)}KB)`);
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                try {
                    const data = JSON.parse(ev.target.result);
                    
                    // Validierung der Backup-Struktur
                    if (!data || typeof data !== 'object') {
                        throw new Error('Ungültige Backup-Struktur');
                    }
                    
                    if (confirm(`Backup importieren?\n\nDies überschreibt alle aktuellen Daten.\nBackup-Datum: ${data.timestamp || 'Unbekannt'}`)) {
                        let importedItems = 0;
                        
                        if (data.messages && Array.isArray(data.messages)) {
                            localStorage.setItem('adminMessages', JSON.stringify(data.messages));
                            importedItems++;
                            logInfo('ADMIN_PANEL', `${data.messages.length} Nachrichten importiert`);
                        }
                        
                        if (data.projects && Array.isArray(data.projects)) {
                            localStorage.setItem('adminProjects', JSON.stringify(data.projects));
                            importedItems++;
                            logInfo('ADMIN_PANEL', `${data.projects.length} Projekte importiert`);
                        }
                        
                        if (data.media && Array.isArray(data.media)) {
                            localStorage.setItem('adminMedia', JSON.stringify(data.media));
                            importedItems++;
                            logInfo('ADMIN_PANEL', `${data.media.length} Medien-Dateien importiert`);
                        }
                        
                        logSuccess('ADMIN_PANEL', `Backup erfolgreich importiert (${importedItems} Kategorien)`);
                        this.showSuccess('Backup importiert!');
                        this.loadPageContent('overview');
                    } else {
                        logDebug('ADMIN_PANEL', 'Backup Import abgebrochen');
                    }
                } catch (error) {
                    logError('ADMIN_PANEL', 'Fehler beim Backup Import', error);
                    this.showError('Ungültige Backup-Datei!');
                }
            };
            reader.onerror = () => {
                logError('ADMIN_PANEL', 'Fehler beim Lesen der Backup-Datei');
                this.showError('Fehler beim Lesen der Datei');
            };
            reader.readAsText(file);
        };
        input.click();
    }
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
    
    // Page Content Management
    savePageContent(page) {
        this.showLoading();
        
        // Sammle alle Eingabewerte
        const content = {};
        
        if (page === 'home') {
            content.heroTitle = document.getElementById('hero-title')?.value || '';
            content.heroDescription = document.getElementById('hero-description')?.value || '';
            content.discordLink = document.getElementById('discord-link')?.value || '';
        } else if (page === 'projects') {
            content.projectsTitle = document.getElementById('projects-title')?.value || '';
            content.projectsDescription = document.getElementById('projects-description')?.value || '';
        }
        
        // Speichere in localStorage
        localStorage.setItem(`pageContent_${page}`, JSON.stringify(content));
        
        setTimeout(() => {
            this.hideLoading();
            this.showSuccess('Änderungen gespeichert!');
            console.log(`Saving ${page} content:`, content);
        }, 1000);
    }
    
    loadSavedPageContent(page) {
        // Lade gespeicherte Inhalte
        const savedContent = localStorage.getItem(`pageContent_${page}`);
        if (savedContent) {
            const content = JSON.parse(savedContent);
            
            setTimeout(() => {
                if (page === 'home') {
                    const heroTitle = document.getElementById('hero-title');
                    const heroDesc = document.getElementById('hero-description');
                    const discordLink = document.getElementById('discord-link');
                    
                    if (heroTitle) heroTitle.value = content.heroTitle || '';
                    if (heroDesc) heroDesc.value = content.heroDescription || '';
                    if (discordLink) discordLink.value = content.discordLink || '';
                } else if (page === 'projects') {
                    const projectsTitle = document.getElementById('projects-title');
                    const projectsDesc = document.getElementById('projects-description');
                    
                    if (projectsTitle) projectsTitle.value = content.projectsTitle || '';
                    if (projectsDesc) projectsDesc.value = content.projectsDescription || '';
                }
            }, 100);
        }
    }
    
    previewChanges() {
        window.open('../index.html', '_blank');
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
