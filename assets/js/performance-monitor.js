/**
 * Gold Copy Trading - Automated Performance Monitoring
 * Real-time performance tracking, Core Web Vitals, and optimization insights
 */

class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigation: {},
            paint: {},
            vitals: {},
            resources: [],
            errors: [],
            customMetrics: {}
        };

        this.observers = [];
        this.isMonitoring = false;

        this.init();
    }

    init() {
        // Wait for page to be fully loaded
        if (document.readyState === 'complete') {
            this.startMonitoring();
        } else {
            window.addEventListener('load', () => {
                this.startMonitoring();
            });
        }

        // Monitor page visibility changes
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Monitor user interactions
        this.setupUserInteractionTracking();
    }

    startMonitoring() {
        if (this.isMonitoring) return;

        console.log('Starting performance monitoring...');
        this.isMonitoring = true;

        // Collect navigation timing
        this.collectNavigationMetrics();

        // Collect paint metrics
        this.collectPaintMetrics();

        // Monitor Core Web Vitals
        this.monitorCoreWebVitals();

        // Monitor resource loading
        this.monitorResourcePerformance();

        // Monitor long tasks
        this.monitorLongTasks();

        // Monitor memory usage
        this.monitorMemoryUsage();

        // Monitor network quality
        this.monitorNetworkQuality();

        // Set up real-time monitoring
        this.setupRealTimeMonitoring();

        // Initial report
        setTimeout(() => {
            this.generatePerformanceReport();
        }, 5000);
    }

    collectNavigationMetrics() {
        if (!window.performance || !window.performance.timing) return;

        const timing = window.performance.timing;
        const navigation = window.performance.navigation;

        this.metrics.navigation = {
            type: navigation.type,
            redirectCount: navigation.redirectCount,

            // DNS and Connection
            dns: timing.domainLookupEnd - timing.domainLookupStart,
            connection: timing.connectEnd - timing.connectStart,
            ssl: timing.connectEnd - timing.secureConnectionStart,

            // Request and Response
            request: timing.responseStart - timing.requestStart,
            response: timing.responseEnd - timing.responseStart,

            // DOM Processing
            domLoading: timing.domLoading - timing.navigationStart,
            domInteractive: timing.domInteractive - timing.navigationStart,
            domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
            domComplete: timing.domComplete - timing.navigationStart,

            // Page Load
            loadEvent: timing.loadEventEnd - timing.loadEventStart,
            totalPageLoad: timing.loadEventEnd - timing.navigationStart,

            // Time to First Byte
            ttfb: timing.responseStart - timing.navigationStart
        };

        this.trackMetric('navigation_complete', this.metrics.navigation.totalPageLoad);
    }

    collectPaintMetrics() {
        if (!window.performance || !window.performance.getEntriesByType) return;

        const paintEntries = window.performance.getEntriesByType('paint');

        paintEntries.forEach(entry => {
            this.metrics.paint[entry.name] = Math.round(entry.startTime);

            if (entry.name === 'first-paint') {
                this.trackMetric('first_paint', entry.startTime);
            }

            if (entry.name === 'first-contentful-paint') {
                this.trackMetric('first_contentful_paint', entry.startTime);
            }
        });
    }

    monitorCoreWebVitals() {
        // Largest Contentful Paint (LCP)
        this.observePerformance('largest-contentful-paint', (entries) => {
            const lastEntry = entries[entries.length - 1];
            this.metrics.vitals.lcp = Math.round(lastEntry.startTime);
            this.trackMetric('largest_contentful_paint', lastEntry.startTime);

            // LCP threshold analysis
            if (lastEntry.startTime <= 2500) {
                this.metrics.vitals.lcpRating = 'good';
            } else if (lastEntry.startTime <= 4000) {
                this.metrics.vitals.lcpRating = 'needs-improvement';
            } else {
                this.metrics.vitals.lcpRating = 'poor';
            }
        });

        // First Input Delay (FID)
        this.observePerformance('first-input', (entries) => {
            entries.forEach(entry => {
                this.metrics.vitals.fid = Math.round(entry.processingStart - entry.startTime);
                this.trackMetric('first_input_delay', entry.processingStart - entry.startTime);

                // FID threshold analysis
                if (entry.processingStart - entry.startTime <= 100) {
                    this.metrics.vitals.fidRating = 'good';
                } else if (entry.processingStart - entry.startTime <= 300) {
                    this.metrics.vitals.fidRating = 'needs-improvement';
                } else {
                    this.metrics.vitals.fidRating = 'poor';
                }
            });
        });

        // Cumulative Layout Shift (CLS)
        let clsValue = 0;
        this.observePerformance('layout-shift', (entries) => {
            entries.forEach(entry => {
                if (!entry.hadRecentInput) {
                    clsValue += entry.value;
                }
            });

            this.metrics.vitals.cls = Math.round(clsValue * 1000) / 1000;
            this.trackMetric('cumulative_layout_shift', clsValue);

            // CLS threshold analysis
            if (clsValue <= 0.1) {
                this.metrics.vitals.clsRating = 'good';
            } else if (clsValue <= 0.25) {
                this.metrics.vitals.clsRating = 'needs-improvement';
            } else {
                this.metrics.vitals.clsRating = 'poor';
            }
        });
    }

    monitorResourcePerformance() {
        if (!window.performance || !window.performance.getEntriesByType) return;

        const resourceEntries = window.performance.getEntriesByType('resource');

        resourceEntries.forEach(entry => {
            const resource = {
                name: entry.name,
                type: this.getResourceType(entry),
                size: entry.transferSize || entry.encodedBodySize || 0,
                duration: Math.round(entry.duration),
                startTime: Math.round(entry.startTime),
                dns: entry.domainLookupEnd - entry.domainLookupStart,
                connection: entry.connectEnd - entry.connectStart,
                request: entry.responseStart - entry.requestStart,
                response: entry.responseEnd - entry.responseStart,
                cached: entry.transferSize === 0 && entry.encodedBodySize > 0
            };

            this.metrics.resources.push(resource);

            // Track slow resources
            if (entry.duration > 1000) {
                this.trackMetric('slow_resource', entry.duration, {
                    resource_name: entry.name,
                    resource_type: this.getResourceType(entry)
                });
            }
        });

        // Analyze resource performance
        this.analyzeResourcePerformance();
    }

    monitorLongTasks() {
        this.observePerformance('longtask', (entries) => {
            entries.forEach(entry => {
                const longTask = {
                    duration: Math.round(entry.duration),
                    startTime: Math.round(entry.startTime),
                    attribution: entry.attribution || []
                };

                this.metrics.customMetrics.longTasks = this.metrics.customMetrics.longTasks || [];
                this.metrics.customMetrics.longTasks.push(longTask);

                this.trackMetric('long_task', entry.duration);

                console.warn(`Long task detected: ${entry.duration}ms at ${entry.startTime}ms`);
            });
        });
    }

    monitorMemoryUsage() {
        if (!window.performance || !window.performance.memory) return;

        const measureMemory = () => {
            const memory = window.performance.memory;
            const memoryMetrics = {
                used: Math.round(memory.usedJSHeapSize / 1048576), // MB
                total: Math.round(memory.totalJSHeapSize / 1048576), // MB
                limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
                timestamp: Date.now()
            };

            this.metrics.customMetrics.memory = this.metrics.customMetrics.memory || [];
            this.metrics.customMetrics.memory.push(memoryMetrics);

            // Keep only last 10 measurements
            if (this.metrics.customMetrics.memory.length > 10) {
                this.metrics.customMetrics.memory = this.metrics.customMetrics.memory.slice(-10);
            }

            // Alert on high memory usage
            if (memory.usedJSHeapSize / memory.jsHeapSizeLimit > 0.9) {
                this.trackMetric('high_memory_usage', memoryMetrics.used);
                console.warn(`High memory usage: ${memoryMetrics.used}MB`);
            }
        };

        // Initial measurement
        measureMemory();

        // Periodic measurements
        setInterval(measureMemory, 30000); // Every 30 seconds
    }

    monitorNetworkQuality() {
        if ('connection' in navigator) {
            const connection = navigator.connection;

            this.metrics.customMetrics.network = {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData
            };

            connection.addEventListener('change', () => {
                this.metrics.customMetrics.network = {
                    effectiveType: connection.effectiveType,
                    downlink: connection.downlink,
                    rtt: connection.rtt,
                    saveData: connection.saveData,
                    timestamp: Date.now()
                };

                this.trackMetric('network_change', 1, {
                    effective_type: connection.effectiveType,
                    downlink: connection.downlink
                });
            });
        }
    }

    setupRealTimeMonitoring() {
        // Monitor scroll performance
        let scrollStart = 0;
        document.addEventListener('scroll', () => {
            if (!scrollStart) {
                scrollStart = performance.now();
            }
        }, { passive: true });

        document.addEventListener('scrollend', () => {
            if (scrollStart) {
                const scrollDuration = performance.now() - scrollStart;
                this.trackMetric('scroll_duration', scrollDuration);
                scrollStart = 0;
            }
        }, { passive: true });

        // Monitor click responsiveness
        document.addEventListener('click', (event) => {
            const clickStart = performance.now();

            requestAnimationFrame(() => {
                const responseTime = performance.now() - clickStart;
                if (responseTime > 100) {
                    this.trackMetric('slow_click_response', responseTime);
                }
            });
        }, { passive: true });

        // Monitor page visibility and performance impact
        let visibilityStart = performance.now();
        document.addEventListener('visibilitychange', () => {
            const now = performance.now();
            if (document.hidden) {
                const activeTime = now - visibilityStart;
                this.trackMetric('page_active_time', activeTime);
            } else {
                visibilityStart = now;
            }
        });
    }

    setupUserInteractionTracking() {
        // Track important user interactions
        const trackInteraction = (type, element) => {
            this.trackMetric('user_interaction', 1, {
                interaction_type: type,
                element_type: element.tagName.toLowerCase(),
                element_id: element.id || 'no-id',
                element_class: element.className || 'no-class'
            });
        };

        // Track CTA button clicks
        document.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn') ||
                event.target.classList.contains('cta-button')) {
                trackInteraction('cta_click', event.target);
            }
        });

        // Track form interactions
        document.addEventListener('focusin', (event) => {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                trackInteraction('form_focus', event.target);
            }
        });

        // Track navigation clicks
        document.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                trackInteraction('link_click', event.target);
            }
        });
    }

    observePerformance(entryType, callback) {
        if (!window.PerformanceObserver) return;

        try {
            const observer = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                if (entries.length > 0) {
                    callback(entries);
                }
            });

            observer.observe({ entryTypes: [entryType] });
            this.observers.push(observer);
        } catch (error) {
            console.warn(`Performance observation not supported for ${entryType}:`, error);
        }
    }

    analyzeResourcePerformance() {
        const resources = this.metrics.resources;
        if (!resources.length) return;

        // Group by resource type
        const byType = resources.reduce((acc, resource) => {
            acc[resource.type] = acc[resource.type] || [];
            acc[resource.type].push(resource);
            return acc;
        }, {});

        // Calculate statistics for each type
        Object.keys(byType).forEach(type => {
            const typeResources = byType[type];
            const totalSize = typeResources.reduce((sum, r) => sum + r.size, 0);
            const avgDuration = typeResources.reduce((sum, r) => sum + r.duration, 0) / typeResources.length;

            this.metrics.customMetrics[`${type}Resources`] = {
                count: typeResources.length,
                totalSize: totalSize,
                averageDuration: Math.round(avgDuration),
                cached: typeResources.filter(r => r.cached).length
            };
        });
    }

    getResourceType(entry) {
        if (entry.initiatorType) {
            return entry.initiatorType;
        }

        const url = entry.name.toLowerCase();
        if (url.includes('.css')) return 'css';
        if (url.includes('.js')) return 'script';
        if (url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return 'img';
        if (url.match(/\.(woff|woff2|ttf|eot)$/)) return 'font';

        return 'other';
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.generatePerformanceReport();
        }
    }

    generatePerformanceReport() {
        const report = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            connection: this.metrics.customMetrics.network,
            metrics: this.metrics
        };

        this.sendPerformanceReport(report);
        console.log('Performance Report:', report);

        return report;
    }

    sendPerformanceReport(report) {
        // Send to analytics
        if (typeof gtag !== 'undefined') {
            // Send Core Web Vitals
            if (report.metrics.vitals.lcp) {
                gtag('event', 'core_web_vitals', {
                    event_category: 'Performance',
                    metric_name: 'LCP',
                    metric_value: report.metrics.vitals.lcp,
                    metric_rating: report.metrics.vitals.lcpRating
                });
            }

            if (report.metrics.vitals.fid) {
                gtag('event', 'core_web_vitals', {
                    event_category: 'Performance',
                    metric_name: 'FID',
                    metric_value: report.metrics.vitals.fid,
                    metric_rating: report.metrics.vitals.fidRating
                });
            }

            if (report.metrics.vitals.cls) {
                gtag('event', 'core_web_vitals', {
                    event_category: 'Performance',
                    metric_name: 'CLS',
                    metric_value: report.metrics.vitals.cls,
                    metric_rating: report.metrics.vitals.clsRating
                });
            }

            // Send page load metrics
            if (report.metrics.navigation.totalPageLoad) {
                gtag('event', 'page_load_performance', {
                    event_category: 'Performance',
                    metric_value: report.metrics.navigation.totalPageLoad,
                    ttfb: report.metrics.navigation.ttfb
                });
            }
        }

        // Store in localStorage for debugging
        try {
            const storedReports = JSON.parse(localStorage.getItem('performanceReports') || '[]');
            storedReports.push(report);

            // Keep only last 5 reports
            const recentReports = storedReports.slice(-5);
            localStorage.setItem('performanceReports', JSON.stringify(recentReports));
        } catch (error) {
            console.warn('Failed to store performance report:', error);
        }
    }

    trackMetric(name, value, customParams = {}) {
        if (typeof gtag !== 'undefined') {
            gtag('event', name, {
                event_category: 'Performance',
                value: Math.round(value),
                ...customParams
            });
        }
    }

    // Public methods
    getPerformanceScore() {
        const vitals = this.metrics.vitals;
        let score = 100;

        // LCP scoring (0-40 points)
        if (vitals.lcp > 4000) score -= 40;
        else if (vitals.lcp > 2500) score -= 20;

        // FID scoring (0-30 points)
        if (vitals.fid > 300) score -= 30;
        else if (vitals.fid > 100) score -= 15;

        // CLS scoring (0-30 points)
        if (vitals.cls > 0.25) score -= 30;
        else if (vitals.cls > 0.1) score -= 15;

        return Math.max(score, 0);
    }

    getOptimizationSuggestions() {
        const suggestions = [];
        const vitals = this.metrics.vitals;
        const navigation = this.metrics.navigation;

        if (vitals.lcp > 2500) {
            suggestions.push('Optimize Largest Contentful Paint by compressing images and reducing server response times');
        }

        if (vitals.fid > 100) {
            suggestions.push('Reduce First Input Delay by optimizing JavaScript execution and reducing main thread work');
        }

        if (vitals.cls > 0.1) {
            suggestions.push('Improve Cumulative Layout Shift by adding size attributes to images and avoiding dynamic content injection');
        }

        if (navigation.totalPageLoad > 3000) {
            suggestions.push('Improve overall page load time by optimizing resources and enabling caching');
        }

        return suggestions;
    }

    disconnect() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.isMonitoring = false;
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.PerformanceMonitor = new PerformanceMonitor();
});

// Export for use in other modules
window.PerformanceMonitor = PerformanceMonitor;