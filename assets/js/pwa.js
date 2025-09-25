/**
 * Gold Copy Trading - PWA Installation and Management
 * Handles service worker registration, app installation, and offline functionality
 */

class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.installButton = null;
        this.isInstalled = false;

        this.init();
    }

    async init() {
        // Check if already installed
        this.checkInstallation();

        // Register service worker
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });

                console.log('Service Worker registered successfully:', registration);

                // Handle updates
                registration.addEventListener('updatefound', () => {
                    this.handleServiceWorkerUpdate(registration.installing);
                });

                // Handle messages from service worker
                navigator.serviceWorker.addEventListener('message', event => {
                    this.handleServiceWorkerMessage(event.data);
                });

            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }

        // Handle install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Handle app installed
        window.addEventListener('appinstalled', () => {
            console.log('PWA installed successfully');
            this.isInstalled = true;
            this.hideInstallButton();
            this.trackInstallation();
        });

        // Create install UI
        this.createInstallUI();

        // Handle offline/online status
        this.handleConnectionStatus();
    }

    checkInstallation() {
        // Check if running as PWA
        if (window.matchMedia('(display-mode: standalone)').matches ||
            window.navigator.standalone === true) {
            this.isInstalled = true;
            document.body.classList.add('pwa-installed');
        }
    }

    createInstallUI() {
        // Create install banner
        const installBanner = document.createElement('div');
        installBanner.id = 'pwa-install-banner';
        installBanner.className = 'pwa-install-banner hidden';
        installBanner.innerHTML = `
            <div class="install-content">
                <div class="install-icon">
                    <i class="fas fa-mobile-alt"></i>
                </div>
                <div class="install-text">
                    <h3>Install Gold Copy Trading</h3>
                    <p>Get quick access to your trading dashboard</p>
                </div>
                <div class="install-actions">
                    <button class="btn btn-primary btn-install" id="pwa-install-btn">
                        <i class="fas fa-download"></i>
                        Install App
                    </button>
                    <button class="btn btn-secondary btn-dismiss" id="pwa-dismiss-btn">
                        <i class="fas fa-times"></i>
                        Not Now
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(installBanner);

        // Add event listeners
        this.installButton = document.getElementById('pwa-install-btn');
        const dismissButton = document.getElementById('pwa-dismiss-btn');

        this.installButton.addEventListener('click', () => this.installApp());
        dismissButton.addEventListener('click', () => this.dismissInstallPrompt());
    }

    showInstallButton() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner && !this.isInstalled) {
            banner.classList.remove('hidden');

            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (!banner.classList.contains('hidden')) {
                    this.dismissInstallPrompt();
                }
            }, 10000);
        }
    }

    hideInstallButton() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.classList.add('hidden');
        }
    }

    async installApp() {
        if (this.deferredPrompt) {
            this.deferredPrompt.prompt();

            const choiceResult = await this.deferredPrompt.userChoice;

            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
                this.trackInstallAccepted();
            } else {
                console.log('User dismissed the install prompt');
                this.trackInstallDismissed();
            }

            this.deferredPrompt = null;
            this.hideInstallButton();
        }
    }

    dismissInstallPrompt() {
        this.hideInstallButton();
        this.trackInstallDismissed();

        // Don't show again for 7 days
        localStorage.setItem('pwa-install-dismissed', Date.now() + (7 * 24 * 60 * 60 * 1000));
    }

    handleServiceWorkerUpdate(installing) {
        installing.addEventListener('statechange', () => {
            if (installing.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                    this.showUpdateAvailable();
                }
            }
        });
    }

    showUpdateAvailable() {
        // Create update notification
        const updateNotification = document.createElement('div');
        updateNotification.className = 'pwa-update-notification';
        updateNotification.innerHTML = `
            <div class="update-content">
                <i class="fas fa-sync-alt"></i>
                <span>New version available!</span>
                <button class="btn btn-primary btn-sm" onclick="PWA.updateApp()">Update</button>
                <button class="btn btn-secondary btn-sm" onclick="this.parentElement.parentElement.remove()">Later</button>
            </div>
        `;

        document.body.appendChild(updateNotification);

        // Auto-remove after 30 seconds
        setTimeout(() => {
            if (updateNotification.parentElement) {
                updateNotification.remove();
            }
        }, 30000);
    }

    updateApp() {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
        }
        window.location.reload();
    }

    handleConnectionStatus() {
        const updateOnlineStatus = () => {
            const isOnline = navigator.onLine;
            document.body.classList.toggle('offline', !isOnline);

            if (!isOnline) {
                this.showOfflineNotification();
            } else {
                this.hideOfflineNotification();
            }
        };

        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        // Initial check
        updateOnlineStatus();
    }

    showOfflineNotification() {
        let offlineBar = document.getElementById('offline-notification');

        if (!offlineBar) {
            offlineBar = document.createElement('div');
            offlineBar.id = 'offline-notification';
            offlineBar.className = 'offline-notification';
            offlineBar.innerHTML = `
                <i class="fas fa-wifi"></i>
                <span>You're offline. Some features may be limited.</span>
            `;

            document.body.insertBefore(offlineBar, document.body.firstChild);
        }
    }

    hideOfflineNotification() {
        const offlineBar = document.getElementById('offline-notification');
        if (offlineBar) {
            offlineBar.remove();
        }
    }

    handleServiceWorkerMessage(data) {
        if (data.type === 'CACHE_UPDATED') {
            console.log('Cache updated for:', data.url);
        }

        if (data.type === 'OFFLINE_READY') {
            console.log('App is ready for offline use');
        }
    }

    // Analytics tracking
    trackInstallation() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: 'App Installed'
            });
        }
    }

    trackInstallAccepted() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install_prompt_accepted', {
                event_category: 'PWA',
                event_label: 'Install Prompt Accepted'
            });
        }
    }

    trackInstallDismissed() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'pwa_install_prompt_dismissed', {
                event_category: 'PWA',
                event_label: 'Install Prompt Dismissed'
            });
        }
    }

    // Cache management methods
    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('All caches cleared');
        }
    }

    async getCacheSize() {
        if ('navigator' in window && 'storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage,
                quota: estimate.quota,
                usedMB: Math.round(estimate.usage / 1024 / 1024 * 100) / 100,
                quotaMB: Math.round(estimate.quota / 1024 / 1024 * 100) / 100
            };
        }
        return null;
    }
}

// Initialize PWA when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.PWA = new PWAManager();
});

// Add PWA-specific styles
const pwaStyles = `
<style>
.pwa-install-banner {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    background: var(--dark);
    border: 2px solid var(--gold);
    border-radius: 8px;
    padding: 20px;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    transform: translateY(0);
    transition: transform 0.3s ease;
}

.pwa-install-banner.hidden {
    transform: translateY(150%);
    pointer-events: none;
}

.install-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.install-icon {
    color: var(--gold);
    font-size: 2rem;
}

.install-text h3 {
    margin: 0 0 5px 0;
    color: var(--gold);
    font-size: 1.1rem;
}

.install-text p {
    margin: 0;
    color: var(--white);
    font-size: 0.9rem;
}

.install-actions {
    display: flex;
    gap: 10px;
    margin-left: auto;
}

.install-actions .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
    min-width: auto;
}

.pwa-update-notification {
    position: fixed;
    top: 80px;
    right: 20px;
    background: var(--dark);
    border: 2px solid var(--gold);
    border-radius: 8px;
    padding: 15px;
    z-index: 1000;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    max-width: 300px;
}

.update-content {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--white);
}

.update-content i {
    color: var(--gold);
    animation: spin 2s linear infinite;
}

@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.offline-notification {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #ff6b6b;
    color: white;
    padding: 10px;
    text-align: center;
    z-index: 1001;
    font-weight: 600;
}

.offline-notification i {
    margin-right: 8px;
}

.pwa-installed .header {
    padding-top: 0;
}

@media (max-width: 768px) {
    .pwa-install-banner {
        bottom: 10px;
        left: 10px;
        right: 10px;
        padding: 15px;
    }

    .install-content {
        flex-direction: column;
        text-align: center;
        gap: 10px;
    }

    .install-actions {
        margin-left: 0;
        justify-content: center;
        flex-wrap: wrap;
    }

    .pwa-update-notification {
        right: 10px;
        left: 10px;
        max-width: none;
    }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', pwaStyles);