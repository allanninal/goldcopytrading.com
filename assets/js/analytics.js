/**
 * Gold Copy Trading - Advanced Analytics & Conversion Tracking
 * Comprehensive tracking system for user behavior and conversions
 */

// Analytics Configuration
const AnalyticsConfig = {
    // Google Analytics 4 Configuration
    GA4_MEASUREMENT_ID: 'G-XXXXXXXXXX', // Replace with actual GA4 ID

    // Conversion Goals
    conversions: {
        COPY_TRADE_CLICK: 'copy_trade_click',
        FORM_SUBMISSION: 'form_submission',
        REPORT_VIEW: 'report_view',
        FAQ_INTERACTION: 'faq_interaction',
        EXTERNAL_LINK_CLICK: 'external_link_click',
        PWA_INSTALL: 'pwa_install',
        CHART_INTERACTION: 'chart_interaction'
    },

    // Enhanced Ecommerce Events
    ecommerce: {
        VIEW_PROMOTION: 'view_promotion',
        SELECT_PROMOTION: 'select_promotion',
        PURCHASE: 'purchase',
        REFUND: 'refund'
    }
};

// Analytics Manager Class
class AnalyticsManager {
    constructor() {
        this.initialized = false;
        this.sessionId = this.generateSessionId();
        this.userId = this.getUserId();
        this.conversionGoals = new Map();

        this.init();
    }

    /**
     * Initialize analytics system
     */
    init() {
        if (this.initialized) return;

        try {
            // Initialize Google Analytics 4
            this.initializeGA4();

            // Initialize enhanced event tracking
            this.setupEventTracking();

            // Initialize conversion funnel tracking
            this.setupConversionTracking();

            // Initialize performance tracking
            this.setupPerformanceTracking();

            // Initialize user journey tracking
            this.setupUserJourneyTracking();

            this.initialized = true;
            this.trackEvent('analytics_initialized', { success: true });

        } catch (error) {
            console.error('Analytics initialization failed:', error);
            this.trackError('analytics_init_error', error);
        }
    }

    /**
     * Initialize Google Analytics 4
     */
    initializeGA4() {
        // Configure GA4 with enhanced settings
        if (typeof gtag !== 'undefined') {
            gtag('config', AnalyticsConfig.GA4_MEASUREMENT_ID, {
                // Enhanced measurement
                enhanced_measurement: true,

                // User engagement
                engagement_time_msec: 10000,

                // Custom parameters
                custom_map: {
                    'currency_pair': 'dimension1',
                    'trading_performance': 'dimension2',
                    'user_segment': 'dimension3',
                    'page_category': 'dimension4'
                },

                // Demographics and interests
                allow_google_signals: true,

                // Debug mode (disable in production)
                debug_mode: window.location.hostname === 'localhost'
            });

            // Set user properties
            gtag('set', {
                user_id: this.userId,
                session_id: this.sessionId,
                user_properties: {
                    user_segment: this.getUserSegment(),
                    visit_count: this.getVisitCount(),
                    last_visit: this.getLastVisit()
                }
            });
        }
    }

    /**
     * Setup comprehensive event tracking
     */
    setupEventTracking() {
        // Track copy trading button clicks
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;

            // Copy trading links
            if (target.href && target.href.includes('litefinance.org')) {
                this.trackConversion(AnalyticsConfig.conversions.COPY_TRADE_CLICK, {
                    link_url: target.href,
                    button_text: target.textContent.trim(),
                    page_location: window.location.href,
                    currency_pair: this.extractCurrencyPair(target),
                    value: 200 // Minimum investment amount
                });
            }

            // External links
            if (target.href && !target.href.includes(window.location.hostname)) {
                this.trackEvent(AnalyticsConfig.conversions.EXTERNAL_LINK_CLICK, {
                    link_url: target.href,
                    link_text: target.textContent.trim()
                });
            }

            // FAQ interactions
            if (target.closest('.faq-item') || target.getAttribute('data-action') === 'toggle-faq') {
                this.trackEvent(AnalyticsConfig.conversions.FAQ_INTERACTION, {
                    question: target.textContent.trim(),
                    action: 'expand'
                });
            }

            // Chart interactions
            if (target.closest('.chart-container') || target.closest('canvas')) {
                this.trackEvent(AnalyticsConfig.conversions.CHART_INTERACTION, {
                    chart_type: 'performance_chart',
                    interaction_type: 'click'
                });
            }
        });

        // Track form submissions
        document.addEventListener('submit', (e) => {
            const form = e.target;
            if (form.tagName.toLowerCase() === 'form') {
                this.trackConversion(AnalyticsConfig.conversions.FORM_SUBMISSION, {
                    form_id: form.id || 'unknown',
                    form_name: form.name || 'contact_form',
                    form_location: window.location.href
                });
            }
        });

        // Track scroll depth
        this.setupScrollTracking();

        // Track time on page
        this.setupTimeTracking();
    }

    /**
     * Setup conversion funnel tracking
     */
    setupConversionTracking() {
        // Define conversion funnel steps
        const funnelSteps = [
            { name: 'page_view', trigger: 'immediate' },
            { name: 'performance_view', selector: '.performance-highlights' },
            { name: 'report_view', selector: '.report-container' },
            { name: 'cta_view', selector: '.cta-buttons' },
            { name: 'copy_trade_intent', selector: 'a[href*="litefinance"]' }
        ];

        // Track funnel progression
        this.trackFunnelStep('page_view');

        // Use Intersection Observer for funnel steps
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const step = funnelSteps.find(s =>
                        entry.target.matches(s.selector)
                    );
                    if (step) {
                        this.trackFunnelStep(step.name);
                    }
                }
            });
        }, { threshold: 0.5 });

        // Observe funnel elements
        funnelSteps.forEach(step => {
            if (step.selector) {
                const elements = document.querySelectorAll(step.selector);
                elements.forEach(el => observer.observe(el));
            }
        });
    }

    /**
     * Setup performance tracking
     */
    setupPerformanceTracking() {
        // Track Core Web Vitals
        if ('web-vital' in window) {
            import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
                getCLS(this.sendWebVital.bind(this));
                getFID(this.sendWebVital.bind(this));
                getFCP(this.sendWebVital.bind(this));
                getLCP(this.sendWebVital.bind(this));
                getTTFB(this.sendWebVital.bind(this));
            });
        }

        // Track custom performance metrics
        if (window.performance && window.performance.mark) {
            // Track when critical elements load
            const criticalElements = ['.hero-section', '.performance-highlights', '.cta-buttons'];

            criticalElements.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    const observer = new IntersectionObserver((entries) => {
                        entries.forEach(entry => {
                            if (entry.isIntersecting) {
                                performance.mark(`${selector}_visible`);
                                this.trackEvent('element_visible', {
                                    element: selector,
                                    timestamp: performance.now()
                                });
                                observer.unobserve(entry.target);
                            }
                        });
                    });
                    observer.observe(element);
                }
            });
        }
    }

    /**
     * Setup user journey tracking
     */
    setupUserJourneyTracking() {
        // Track page category
        const pageCategory = this.getPageCategory();

        // Set custom dimensions
        if (typeof gtag !== 'undefined') {
            gtag('set', {
                page_category: pageCategory,
                currency_pair: this.getCurrentCurrencyPair(),
                trading_performance: this.getCurrentPerformance()
            });
        }

        // Track user segment
        const userSegment = this.getUserSegment();
        this.trackEvent('user_segment_identified', {
            segment: userSegment,
            page_category: pageCategory
        });

        // Track session duration milestones
        this.setupSessionMilestones();
    }

    /**
     * Track conversion events with enhanced data
     */
    trackConversion(conversionType, data = {}) {
        const conversionData = {
            event_category: 'conversion',
            event_label: conversionType,
            value: data.value || 1,
            currency: 'USD',
            ...data,
            session_id: this.sessionId,
            user_id: this.userId,
            timestamp: new Date().toISOString()
        };

        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', conversionType, conversionData);
        }

        // Enhanced Ecommerce for copy trading clicks
        if (conversionType === AnalyticsConfig.conversions.COPY_TRADE_CLICK) {
            this.trackPurchaseIntent(data);
        }

        // Store conversion for funnel analysis
        this.conversionGoals.set(conversionType, {
            ...conversionData,
            completed_at: Date.now()
        });

        console.log(`Conversion tracked: ${conversionType}`, conversionData);
    }

    /**
     * Track purchase intent for enhanced ecommerce
     */
    trackPurchaseIntent(data) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: 200,
                items: [{
                    item_id: 'copy_trading_service',
                    item_name: `${data.currency_pair || 'Multi-Pair'} Copy Trading`,
                    category: 'Trading Services',
                    quantity: 1,
                    price: 200
                }]
            });
        }
    }

    /**
     * Track funnel progression
     */
    trackFunnelStep(stepName) {
        const funnelData = {
            funnel_step: stepName,
            session_id: this.sessionId,
            page_location: window.location.href,
            timestamp: Date.now()
        };

        this.trackEvent('funnel_step', funnelData);
    }

    /**
     * Track custom events
     */
    trackEvent(eventName, data = {}) {
        const eventData = {
            event_category: 'engagement',
            session_id: this.sessionId,
            user_id: this.userId,
            ...data
        };

        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, eventData);
        }
    }

    /**
     * Track errors and exceptions
     */
    trackError(errorType, error) {
        const errorData = {
            event_category: 'error',
            event_label: errorType,
            description: error.message || error.toString(),
            fatal: false,
            session_id: this.sessionId
        };

        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', errorData);
        }
    }

    /**
     * Send Web Vitals to analytics
     */
    sendWebVital({ name, delta, id }) {
        if (typeof gtag !== 'undefined') {
            gtag('event', name, {
                event_category: 'Web Vitals',
                event_label: id,
                value: Math.round(name === 'CLS' ? delta * 1000 : delta),
                non_interaction: true
            });
        }
    }

    /**
     * Setup scroll depth tracking
     */
    setupScrollTracking() {
        let maxScroll = 0;
        const milestones = [25, 50, 75, 90, 100];
        const tracked = new Set();

        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            );

            maxScroll = Math.max(maxScroll, scrollPercent);

            milestones.forEach(milestone => {
                if (scrollPercent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    this.trackEvent('scroll_depth', {
                        scroll_depth: milestone,
                        max_scroll: maxScroll
                    });
                }
            });
        };

        window.addEventListener('scroll', throttle(trackScroll, 500));
    }

    /**
     * Setup time tracking
     */
    setupTimeTracking() {
        const startTime = Date.now();
        const milestones = [10, 30, 60, 120, 300]; // seconds
        const tracked = new Set();

        const checkTimeSpent = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);

            milestones.forEach(milestone => {
                if (timeSpent >= milestone && !tracked.has(milestone)) {
                    tracked.add(milestone);
                    this.trackEvent('time_on_page', {
                        time_spent: milestone,
                        page_category: this.getPageCategory()
                    });
                }
            });
        };

        setInterval(checkTimeSpent, 5000);

        // Track when user leaves
        window.addEventListener('beforeunload', () => {
            const totalTime = Math.round((Date.now() - startTime) / 1000);
            this.trackEvent('session_end', {
                session_duration: totalTime,
                max_scroll: maxScroll,
                conversions_completed: this.conversionGoals.size
            });
        });
    }

    /**
     * Setup session milestone tracking
     */
    setupSessionMilestones() {
        const milestones = [
            { time: 30000, name: 'engaged_user' },      // 30 seconds
            { time: 60000, name: 'interested_user' },   // 1 minute
            { time: 180000, name: 'highly_engaged' }    // 3 minutes
        ];

        milestones.forEach(milestone => {
            setTimeout(() => {
                this.trackEvent(milestone.name, {
                    engagement_level: milestone.name,
                    session_quality: 'high'
                });
            }, milestone.time);
        });
    }

    // Utility Methods
    generateSessionId() {
        return 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getUserId() {
        let userId = localStorage.getItem('gct_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gct_user_id', userId);
        }
        return userId;
    }

    getUserSegment() {
        // Determine user segment based on behavior
        const visitCount = this.getVisitCount();
        const hasInteracted = this.conversionGoals.size > 0;

        if (visitCount === 1) return 'new_visitor';
        if (visitCount <= 3) return 'returning_visitor';
        if (hasInteracted) return 'engaged_visitor';
        return 'loyal_visitor';
    }

    getVisitCount() {
        const count = localStorage.getItem('gct_visit_count') || '0';
        const newCount = parseInt(count) + 1;
        localStorage.setItem('gct_visit_count', newCount.toString());
        return newCount;
    }

    getLastVisit() {
        return localStorage.getItem('gct_last_visit') || 'first_visit';
    }

    getPageCategory() {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index.html')) return 'homepage';
        if (path.includes('/reports/')) return 'trading_report';
        return 'other';
    }

    getCurrentCurrencyPair() {
        const path = window.location.pathname;
        const match = path.match(/reports\/([a-z]{6})\.html/);
        return match ? match[1].toUpperCase() : null;
    }

    getCurrentPerformance() {
        // Extract performance data from page content
        const performanceElement = document.querySelector('.stat-value');
        return performanceElement ? performanceElement.textContent.trim() : null;
    }

    extractCurrencyPair(element) {
        const text = element.textContent || element.getAttribute('data-pair') || '';
        const pairs = ['EURUSD', 'GBPUSD', 'USDCHF', 'AUDUSD'];
        return pairs.find(pair => text.toUpperCase().includes(pair)) || 'MULTI';
    }
}

// Utility function for throttling
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Analytics Manager
const analytics = new AnalyticsManager();

// Global analytics interface
window.GCTAnalytics = {
    track: (event, data) => analytics.trackEvent(event, data),
    trackConversion: (type, data) => analytics.trackConversion(type, data),
    trackError: (type, error) => analytics.trackError(type, error)
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AnalyticsManager, AnalyticsConfig };
}