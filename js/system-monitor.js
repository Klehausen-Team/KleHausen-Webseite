/**
 * KleHausen System Monitor - Überwacht alle Subsysteme
 * Implementiert umfassendes Logging und Debugging für die gesamte Website
 */

class KleHausenSystemMonitor {
    constructor() {
        this.subsystems = {
            'MAIN_WEBSITE': { status: 'loading', errors: 0, warnings: 0 },
            'ADMIN_PANEL': { status: 'loading', errors: 0, warnings: 0 },
            'PWA': { status: 'loading', errors: 0, warnings: 0 },
            'SERVICE_WORKER': { status: 'loading', errors: 0, warnings: 0 },
            'CONTACT_FORM': { status: 'loading', errors: 0, warnings: 0 },
            'NAVIGATION': { status: 'loading', errors: 0, warnings: 0 },
            'ANIMATIONS': { status: 'loading', errors: 0, warnings: 0 }
        };
        
        this.performanceMetrics = {};
        this.errorHistory = [];
        this.init();
    }
    
    init() {
        this.createSystemStatusUI();
        this.monitorPerformance();
        this.setupHealthChecks();
        this.interceptErrors();
        
        logInfo('SYSTEM_MONITOR', 'System Monitor initialisiert');
    }
    
    createSystemStatusUI() {
        const statusContainer = document.createElement('div');
        statusContainer.id = 'klehausen-system-status';
        statusContainer.innerHTML = `
            <div class="status-header">
                <span class="status-title">🔍 System Status</span>
                <button id="status-toggle">📊</button>
            </div>
            <div class="status-content" style="display: none;">
                <div id="subsystem-list"></div>
                <div class="status-actions">
                    <button id="run-diagnostics">🔧 Diagnose</button>
                    <button id="clear-errors">🗑️ Clear Errors</button>
                    <button id="export-report">📋 Report</button>
                </div>
            </div>
        `;
        
        statusContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            background: #1a1a1a;
            border: 1px solid #333;
            border-radius: 8px;
            font-family: 'Arial', sans-serif;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        `;
        
        document.body.appendChild(statusContainer);
        this.bindStatusEvents();
        this.updateStatusDisplay();
    }
    
    bindStatusEvents() {
        const toggle = document.getElementById('status-toggle');
        const content = document.querySelector('.status-content');
        
        toggle.addEventListener('click', () => {
            const isVisible = content.style.display !== 'none';
            content.style.display = isVisible ? 'none' : 'block';
        });
        
        document.getElementById('run-diagnostics').addEventListener('click', () => {
            this.runDiagnostics();
        });
        
        document.getElementById('clear-errors').addEventListener('click', () => {
            this.clearErrors();
        });
        
        document.getElementById('export-report').addEventListener('click', () => {
            this.exportSystemReport();
        });
    }
    
    updateSubsystemStatus(subsystem, status, error = null) {
        if (this.subsystems[subsystem]) {
            this.subsystems[subsystem].status = status;
            
            if (error) {
                this.subsystems[subsystem].errors++;
                this.errorHistory.push({
                    subsystem,
                    error,
                    timestamp: new Date().toISOString()
                });
            }
            
            this.updateStatusDisplay();
            logInfo('SYSTEM_MONITOR', `${subsystem} Status: ${status}`);
        }
    }
    
    updateStatusDisplay() {
        const listElement = document.getElementById('subsystem-list');
        if (!listElement) return;
        
        listElement.innerHTML = '';
        
        Object.entries(this.subsystems).forEach(([name, info]) => {
            const item = document.createElement('div');
            item.className = 'subsystem-item';
            
            const statusIcon = this.getStatusIcon(info.status);
            const statusColor = this.getStatusColor(info.status);
            
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; padding: 4px 8px; border-bottom: 1px solid #333;">
                    <span style="color: #ccc;">${name}</span>
                    <span style="color: ${statusColor};">${statusIcon} ${info.status}</span>
                </div>
                ${info.errors > 0 ? `<div style="color: #ff6666; font-size: 10px; padding: 2px 8px;">${info.errors} Fehler</div>` : ''}
            `;
            
            listElement.appendChild(item);
        });
    }
    
    getStatusIcon(status) {
        const icons = {
            'loading': '⏳',
            'running': '✅',
            'error': '❌',
            'warning': '⚠️',
            'stopped': '⭕'
        };
        return icons[status] || '❓';
    }
    
    getStatusColor(status) {
        const colors = {
            'loading': '#ffaa00',
            'running': '#44ff44',
            'error': '#ff4444',
            'warning': '#ffaa00',
            'stopped': '#888888'
        };
        return colors[status] || '#cccccc';
    }
    
    monitorPerformance() {
        // DOM Load Performance
        window.addEventListener('DOMContentLoaded', () => {
            const domLoadTime = performance.now();
            this.performanceMetrics.domLoad = domLoadTime;
            logInfo('PERFORMANCE', `DOM geladen in ${domLoadTime.toFixed(2)}ms`);
        });
        
        // Page Load Performance
        window.addEventListener('load', () => {
            const loadTime = performance.now();
            this.performanceMetrics.pageLoad = loadTime;
            logInfo('PERFORMANCE', `Seite vollständig geladen in ${loadTime.toFixed(2)}ms`);
            
            // Navigation Timing API
            if (performance.getEntriesByType) {
                const navigation = performance.getEntriesByType('navigation')[0];
                if (navigation) {
                    this.performanceMetrics.navigation = {
                        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
                        tcp: navigation.connectEnd - navigation.connectStart,
                        request: navigation.responseStart - navigation.requestStart,
                        response: navigation.responseEnd - navigation.responseStart,
                        domProcessing: navigation.domComplete - navigation.domLoading
                    };
                    
                    logInfo('PERFORMANCE', 'Navigation Timing erfasst', this.performanceMetrics.navigation);
                }
            }
        });
        
        // Memory Usage (falls verfügbar)
        if (performance.memory) {
            setInterval(() => {
                const memory = performance.memory;
                this.performanceMetrics.memory = {
                    used: Math.round(memory.usedJSHeapSize / 1048576),
                    total: Math.round(memory.totalJSHeapSize / 1048576),
                    limit: Math.round(memory.jsHeapSizeLimit / 1048576)
                };
                
                if (this.performanceMetrics.memory.used > 50) {
                    logWarn('PERFORMANCE', `Hoher Memory-Verbrauch: ${this.performanceMetrics.memory.used}MB`);
                }
            }, 30000); // Alle 30 Sekunden
        }
    }
    
    setupHealthChecks() {
        // Prüfe regelmäßig den Zustand aller Subsysteme
        setInterval(() => {
            this.runHealthChecks();
        }, 60000); // Alle 60 Sekunden
        
        // Initialer Health Check
        setTimeout(() => {
            this.runHealthChecks();
        }, 5000);
    }
    
    runHealthChecks() {
        logDebug('SYSTEM_MONITOR', 'Führe Health Checks durch');
        
        // Main Website Health Check
        this.checkMainWebsite();
        
        // Admin Panel Health Check
        this.checkAdminPanel();
        
        // PWA Health Check
        this.checkPWA();
        
        // Service Worker Health Check
        this.checkServiceWorker();
        
        // Contact Form Health Check
        this.checkContactForm();
        
        // Navigation Health Check
        this.checkNavigation();
    }
    
    checkMainWebsite() {
        try {
            const heroSection = document.querySelector('.hero');
            const navigation = document.querySelector('.navbar');
            
            if (heroSection && navigation) {
                this.updateSubsystemStatus('MAIN_WEBSITE', 'running');
            } else {
                this.updateSubsystemStatus('MAIN_WEBSITE', 'warning');
                logWarn('SYSTEM_MONITOR', 'Haupt-Website Elemente nicht gefunden');
            }
        } catch (error) {
            this.updateSubsystemStatus('MAIN_WEBSITE', 'error', error);
        }
    }
    
    checkAdminPanel() {
        try {
            if (window.location.pathname.includes('/admin/')) {
                const loginForm = document.getElementById('loginForm');
                const dashboard = document.getElementById('dashboard');
                
                if (loginForm || dashboard) {
                    this.updateSubsystemStatus('ADMIN_PANEL', 'running');
                } else {
                    this.updateSubsystemStatus('ADMIN_PANEL', 'error');
                }
            } else {
                this.updateSubsystemStatus('ADMIN_PANEL', 'stopped');
            }
        } catch (error) {
            this.updateSubsystemStatus('ADMIN_PANEL', 'error', error);
        }
    }
    
    checkPWA() {
        try {
            const manifest = document.querySelector('link[rel="manifest"]');
            const serviceWorker = 'serviceWorker' in navigator;
            
            if (manifest && serviceWorker) {
                this.updateSubsystemStatus('PWA', 'running');
            } else {
                this.updateSubsystemStatus('PWA', 'warning');
                logWarn('SYSTEM_MONITOR', 'PWA Features nicht vollständig verfügbar');
            }
        } catch (error) {
            this.updateSubsystemStatus('PWA', 'error', error);
        }
    }
    
    checkServiceWorker() {
        try {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration().then(registration => {
                    if (registration) {
                        this.updateSubsystemStatus('SERVICE_WORKER', 'running');
                    } else {
                        this.updateSubsystemStatus('SERVICE_WORKER', 'warning');
                    }
                });
            } else {
                this.updateSubsystemStatus('SERVICE_WORKER', 'stopped');
            }
        } catch (error) {
            this.updateSubsystemStatus('SERVICE_WORKER', 'error', error);
        }
    }
    
    checkContactForm() {
        try {
            const contactForm = document.getElementById('contactForm');
            if (contactForm) {
                this.updateSubsystemStatus('CONTACT_FORM', 'running');
            } else {
                this.updateSubsystemStatus('CONTACT_FORM', 'stopped');
            }
        } catch (error) {
            this.updateSubsystemStatus('CONTACT_FORM', 'error', error);
        }
    }
    
    checkNavigation() {
        try {
            const navLinks = document.querySelectorAll('.nav-link, .menu-link');
            if (navLinks.length > 0) {
                this.updateSubsystemStatus('NAVIGATION', 'running');
            } else {
                this.updateSubsystemStatus('NAVIGATION', 'warning');
            }
        } catch (error) {
            this.updateSubsystemStatus('NAVIGATION', 'error', error);
        }
    }
    
    interceptErrors() {
        const originalErrorHandler = window.onerror;
        
        window.onerror = (message, source, lineno, colno, error) => {
            this.handleGlobalError(message, source, lineno, colno, error);
            
            if (originalErrorHandler) {
                return originalErrorHandler.call(this, message, source, lineno, colno, error);
            }
        };
        
        window.addEventListener('unhandledrejection', (event) => {
            this.handleUnhandledRejection(event);
        });
    }
    
    handleGlobalError(message, source, lineno, colno, error) {
        const errorInfo = {
            message,
            source,
            lineno,
            colno,
            error: error?.stack || error
        };
        
        logError('GLOBAL_ERROR', `${message} at ${source}:${lineno}:${colno}`, errorInfo);
        
        // Bestimme betroffenes Subsystem
        let subsystem = 'MAIN_WEBSITE';
        if (source.includes('/admin/')) subsystem = 'ADMIN_PANEL';
        else if (source.includes('sw.js')) subsystem = 'SERVICE_WORKER';
        
        this.updateSubsystemStatus(subsystem, 'error', errorInfo);
    }
    
    handleUnhandledRejection(event) {
        logError('PROMISE_REJECTION', `Unhandled Promise Rejection: ${event.reason}`, event);
        this.updateSubsystemStatus('MAIN_WEBSITE', 'warning', event.reason);
    }
    
    runDiagnostics() {
        logInfo('SYSTEM_MONITOR', 'Starte umfassende Systemdiagnose');
        
        // Force Health Checks
        this.runHealthChecks();
        
        // Check Local Storage
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            logSuccess('SYSTEM_MONITOR', 'LocalStorage funktionsfähig');
        } catch (e) {
            logError('SYSTEM_MONITOR', 'LocalStorage nicht verfügbar', e);
        }
        
        // Check Network
        if (navigator.onLine) {
            logSuccess('SYSTEM_MONITOR', 'Netzwerkverbindung aktiv');
        } else {
            logWarn('SYSTEM_MONITOR', 'Keine Netzwerkverbindung');
        }
        
        // Check Browser Features
        const features = {
            'Fetch API': 'fetch' in window,
            'ES6 Modules': 'module' in document.createElement('script'),
            'CSS Grid': CSS.supports('display', 'grid'),
            'WebP': document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0,
            'Service Worker': 'serviceWorker' in navigator,
            'Web App Manifest': 'manifest' in document.createElement('link')
        };
        
        Object.entries(features).forEach(([feature, supported]) => {
            if (supported) {
                logSuccess('BROWSER_FEATURES', `${feature} wird unterstützt`);
            } else {
                logWarn('BROWSER_FEATURES', `${feature} wird nicht unterstützt`);
            }
        });
        
        logInfo('SYSTEM_MONITOR', 'Systemdiagnose abgeschlossen');
    }
    
    clearErrors() {
        Object.keys(this.subsystems).forEach(key => {
            this.subsystems[key].errors = 0;
            this.subsystems[key].warnings = 0;
        });
        
        this.errorHistory = [];
        this.updateStatusDisplay();
        logInfo('SYSTEM_MONITOR', 'Alle Fehler gelöscht');
    }
    
    exportSystemReport() {
        const report = {
            timestamp: new Date().toISOString(),
            subsystems: this.subsystems,
            performance: this.performanceMetrics,
            errors: this.errorHistory,
            browser: {
                userAgent: navigator.userAgent,
                language: navigator.language,
                platform: navigator.platform,
                cookieEnabled: navigator.cookieEnabled,
                onLine: navigator.onLine
            },
            page: {
                url: window.location.href,
                title: document.title,
                referrer: document.referrer
            }
        };
        
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `klehausen-system-report-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        logInfo('SYSTEM_MONITOR', 'System Report exportiert');
    }
}

// CSS für System Status
const systemStatusCSS = `
    #klehausen-system-status .status-header {
        background: #2a2a2a;
        padding: 8px 12px;
        border-bottom: 1px solid #333;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-radius: 8px 8px 0 0;
    }
    
    #klehausen-system-status .status-title {
        color: #00aaff;
        font-weight: bold;
    }
    
    #klehausen-system-status button {
        background: #333;
        color: #fff;
        border: 1px solid #555;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 11px;
        cursor: pointer;
    }
    
    #klehausen-system-status button:hover {
        background: #444;
    }
    
    #klehausen-system-status .status-content {
        background: #1a1a1a;
        border-radius: 0 0 8px 8px;
        max-height: 300px;
        overflow-y: auto;
    }
    
    #klehausen-system-status .status-actions {
        padding: 8px;
        border-top: 1px solid #333;
        display: flex;
        gap: 4px;
    }
    
    #klehausen-system-status .status-actions button {
        flex: 1;
        font-size: 10px;
        padding: 4px;
    }
`;

// Style hinzufügen
const systemStyle = document.createElement('style');
systemStyle.textContent = systemStatusCSS;
document.head.appendChild(systemStyle);

// System Monitor nach Logger initialisieren
document.addEventListener('DOMContentLoaded', () => {
    if (window.KLLogger) {
        window.KLSystemMonitor = new KleHausenSystemMonitor();
    }
});
