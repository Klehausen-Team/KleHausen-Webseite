/**
 * KleHausen Website - Umfassendes Logging System
 * Ermöglicht detailliertes Debugging und Monitoring aller Subsysteme
 */

class KleHausenLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000;
        this.logLevels = {
            ERROR: { level: 0, color: '#ff4444', icon: '❌' },
            WARN: { level: 1, color: '#ffaa00', icon: '⚠️' },
            INFO: { level: 2, color: '#4488ff', icon: 'ℹ️' },
            DEBUG: { level: 3, color: '#888888', icon: '🔍' },
            SUCCESS: { level: 2, color: '#44ff44', icon: '✅' }
        };
        this.currentLogLevel = this.logLevels.DEBUG.level;
        this.subsystems = new Set();
        
        this.init();
    }
    
    init() {
        this.createLogUI();
        this.interceptConsole();
        this.setupErrorHandling();
        this.loadPersistedLogs();
        
        this.info('SYSTEM', 'KleHausen Logger initialisiert');
    }
    
    createLogUI() {
        // Erstelle Log-Konsole UI
        const logContainer = document.createElement('div');
        logContainer.id = 'klehausen-logger';
        logContainer.innerHTML = `
            <div class="logger-header">
                <span class="logger-title">🔍 KleHausen Debug Console</span>
                <div class="logger-controls">
                    <select id="log-level-filter">
                        <option value="0">ERROR</option>
                        <option value="1">WARN</option>
                        <option value="2" selected>INFO</option>
                        <option value="3">DEBUG</option>
                    </select>
                    <select id="subsystem-filter">
                        <option value="">Alle Subsysteme</option>
                    </select>
                    <button id="clear-logs">🗑️ Clear</button>
                    <button id="export-logs">📥 Export</button>
                    <button id="toggle-logger">➖</button>
                </div>
            </div>
            <div class="logger-content">
                <div id="log-output"></div>
            </div>
        `;
        
        logContainer.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 600px;
            max-height: 400px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            display: none;
        `;
        
        document.body.appendChild(logContainer);
        this.bindLoggerEvents();
        
        // Logger Toggle Keyboard Shortcut (Ctrl+Shift+L)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                this.toggleLogger();
            }
        });
    }
    
    bindLoggerEvents() {
        const levelFilter = document.getElementById('log-level-filter');
        const subsystemFilter = document.getElementById('subsystem-filter');
        const clearBtn = document.getElementById('clear-logs');
        const exportBtn = document.getElementById('export-logs');
        const toggleBtn = document.getElementById('toggle-logger');
        
        levelFilter.addEventListener('change', () => this.filterLogs());
        subsystemFilter.addEventListener('change', () => this.filterLogs());
        clearBtn.addEventListener('click', () => this.clearLogs());
        exportBtn.addEventListener('click', () => this.exportLogs());
        toggleBtn.addEventListener('click', () => this.toggleLoggerContent());
    }
    
    interceptConsole() {
        const originalConsole = {
            log: console.log,
            error: console.error,
            warn: console.warn,
            info: console.info,
            debug: console.debug
        };
        
        console.log = (...args) => {
            originalConsole.log(...args);
            this.info('CONSOLE', args.join(' '));
        };
        
        console.error = (...args) => {
            originalConsole.error(...args);
            this.error('CONSOLE', args.join(' '));
        };
        
        console.warn = (...args) => {
            originalConsole.warn(...args);
            this.warn('CONSOLE', args.join(' '));
        };
        
        console.info = (...args) => {
            originalConsole.info(...args);
            this.info('CONSOLE', args.join(' '));
        };
        
        console.debug = (...args) => {
            originalConsole.debug(...args);
            this.debug('CONSOLE', args.join(' '));
        };
    }
    
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            this.error('GLOBAL', `Uncaught Error: ${event.error?.message || event.message}`, {
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                stack: event.error?.stack
            });
        });
        
        window.addEventListener('unhandledrejection', (event) => {
            this.error('PROMISE', `Unhandled Promise Rejection: ${event.reason}`, {
                promise: event.promise,
                reason: event.reason
            });
        });
    }
    
    log(level, subsystem, message, data = null) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level: level,
            subsystem: subsystem,
            message: message,
            data: data,
            id: Date.now() + Math.random()
        };
        
        this.logs.push(logEntry);
        this.subsystems.add(subsystem);
        
        // Begrenze Log-Anzahl
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(-this.maxLogs);
        }
        
        this.updateSubsystemFilter();
        this.displayLog(logEntry);
        this.persistLogs();
        
        return logEntry;
    }
    
    error(subsystem, message, data = null) {
        return this.log('ERROR', subsystem, message, data);
    }
    
    warn(subsystem, message, data = null) {
        return this.log('WARN', subsystem, message, data);
    }
    
    info(subsystem, message, data = null) {
        return this.log('INFO', subsystem, message, data);
    }
    
    debug(subsystem, message, data = null) {
        return this.log('DEBUG', subsystem, message, data);
    }
    
    success(subsystem, message, data = null) {
        return this.log('SUCCESS', subsystem, message, data);
    }
    
    displayLog(logEntry) {
        const logOutput = document.getElementById('log-output');
        if (!logOutput) return;
        
        const levelInfo = this.logLevels[logEntry.level];
        if (levelInfo.level > this.currentLogLevel) return;
        
        const logElement = document.createElement('div');
        logElement.className = 'log-entry';
        logElement.style.cssText = `
            padding: 4px 8px;
            border-bottom: 1px solid #333;
            color: ${levelInfo.color};
            font-size: 11px;
            line-height: 1.4;
        `;
        
        const time = new Date(logEntry.timestamp).toLocaleTimeString();
        logElement.innerHTML = `
            <span style="color: #666">[${time}]</span>
            <span style="color: #888">[${logEntry.subsystem}]</span>
            ${levelInfo.icon} ${logEntry.message}
            ${logEntry.data ? `<div style="margin-left: 20px; color: #aaa; font-size: 10px;">${JSON.stringify(logEntry.data, null, 2)}</div>` : ''}
        `;
        
        logOutput.appendChild(logElement);
        logOutput.scrollTop = logOutput.scrollHeight;
    }
    
    updateSubsystemFilter() {
        const filter = document.getElementById('subsystem-filter');
        if (!filter) return;
        
        const currentValue = filter.value;
        filter.innerHTML = '<option value="">Alle Subsysteme</option>';
        
        Array.from(this.subsystems).sort().forEach(subsystem => {
            const option = document.createElement('option');
            option.value = subsystem;
            option.textContent = subsystem;
            if (subsystem === currentValue) option.selected = true;
            filter.appendChild(option);
        });
    }
    
    filterLogs() {
        const levelFilter = document.getElementById('log-level-filter');
        const subsystemFilter = document.getElementById('subsystem-filter');
        const logOutput = document.getElementById('log-output');
        
        if (!levelFilter || !subsystemFilter || !logOutput) return;
        
        this.currentLogLevel = parseInt(levelFilter.value);
        const selectedSubsystem = subsystemFilter.value;
        
        logOutput.innerHTML = '';
        
        this.logs.forEach(log => {
            const levelInfo = this.logLevels[log.level];
            if (levelInfo.level <= this.currentLogLevel) {
                if (!selectedSubsystem || log.subsystem === selectedSubsystem) {
                    this.displayLog(log);
                }
            }
        });
    }
    
    clearLogs() {
        this.logs = [];
        const logOutput = document.getElementById('log-output');
        if (logOutput) logOutput.innerHTML = '';
        this.info('LOGGER', 'Logs gelöscht');
    }
    
    exportLogs() {
        const blob = new Blob([JSON.stringify(this.logs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `klehausen-logs-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        this.info('LOGGER', 'Logs exportiert');
    }
    
    toggleLogger() {
        const logger = document.getElementById('klehausen-logger');
        if (logger) {
            logger.style.display = logger.style.display === 'none' ? 'block' : 'none';
        }
    }
    
    toggleLoggerContent() {
        const content = document.querySelector('.logger-content');
        const toggle = document.getElementById('toggle-logger');
        
        if (content && toggle) {
            const isVisible = content.style.display !== 'none';
            content.style.display = isVisible ? 'none' : 'block';
            toggle.textContent = isVisible ? '➕' : '➖';
        }
    }
    
    persistLogs() {
        try {
            localStorage.setItem('klehausen-logs', JSON.stringify(this.logs.slice(-100)));
        } catch (e) {
            // Storage full oder nicht verfügbar
        }
    }
    
    loadPersistedLogs() {
        try {
            const stored = localStorage.getItem('klehausen-logs');
            if (stored) {
                const parsedLogs = JSON.parse(stored);
                parsedLogs.forEach(log => {
                    this.subsystems.add(log.subsystem);
                });
                this.logs = parsedLogs;
            }
        } catch (e) {
            this.warn('LOGGER', 'Fehler beim Laden gespeicherter Logs');
        }
    }
    
    // Performance Monitoring
    measurePerformance(subsystem, operation, fn) {
        const start = performance.now();
        this.debug(subsystem, `Starting operation: ${operation}`);
        
        try {
            const result = fn();
            const duration = performance.now() - start;
            this.info(subsystem, `Operation completed: ${operation} (${duration.toFixed(2)}ms)`);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            this.error(subsystem, `Operation failed: ${operation} (${duration.toFixed(2)}ms)`, error);
            throw error;
        }
    }
    
    // Async Performance Monitoring
    async measurePerformanceAsync(subsystem, operation, fn) {
        const start = performance.now();
        this.debug(subsystem, `Starting async operation: ${operation}`);
        
        try {
            const result = await fn();
            const duration = performance.now() - start;
            this.info(subsystem, `Async operation completed: ${operation} (${duration.toFixed(2)}ms)`);
            return result;
        } catch (error) {
            const duration = performance.now() - start;
            this.error(subsystem, `Async operation failed: ${operation} (${duration.toFixed(2)}ms)`, error);
            throw error;
        }
    }
}

// CSS für Logger
const loggerCSS = `
    #klehausen-logger .logger-header {
        background: #2a2a2a;
        padding: 8px 12px;
        border-bottom: 1px solid #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;
    }
    
    #klehausen-logger .logger-title {
        color: #ff7b00;
        font-weight: bold;
    }
    
    #klehausen-logger .logger-controls {
        display: flex;
        gap: 8px;
        align-items: center;
    }
    
    #klehausen-logger select,
    #klehausen-logger button {
        background: #333;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
        padding: 2px 6px;
        font-size: 11px;
        cursor: pointer;
    }
    
    #klehausen-logger button:hover {
        background: #444;
    }
    
    #klehausen-logger .logger-content {
        max-height: 300px;
        overflow-y: auto;
        background: #1a1a1a;
        border-radius: 0 0 8px 8px;
    }
    
    #klehausen-logger .log-entry:hover {
        background: #222;
    }
    
    #klehausen-logger .log-entry:nth-child(even) {
        background: #1e1e1e;
    }
`;

// CSS Style hinzufügen
const style = document.createElement('style');
style.textContent = loggerCSS;
document.head.appendChild(style);

// Globale Logger-Instanz erstellen
window.KLLogger = new KleHausenLogger();

// Kurze Aliase für einfache Verwendung
window.logError = (subsystem, message, data) => KLLogger.error(subsystem, message, data);
window.logWarn = (subsystem, message, data) => KLLogger.warn(subsystem, message, data);
window.logInfo = (subsystem, message, data) => KLLogger.info(subsystem, message, data);
window.logDebug = (subsystem, message, data) => KLLogger.debug(subsystem, message, data);
window.logSuccess = (subsystem, message, data) => KLLogger.success(subsystem, message, data);

// Logger nach DOM-Load anzeigen
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => KLLogger.toggleLogger(), 1000);
});
