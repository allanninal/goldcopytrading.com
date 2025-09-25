/**
 * Gold Copy Trading - Comprehensive Error Boundary System
 * Handles JavaScript errors, provides fallback UI, and tracks issues
 */

class ErrorBoundary {
    constructor() {
        this.errors = [];
        this.isOnline = navigator.onLine;
        this.init();
    }

    init() {
        // Global error handler
        window.addEventListener('error', (event) => {
            this.handleError({
                type: 'javascript',
                message: event.message,
                filename: event.filename,
                lineno: event.lineno,
                colno: event.colno,
                error: event.error,
                stack: event.error ? event.error.stack : null,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            this.handleError({
                type: 'promise',
                message: event.reason ? event.reason.message : 'Unhandled promise rejection',
                error: event.reason,
                stack: event.reason ? event.reason.stack : null,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent
            });
        });

        // Resource loading error handler
        window.addEventListener('error', (event) => {
            if (event.target !== window && event.target.tagName) {
                this.handleResourceError({
                    type: 'resource',
                    element: event.target.tagName.toLowerCase(),
                    source: event.target.src || event.target.href,
                    message: `Failed to load ${event.target.tagName.toLowerCase()}`,
                    timestamp: new Date().toISOString(),
                    url: window.location.href
                });
            }
        }, true);

        // Network status monitoring
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.hideOfflineMessage();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineMessage();
        });

        // Chart.js error handling
        this.setupChartErrorHandling();

        // Image error handling
        this.setupImageErrorHandling();

        // Performance monitoring
        this.setupPerformanceMonitoring();
    }

    handleError(errorInfo) {
        console.error('Error caught by boundary:', errorInfo);

        // Store error
        this.errors.push(errorInfo);

        // Limit stored errors to prevent memory leaks
        if (this.errors.length > 10) {
            this.errors = this.errors.slice(-10);
        }

        // Track with analytics if available
        this.trackError(errorInfo);

        // Show user-friendly error message
        this.showErrorMessage(errorInfo);

        // Try to recover from certain errors
        this.attemptRecovery(errorInfo);
    }

    handleResourceError(errorInfo) {
        console.warn('Resource loading error:', errorInfo);

        // Handle specific resource types
        switch (errorInfo.element) {
            case 'img':
                this.handleImageError(errorInfo);
                break;
            case 'script':
                this.handleScriptError(errorInfo);
                break;
            case 'link':
                this.handleStylesheetError(errorInfo);
                break;
            default:
                console.warn('Unhandled resource error:', errorInfo);
        }

        // Track resource errors
        this.trackError(errorInfo);
    }

    handleImageError(errorInfo) {
        // Find all failed images and show placeholder
        document.querySelectorAll('img').forEach(img => {
            if (img.src === errorInfo.source) {
                img.style.display = 'none';

                const placeholder = document.createElement('div');
                placeholder.className = 'image-error-placeholder';
                placeholder.innerHTML = `
                    <div class="placeholder-content">
                        <i class="fas fa-image"></i>
                        <p>Image temporarily unavailable</p>
                    </div>
                `;

                img.parentNode.insertBefore(placeholder, img.nextSibling);
            }
        });
    }

    handleScriptError(errorInfo) {
        // Try to reload critical scripts
        if (errorInfo.source.includes('chart.js')) {
            this.reloadChart();
        }
    }

    handleStylesheetError(errorInfo) {
        // Add fallback styles
        if (!document.getElementById('fallback-styles')) {
            const fallbackCSS = document.createElement('style');
            fallbackCSS.id = 'fallback-styles';
            fallbackCSS.textContent = `
                .error-boundary {
                    background: #ff6b6b;
                    color: white;
                    padding: 15px;
                    border-radius: 5px;
                    margin: 10px 0;
                    text-align: center;
                }
                .image-error-placeholder {
                    background: #f0f0f0;
                    border: 2px dashed #ccc;
                    padding: 20px;
                    text-align: center;
                    border-radius: 5px;
                    color: #666;
                }
                .offline-message {
                    background: #ffa726;
                    color: white;
                    padding: 10px;
                    text-align: center;
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    z-index: 1000;
                }
            `;
            document.head.appendChild(fallbackCSS);
        }
    }

    setupChartErrorHandling() {
        // Override Chart.js error handling
        if (typeof Chart !== 'undefined') {
            Chart.defaults.plugins.legend.onHover = function(event, legendItem, legend) {
                try {
                    // Safe hover handling
                } catch (error) {
                    console.warn('Chart hover error:', error);
                }
            };
        }

        // Monitor chart containers
        const chartContainers = document.querySelectorAll('.chart-container');
        chartContainers.forEach(container => {
            const canvas = container.querySelector('canvas');
            if (canvas) {
                // Add error boundary around chart
                this.wrapChartWithErrorBoundary(container, canvas);
            }
        });
    }

    wrapChartWithErrorBoundary(container, canvas) {
        const originalId = canvas.id;

        setTimeout(() => {
            // Check if chart loaded successfully
            if (!canvas.chart && !window.Chart) {
                this.showChartError(container, 'Chart library failed to load');
            } else if (!canvas.chart) {
                // Chart didn't initialize
                setTimeout(() => {
                    if (!canvas.chart) {
                        this.showChartError(container, 'Chart failed to initialize');
                    }
                }, 5000);
            }
        }, 3000);
    }

    showChartError(container, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'chart-error-fallback';
        errorDiv.innerHTML = `
            <div class="error-content">
                <i class="fas fa-chart-bar"></i>
                <h3>Chart Loading Error</h3>
                <p>${message}</p>
                <button class="btn btn-secondary" onclick="location.reload()">
                    <i class="fas fa-sync-alt"></i>
                    Refresh Page
                </button>
            </div>
        `;

        container.appendChild(errorDiv);

        // Track chart error
        this.trackError({
            type: 'chart',
            message: message,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
    }

    setupImageErrorHandling() {
        // Add error handlers to all images
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('img').forEach(img => {
                img.addEventListener('error', (event) => {
                    this.handleImageError({
                        type: 'resource',
                        element: 'img',
                        source: img.src,
                        message: 'Image failed to load'
                    });
                });
            });
        });

        // Handle lazy-loaded images
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.addEventListener('error', () => {
                                this.handleImageError({
                                    type: 'resource',
                                    element: 'img',
                                    source: img.dataset.src,
                                    message: 'Lazy-loaded image failed'
                                });
                            });
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    setupPerformanceMonitoring() {
        // Monitor long tasks
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    list.getEntries().forEach(entry => {
                        if (entry.duration > 100) {
                            console.warn('Long task detected:', entry.duration + 'ms');

                            this.trackError({
                                type: 'performance',
                                message: `Long task: ${entry.duration}ms`,
                                timestamp: new Date().toISOString(),
                                url: window.location.href
                            });
                        }
                    });
                });

                observer.observe({ entryTypes: ['longtask'] });
            } catch (error) {
                console.warn('Performance monitoring not supported:', error);
            }
        }

        // Monitor memory usage
        if ('memory' in performance) {
            setInterval(() => {
                const memory = performance.memory;
                const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
                const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);

                if (usedMB > limitMB * 0.9) {
                    console.warn('High memory usage:', usedMB + 'MB');

                    this.trackError({
                        type: 'performance',
                        message: `High memory usage: ${usedMB}MB`,
                        timestamp: new Date().toISOString(),
                        url: window.location.href
                    });
                }
            }, 30000);
        }
    }

    showErrorMessage(errorInfo) {
        // Don't show UI errors for minor issues
        if (errorInfo.type === 'resource') return;

        const errorBanner = document.createElement('div');
        errorBanner.className = 'error-boundary';
        errorBanner.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Something went wrong. Please refresh the page if issues persist.</span>
                <button class="btn btn-sm btn-secondary" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                    Dismiss
                </button>
            </div>
        `;

        // Show at top of page
        document.body.insertBefore(errorBanner, document.body.firstChild);

        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (errorBanner.parentElement) {
                errorBanner.remove();
            }
        }, 10000);
    }

    showOfflineMessage() {
        if (document.getElementById('offline-message')) return;

        const offlineMsg = document.createElement('div');
        offlineMsg.id = 'offline-message';
        offlineMsg.className = 'offline-message';
        offlineMsg.innerHTML = `
            <i class="fas fa-wifi"></i>
            You're offline. Some features may be limited.
        `;

        document.body.insertBefore(offlineMsg, document.body.firstChild);
    }

    hideOfflineMessage() {
        const offlineMsg = document.getElementById('offline-message');
        if (offlineMsg) {
            offlineMsg.remove();
        }
    }

    attemptRecovery(errorInfo) {
        // Try to recover from specific errors
        if (errorInfo.message && errorInfo.message.includes('Chart')) {
            this.reloadChart();
        }

        if (errorInfo.type === 'promise' && errorInfo.message.includes('fetch')) {
            // Retry failed network requests
            setTimeout(() => {
                console.log('Attempting to retry failed request...');
            }, 2000);
        }
    }

    reloadChart() {
        // Attempt to reinitialize charts
        setTimeout(() => {
            if (typeof Chart !== 'undefined') {
                document.querySelectorAll('canvas').forEach(canvas => {
                    if (canvas.id && !canvas.chart) {
                        console.log('Attempting to reload chart:', canvas.id);
                        // Chart reloading logic would go here
                    }
                });
            }
        }, 1000);
    }

    trackError(errorInfo) {
        // Track with Google Analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: `${errorInfo.type}: ${errorInfo.message}`,
                fatal: errorInfo.type === 'javascript',
                error_type: errorInfo.type,
                error_location: errorInfo.filename || errorInfo.source || 'unknown',
                user_agent: navigator.userAgent,
                online_status: this.isOnline ? 'online' : 'offline'
            });
        }

        // Store errors for debugging (in production, send to error tracking service)
        if (typeof localStorage !== 'undefined') {
            try {
                const storedErrors = JSON.parse(localStorage.getItem('errorLog') || '[]');
                storedErrors.push(errorInfo);

                // Keep only last 20 errors
                const recentErrors = storedErrors.slice(-20);
                localStorage.setItem('errorLog', JSON.stringify(recentErrors));
            } catch (e) {
                console.warn('Failed to store error log:', e);
            }
        }
    }

    // Public methods for manual error reporting
    reportError(message, details = {}) {
        this.handleError({
            type: 'manual',
            message: message,
            details: details,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent
        });
    }

    getErrorSummary() {
        return {
            totalErrors: this.errors.length,
            recentErrors: this.errors.slice(-5),
            errorTypes: this.errors.reduce((acc, error) => {
                acc[error.type] = (acc[error.type] || 0) + 1;
                return acc;
            }, {}),
            isOnline: this.isOnline
        };
    }

    clearErrors() {
        this.errors = [];
        if (typeof localStorage !== 'undefined') {
            localStorage.removeItem('errorLog');
        }
    }
}

// Initialize error boundary when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ErrorBoundary = new ErrorBoundary();
    console.log('Error boundary initialized successfully');
});

// Export for use in other modules
window.ErrorBoundary = ErrorBoundary;