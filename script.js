// Splash Screen Management
class SplashScreen {
    constructor() {
        this.splashElement = document.getElementById('splashScreen');
        this.minDisplayTime = 2000; // Mindestens 2 Sekunden anzeigen
        this.startTime = Date.now();
        this.isReady = false;
        this.platform = this.detectPlatform();
        
        this.init();
    }
    
    detectPlatform() {
        const userAgent = navigator.userAgent.toLowerCase();
        const standalone = window.navigator.standalone;
        const displayMode = window.matchMedia('(display-mode: standalone)').matches;
        
        if (standalone === true || displayMode) {
            if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
            if (/android/.test(userAgent)) return 'android';
            if (/windows/.test(userAgent)) return 'windows';
            if (/macintosh|mac os x/.test(userAgent)) return 'macos';
        }
        
        return 'web';
    }
    
    init() {
        // Prüfen ob es sich um einen PWA-Start handelt
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                     window.navigator.standalone === true ||
                     document.referrer.includes('android-app://');
        
        // Bei PWA-Start oder erstem Besuch Splash Screen anzeigen
        const shouldShowSplash = isPWA || !sessionStorage.getItem('splashShown') || 
                                performance.navigation.type === 1; // Reload
        
        if (shouldShowSplash) {
            this.show();
            this.customizePlatform();
            this.simulateLoading();
        } else {
            this.hide(true); // Sofort ausblenden
        }
        
        // Page Load Event
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onPageReady());
        } else {
            this.onPageReady();
        }
        
        // Window Load Event für alle Ressourcen
        window.addEventListener('load', () => this.onAllResourcesReady());
    }
    
    customizePlatform() {
        if (!this.splashElement) return;
        
        // Platform-spezifische Klassen hinzufügen
        this.splashElement.classList.add(this.platform);
        
        // Platform-spezifische Anpassungen
        switch (this.platform) {
            case 'ios':
                this.addIOSFeatures();
                break;
            case 'android':
                this.addAndroidFeatures();
                break;
            case 'windows':
                this.addWindowsFeatures();
                break;
            case 'macos':
                this.addMacOSFeatures();
                break;
        }
        
        // Plattform-Info hinzufügen
        this.addPlatformInfo();
    }
    
    addIOSFeatures() {
        const logo = this.splashElement.querySelector('.splash-logo');
        if (logo) {
            logo.classList.add('heartbeat');
        }
        
        // iOS-spezifische Loading Animation
        const loading = this.splashElement.querySelector('.splash-loading');
        if (loading) {
            loading.style.background = 'rgba(255, 255, 255, 0.1)';
        }
    }
    
    addAndroidFeatures() {
        // Material Design Ripple Effect
        const content = this.splashElement.querySelector('.splash-content');
        if (content) {
            content.addEventListener('click', this.createRipple.bind(this));
        }
        
        // Android-spezifische Farben
        const logo = this.splashElement.querySelector('.splash-logo');
        if (logo) {
            logo.style.boxShadow = '0 8px 32px rgba(255, 123, 0, 0.4)';
        }
    }
    
    addWindowsFeatures() {
        // Windows-Style Loading
        const loading = this.splashElement.querySelector('.splash-loading');
        if (loading) {
            loading.classList.add('rainbow');
        }
        
        // Tile-ähnlicher Effekt
        const logo = this.splashElement.querySelector('.splash-logo');
        if (logo) {
            logo.style.borderRadius = '8px';
        }
    }
    
    addMacOSFeatures() {
        // macOS-Style Blur Effect
        this.splashElement.style.backdropFilter = 'blur(20px)';
        
        // Elegantere Schatten
        const logo = this.splashElement.querySelector('.splash-logo');
        if (logo) {
            logo.style.boxShadow = '0 25px 50px rgba(255, 123, 0, 0.3)';
        }
    }
    
    addPlatformInfo() {
        const platformInfo = document.createElement('div');
        platformInfo.className = 'splash-platform-info';
        
        const platformNames = {
            ios: 'iOS App',
            android: 'Android App',
            windows: 'Windows App',
            macos: 'macOS App',
            web: 'Web App'
        };
        
        platformInfo.innerHTML = `
            <div>KleHausen ${platformNames[this.platform]}</div>
            <div>Version 1.0.0</div>
        `;
        
        this.splashElement.appendChild(platformInfo);
    }
    
    createRipple(event) {
        const ripple = document.createElement('div');
        const rect = event.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 123, 0, 0.3);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        event.currentTarget.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    show() {
        if (this.splashElement) {
            this.splashElement.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            
            // Splash Screen Animationen starten
            this.startAnimations();
        }
    }
    
    hide(immediate = false) {
        if (!this.splashElement) return;
        
        const hideSplash = () => {
            this.splashElement.classList.add('fade-out');
            
            setTimeout(() => {
                this.splashElement.style.display = 'none';
                document.body.style.overflow = 'auto';
                sessionStorage.setItem('splashShown', 'true');
                
                // Event für andere Scripts dass Splash beendet ist
                window.dispatchEvent(new CustomEvent('splashComplete'));
            }, 500); // Fade-out Animation Zeit
        };
        
        if (immediate) {
            hideSplash();
        } else {
            const elapsedTime = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minDisplayTime - elapsedTime);
            
            setTimeout(hideSplash, remainingTime);
        }
    }
    
    onPageReady() {
        this.isReady = true;
        this.checkReadyToHide();
    }
    
    onAllResourcesReady() {
        this.allResourcesReady = true;
        this.checkReadyToHide();
    }
    
    checkReadyToHide() {
        if (this.isReady && this.allResourcesReady) {
            this.hide();
        }
    }
    
    startAnimations() {
        // Zusätzliche Animationen für den Splash Screen
        const logo = this.splashElement.querySelector('.splash-logo');
        const title = this.splashElement.querySelector('.splash-title');
        const subtitle = this.splashElement.querySelector('.splash-subtitle');
        
        // Staggered Animation
        setTimeout(() => {
            if (logo) logo.style.animationDelay = '0s';
        }, 100);
        
        setTimeout(() => {
            if (title) title.style.animationDelay = '0.3s';
        }, 200);
        
        setTimeout(() => {
            if (subtitle) subtitle.style.animationDelay = '0.6s';
        }, 300);
    }
    
    simulateLoading() {
        // Platform-spezifische Loading-Nachrichten
        const operations = {
            ios: [
                'Lade aus App Store...',
                'Verbinde zu Discord...',
                'Bereite Community vor...',
                'iOS App bereit!'
            ],
            android: [
                'Lade aus Play Store...',
                'Verbinde zu Discord...',
                'Bereite Projekte vor...',
                'Android App bereit!'
            ],
            windows: [
                'Lade aus Microsoft Store...',
                'Verbinde zu Discord...',
                'Bereite Features vor...',
                'Windows App bereit!'
            ],
            web: [
                'Lade Community Daten...',
                'Verbinde zu Discord...',
                'Bereite Projekte vor...',
                'Initialisiere PWA...'
            ]
        };
        
        const platformOps = operations[this.platform] || operations.web;
        const subtitle = this.splashElement.querySelector('.splash-subtitle');
        let currentOp = 0;
        
        const updateOperation = () => {
            if (subtitle && currentOp < platformOps.length) {
                subtitle.textContent = platformOps[currentOp];
                currentOp++;
                setTimeout(updateOperation, 500);
            } else if (subtitle) {
                subtitle.textContent = 'Kreative Discord Community';
            }
        };
        
        setTimeout(updateOperation, 1000);
    }
}

// Mobile Navigation Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navMenu = document.querySelector('.nav-menu');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !navMenu.contains(e.target)) {
        if (navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }
});

// Prevent scrolling when mobile menu is open
navMenu.addEventListener('transitionstart', () => {
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    }
});

navMenu.addEventListener('transitionend', () => {
    if (!navMenu.classList.contains('active')) {
        document.body.style.overflow = 'auto';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(15, 15, 15, 0.98)';
    } else {
        navbar.style.background = 'rgba(15, 15, 15, 0.95)';
    }
});

// Contact form handling
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Sende Nachricht an Admin Panel (nur wenn PWA)
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            
            // Speichere Nachricht für Admin Panel
            const adminMessages = JSON.parse(localStorage.getItem('adminMessages') || '[]');
            const newMessage = {
                id: Math.max(...adminMessages.map(m => m.id), 0) + 1,
                name: data.name,
                email: data.email,
                subject: data.subject,
                message: data.message,
                timestamp: new Date().toLocaleString('de-DE')
            };
            
            adminMessages.push(newMessage);
            localStorage.setItem('adminMessages', JSON.stringify(adminMessages));
            
            // Admin Panel benachrichtigen falls geöffnet
            try {
                if (window.addContactMessage) {
                    window.addContactMessage(newMessage);
                }
            } catch (error) {
                console.log('Admin Panel nicht verfügbar');
            }
        }
        
        // Show success message
        showNotification('Nachricht wurde erfolgreich gesendet! Wir melden uns bald bei dir.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--error-color)' : 'var(--primary-color)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Mobile-specific optimizations with PWA support
function handleMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
    
    if (isMobile || isStandalone || isFullscreen) {
        // Disable hover effects on mobile/PWA
        document.body.classList.add('mobile-device');
        
        // Add better touch scrolling
        document.body.style.webkitOverflowScrolling = 'touch';
        
        // Optimize viewport for mobile PWA
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
        }
        
        // Reduce motion for better performance on mobile
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (prefersReducedMotion.matches) {
            document.documentElement.style.scrollBehavior = 'auto';
        }
        
        // PWA status bar handling
        if (isStandalone) {
            console.log('Running as PWA');
            document.body.classList.add('pwa-mode');
            
            // Add special handling for PWA
            const navbar = document.querySelector('.navbar');
            const hero = document.querySelector('.hero');
            
            if (navbar) {
                navbar.style.paddingTop = 'max(0.75rem, env(safe-area-inset-top))';
            }
            
            if (hero) {
                hero.style.paddingTop = 'max(1rem, env(safe-area-inset-top))';
            }
        }
        
        // Better font rendering on mobile
        document.body.style.webkitFontSmoothing = 'antialiased';
        document.body.style.mozOsxFontSmoothing = 'grayscale';
        
        // Optimize images for retina displays
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (window.devicePixelRatio > 1) {
                img.style.imageRendering = 'crisp-edges';
            }
        });
    }
}

// Enhanced contact form with offline support
function enhanceContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Check if online
            if (navigator.onLine) {
                // Send immediately if online
                submitForm(data);
            } else {
                // Store for later if offline
                storeFormDataForLater(data);
                showNotification('Nachricht gespeichert. Wird gesendet sobald Sie online sind.', 'info');
            }
            
            this.reset();
        });
    }
}

function submitForm(data) {
    // Simulate form submission
    setTimeout(() => {
        showNotification('Nachricht wurde erfolgreich gesendet!', 'success');
    }, 1000);
}

function storeFormDataForLater(data) {
    // Store in localStorage for background sync
    localStorage.setItem('pendingContactForm', JSON.stringify(data));
    
    // Register for background sync if supported
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
        navigator.serviceWorker.ready.then(registration => {
            return registration.sync.register('contact-form-sync');
        });
    }
}

// Performance observer for monitoring
if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            // Log slow operations
            if (entry.duration > 100) {
                console.warn('Slow operation detected:', entry.name, entry.duration);
            }
        }
    });
    
    observer.observe({ entryTypes: ['measure', 'navigation'] });
}

// Initialize all enhancements
document.addEventListener('DOMContentLoaded', () => {
    handleMobileOptimizations();
    enhanceContactForm();
    
    // Add visual feedback for touch devices
    if ('ontouchstart' in window) {
        document.body.classList.add('touch-device');
        
        // Add touch feedback to interactive elements
        const interactiveElements = document.querySelectorAll('button, .btn, .project-link, .contact-link, .nav-link');
        interactiveElements.forEach(element => {
            element.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            }, { passive: true });
            
            element.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 150);
            }, { passive: true });
        });
    }
});

// Run mobile optimizations on load and resize
window.addEventListener('load', handleMobileOptimizations);
window.addEventListener('resize', handleMobileOptimizations);
document.addEventListener('DOMContentLoaded', () => {
    // Improve touch targets on mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Add touch feedback to buttons
        const buttons = document.querySelectorAll('.btn, .project-link, .contact-link');
        buttons.forEach(button => {
            button.addEventListener('touchstart', function() {
                this.style.opacity = '0.8';
            });
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.opacity = '1';
                }, 150);
            });
        });
        
        // Optimize scroll behavior for mobile
        document.documentElement.style.scrollBehavior = 'smooth';
        
        // Add swipe gesture for mobile menu (simple implementation)
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 100;
            const swipeDistance = touchEndX - touchStartX;
            
            // Swipe right to open menu (from left edge)
            if (swipeDistance > swipeThreshold && touchStartX < 50) {
                if (!navMenu.classList.contains('active')) {
                    mobileMenu.classList.add('active');
                    navMenu.classList.add('active');
                }
            }
            
            // Swipe left to close menu
            if (swipeDistance < -swipeThreshold && navMenu.classList.contains('active')) {
                mobileMenu.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }
    }
    
    // Existing animation observer code
    const animateElements = document.querySelectorAll('.project-card, .stat-card, .team-description, .team-join, .contact-info, .contact-form');
    animateElements.forEach(el => observer.observe(el));
});

// Project card hover effects
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Floating cards animation control
const floatingCards = document.querySelectorAll('.floating-card');
floatingCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 2}s`;
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2025', currentYear);
}

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Close mobile menu
        if (navMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Close any notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });
    }
});

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-content');
    
    if (hero && heroContent) {
        const rate = scrolled * -0.5;
        heroContent.style.transform = `translateY(${rate}px)`;
    }
});

// Add loading states for external links
document.querySelectorAll('a[href^="http"]').forEach(link => {
    link.addEventListener('click', function() {
        this.style.opacity = '0.7';
        this.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.style.opacity = '1';
            this.style.pointerEvents = 'auto';
        }, 1500);
    });
});

// Copy Discord invite link functionality (if needed)
function copyDiscordLink() {
    const discordLink = 'https://dsc.gg/kle';
    navigator.clipboard.writeText(discordLink).then(() => {
        showNotification('Discord Einladungslink kopiert!', 'success');
    }).catch(() => {
        showNotification('Fehler beim Kopieren des Links', 'error');
    });
}

// Add copy functionality to Discord links
document.querySelectorAll('a[href*="discord.gg"]').forEach(link => {
    link.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        copyDiscordLink();
    });
});

// Performance optimization: Lazy load images when implemented
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('SW registered: ', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New content available, show update notification
                        showUpdateNotification();
                    }
                });
            });
            
        } catch (registrationError) {
            console.log('SW registration failed: ', registrationError);
        }
    });
}

// PWA Install Prompt
let deferredPrompt;
const installButton = document.createElement('button');
installButton.textContent = 'App installieren';
installButton.className = 'btn btn-primary install-btn';
installButton.style.display = 'none';
installButton.innerHTML = '<i class="fas fa-download"></i> App installieren';

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button
    showInstallButton();
});

function showInstallButton() {
    // Add install button to hero section
    const heroButtons = document.querySelector('.hero-buttons');
    if (heroButtons && !document.querySelector('.install-btn')) {
        heroButtons.appendChild(installButton);
        installButton.style.display = 'inline-flex';
        
        installButton.addEventListener('click', async () => {
            if (deferredPrompt) {
                // Show the prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`User response to the install prompt: ${outcome}`);
                
                if (outcome === 'accepted') {
                    showNotification('App wird installiert...', 'success');
                }
                
                // Clear the deferredPrompt variable
                deferredPrompt = null;
                installButton.style.display = 'none';
            }
        });
    }
}

// Handle successful app installation
window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed successfully');
    showNotification('App erfolgreich installiert!', 'success');
    
    // Hide install button
    if (installButton) {
        installButton.style.display = 'none';
    }
});

// Update notification for PWA
function showUpdateNotification() {
    const updateNotification = document.createElement('div');
    updateNotification.className = 'update-notification';
    updateNotification.innerHTML = `
        <div class="update-content">
            <i class="fas fa-sync-alt"></i>
            <span>Neue Version verfügbar!</span>
            <button class="btn btn-sm btn-primary" onclick="refreshApp()">Aktualisieren</button>
            <button class="btn btn-sm btn-secondary" onclick="dismissUpdate()">Später</button>
        </div>
    `;
    
    updateNotification.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--surface-color);
        border: 1px solid var(--primary-color);
        border-radius: var(--border-radius);
        padding: 1rem;
        box-shadow: var(--shadow-lg);
        z-index: 10000;
        max-width: 90%;
        width: 400px;
    `;
    
    document.body.appendChild(updateNotification);
}

function refreshApp() {
    window.location.reload();
}

function dismissUpdate() {
    const notification = document.querySelector('.update-notification');
    if (notification) {
        notification.remove();
    }
}

// Enhanced offline functionality
window.addEventListener('online', () => {
    showNotification('Verbindung wiederhergestellt!', 'success');
    document.body.classList.remove('offline');
});

window.addEventListener('offline', () => {
    showNotification('Offline-Modus aktiviert', 'info');
    document.body.classList.add('offline');
});

// Theme toggle functionality (for future implementation)
function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

// Add custom cursor for interactive elements
document.querySelectorAll('a, button, .project-card, .stat-card').forEach(element => {
    element.style.cursor = 'pointer';
});

// Initialize Splash Screen
const splash = new SplashScreen();

// Enhanced splash screen for PWA
window.addEventListener('splashComplete', () => {
    // Nach dem Splash Screen zusätzliche Initialisierungen
    console.log('🎉 KleHausen Website loaded successfully!');
    console.log('🧡 Made with love by the KleHausen Team');
    
    // PWA-spezifische Features nach Splash Screen
    if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 Running as PWA - Splash complete!');
        
        // Zusätzliche PWA Features hier
        checkForUpdates();
    }
});

// Fallback falls Splash Screen nicht existiert
if (!document.getElementById('splashScreen')) {
    console.log('🎉 KleHausen Website loaded successfully!');
    console.log('🧡 Made with love by the KleHausen Team');
}
