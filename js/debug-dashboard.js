/**
 * KleHausen Debug Dashboard - Zentrale Debugging-Oberfläche
 * Bietet eine umfassende Übersicht über alle System-Logs und Debug-Informationen
 */

class KleHausenDebugDashboard {
    constructor() {
        this.isVisible = false;
        this.selectedSubsystem = 'ALL';
        this.logBuffer = [];
        this.maxBufferSize = 500;
        
        this.init();
    }
    
    init() {
        this.createDebugUI();
        this.setupKeyboardShortcuts();
        this.interceptLogs();
        
        logInfo('DEBUG_DASHBOARD', 'Debug Dashboard initialisiert');
    }
    
    createDebugUI() {
        const debugContainer = document.createElement('div');
        debugContainer.id = 'klehausen-debug-dashboard';
        debugContainer.innerHTML = `
            <div class="debug-header">
                <div class="debug-title">
                    <span class="debug-logo">🔬</span>
                    <span>KleHausen Debug Dashboard</span>
                </div>
                <div class="debug-controls">
                    <select id="debug-subsystem-filter">
                        <option value="ALL">Alle Subsysteme</option>
                        <option value="ADMIN_PANEL">Admin Panel</option>
                        <option value="MAIN_WEBSITE">Main Website</option>
                        <option value="SPLASH_SCREEN">Splash Screen</option>
                        <option value="PWA">PWA</option>
                        <option value="SERVICE_WORKER">Service Worker</option>
                        <option value="CONTACT_FORM">Contact Form</option>
                        <option value="NAVIGATION">Navigation</option>
                        <option value="SYSTEM_MONITOR">System Monitor</option>
                        <option value="PERFORMANCE">Performance</option>
                    </select>
                    <button id="debug-clear-logs">🗑️</button>
                    <button id="debug-download-logs">📥</button>
                    <button id="debug-close">✖️</button>
                </div>
            </div>
            <div class="debug-content">
                <div class="debug-stats">
                    <div class="stat-item">
                        <span class="stat-label">Total Logs:</span>
                        <span id="total-logs">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Errors:</span>
                        <span id="error-count" class="error-text">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Warnings:</span>
                        <span id="warning-count" class="warning-text">0</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Success:</span>
                        <span id="success-count" class="success-text">0</span>
                    </div>
                </div>
                <div class="debug-log-container">
                    <div id="debug-log-output"></div>
                </div>
            </div>
        `;
        
        debugContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            z-index: 99999;
            display: none;
            flex-direction: column;
            font-family: 'Courier New', monospace;
            color: #fff;
        `;
        
        document.body.appendChild(debugContainer);
        this.bindDebugEvents();
    }
    
    bindDebugEvents() {
        document.getElementById('debug-subsystem-filter').addEventListener('change', (e) => {
            this.selectedSubsystem = e.target.value;
            this.refreshLogDisplay();
        });
        
        document.getElementById('debug-clear-logs').addEventListener('click', () => {
            this.clearLogs();
        });
        
        document.getElementById('debug-download-logs').addEventListener('click', () => {
            this.downloadLogs();
        });
        
        document.getElementById('debug-close').addEventListener('click', () => {
            this.hide();
        });
    }
    
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Strg + Shift + D für Debug Dashboard
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                this.toggle();
            }
            
            // ESC zum Schließen
            if (e.key === 'Escape' && this.isVisible) {
                this.hide();
            }
        });
    }
    
    interceptLogs() {
        // Erweitere das bestehende Logging System
        if (window.KLLogger) {
            const originalLog = window.KLLogger.log.bind(window.KLLogger);
            
            window.KLLogger.log = (level, subsystem, message, data = null) => {
                const logEntry = originalLog(level, subsystem, message, data);
                
                // Füge zum Debug Buffer hinzu
                this.logBuffer.push(logEntry);
                
                // Begrenze Buffer-Größe
                if (this.logBuffer.length > this.maxBufferSize) {
                    this.logBuffer = this.logBuffer.slice(-this.maxBufferSize);
                }
                
                // Update Display falls sichtbar
                if (this.isVisible) {
                    this.addLogToDisplay(logEntry);
                    this.updateStats();
                }
                
                return logEntry;
            };
        }
    }
    
    show() {
        const dashboard = document.getElementById('klehausen-debug-dashboard');
        if (dashboard) {
            dashboard.style.display = 'flex';
            this.isVisible = true;
            this.refreshLogDisplay();
            this.updateStats();
            
            logInfo('DEBUG_DASHBOARD', 'Debug Dashboard geöffnet');
        }
    }
    
    hide() {
        const dashboard = document.getElementById('klehausen-debug-dashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
            this.isVisible = false;
            
            logInfo('DEBUG_DASHBOARD', 'Debug Dashboard geschlossen');
        }
    }
    
    toggle() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    }
    
    refreshLogDisplay() {
        const output = document.getElementById('debug-log-output');
        if (!output) return;
        
        output.innerHTML = '';
        
        const filteredLogs = this.selectedSubsystem === 'ALL' 
            ? this.logBuffer 
            : this.logBuffer.filter(log => log.subsystem === this.selectedSubsystem);
        
        filteredLogs.forEach(log => this.addLogToDisplay(log));
        
        // Scroll zum Ende
        output.scrollTop = output.scrollHeight;
    }
    
    addLogToDisplay(logEntry) {
        const output = document.getElementById('debug-log-output');
        if (!output) return;
        
        // Filter nach ausgewähltem Subsystem
        if (this.selectedSubsystem !== 'ALL' && logEntry.subsystem !== this.selectedSubsystem) {
            return;
        }
        
        const logElement = document.createElement('div');
        logElement.className = 'debug-log-entry';
        
        const levelColors = {
            'ERROR': '#ff4444',
            'WARN': '#ffaa00',
            'INFO': '#4488ff',
            'DEBUG': '#888888',
            'SUCCESS': '#44ff44'
        };
        
        const levelIcons = {
            'ERROR': '❌',
            'WARN': '⚠️',
            'INFO': 'ℹ️',
            'DEBUG': '🔍',
            'SUCCESS': '✅'
        };
        
        const time = new Date(logEntry.timestamp).toLocaleTimeString();
        const color = levelColors[logEntry.level] || '#ccc';
        const icon = levelIcons[logEntry.level] || '📝';
        
        logElement.innerHTML = `
            <div style="padding: 4px 8px; border-bottom: 1px solid #333; font-size: 11px;">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #666; min-width: 60px;">[${time}]</span>
                    <span style="color: ${color}; min-width: 20px;">${icon}</span>
                    <span style="color: #888; min-width: 120px;">[${logEntry.subsystem}]</span>
                    <span style="color: ${color}; flex: 1;">${logEntry.message}</span>
                </div>
                ${logEntry.data ? `
                    <div style="margin-left: 200px; color: #aaa; font-size: 10px; margin-top: 4px;">
                        <pre style="margin: 0; white-space: pre-wrap;">${JSON.stringify(logEntry.data, null, 2)}</pre>
                    </div>
                ` : ''}
            </div>
        `;
        
        output.appendChild(logElement);
    }
    
    updateStats() {
        const totalElement = document.getElementById('total-logs');
        const errorElement = document.getElementById('error-count');
        const warningElement = document.getElementById('warning-count');
        const successElement = document.getElementById('success-count');
        
        if (!totalElement) return;
        
        const stats = this.logBuffer.reduce((acc, log) => {
            acc.total++;
            if (log.level === 'ERROR') acc.errors++;
            else if (log.level === 'WARN') acc.warnings++;
            else if (log.level === 'SUCCESS') acc.success++;
            return acc;
        }, { total: 0, errors: 0, warnings: 0, success: 0 });
        
        totalElement.textContent = stats.total;
        errorElement.textContent = stats.errors;
        warningElement.textContent = stats.warnings;
        successElement.textContent = stats.success;
    }
    
    clearLogs() {
        this.logBuffer = [];
        const output = document.getElementById('debug-log-output');
        if (output) output.innerHTML = '';
        this.updateStats();
        
        logInfo('DEBUG_DASHBOARD', 'Debug Logs gelöscht');
    }
    
    downloadLogs() {
        const filteredLogs = this.selectedSubsystem === 'ALL' 
            ? this.logBuffer 
            : this.logBuffer.filter(log => log.subsystem === this.selectedSubsystem);
        
        const logData = {
            timestamp: new Date().toISOString(),
            subsystem: this.selectedSubsystem,
            totalLogs: filteredLogs.length,
            logs: filteredLogs
        };
        
        const blob = new Blob([JSON.stringify(logData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `klehausen-debug-logs-${this.selectedSubsystem}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        logInfo('DEBUG_DASHBOARD', `Debug Logs heruntergeladen (${filteredLogs.length} Einträge)`);
    }
}

// CSS für Debug Dashboard
const debugDashboardCSS = `
    #klehausen-debug-dashboard .debug-header {
        background: #1a1a1a;
        border-bottom: 2px solid #ff7b00;
        padding: 12px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    #klehausen-debug-dashboard .debug-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 16px;
        font-weight: bold;
        color: #ff7b00;
    }
    
    #klehausen-debug-dashboard .debug-logo {
        font-size: 20px;
    }
    
    #klehausen-debug-dashboard .debug-controls {
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    #klehausen-debug-dashboard select,
    #klehausen-debug-dashboard button {
        background: #333;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
        padding: 6px 12px;
        font-size: 12px;
        cursor: pointer;
    }
    
    #klehausen-debug-dashboard button:hover {
        background: #444;
        border-color: #666;
    }
    
    #klehausen-debug-dashboard .debug-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }
    
    #klehausen-debug-dashboard .debug-stats {
        background: #2a2a2a;
        padding: 10px 20px;
        display: flex;
        gap: 30px;
        border-bottom: 1px solid #333;
    }
    
    #klehausen-debug-dashboard .stat-item {
        display: flex;
        gap: 8px;
        align-items: center;
        font-size: 12px;
    }
    
    #klehausen-debug-dashboard .stat-label {
        color: #aaa;
    }
    
    #klehausen-debug-dashboard .error-text {
        color: #ff4444;
        font-weight: bold;
    }
    
    #klehausen-debug-dashboard .warning-text {
        color: #ffaa00;
        font-weight: bold;
    }
    
    #klehausen-debug-dashboard .success-text {
        color: #44ff44;
        font-weight: bold;
    }
    
    #klehausen-debug-dashboard .debug-log-container {
        flex: 1;
        overflow-y: auto;
        background: #0d1117;
    }
    
    #klehausen-debug-dashboard .debug-log-entry:hover {
        background: #161b22;
    }
    
    #klehausen-debug-dashboard .debug-log-entry:nth-child(even) {
        background: #1a1a1a;
    }
`;

// Style hinzufügen
const debugStyle = document.createElement('style');
debugStyle.textContent = debugDashboardCSS;
document.head.appendChild(debugStyle);

// Debug Dashboard nach Logger initialisieren
document.addEventListener('DOMContentLoaded', () => {
    if (window.KLLogger) {
        window.KLDebugDashboard = new KleHausenDebugDashboard();
        
        // Zeige Debug-Hilfe
        setTimeout(() => {
            logInfo('DEBUG_DASHBOARD', '🔬 Debug Dashboard verfügbar! Drücke Strg+Shift+D zum Öffnen');
        }, 2000);
    }
});
