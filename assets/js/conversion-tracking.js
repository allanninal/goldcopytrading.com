/**
 * Gold Copy Trading - Advanced Conversion Tracking
 * Specialized conversion tracking for copy trading platform
 */

// Conversion Tracking Configuration
const ConversionConfig = {
    // Platform specific tracking
    platforms: {
        LITEFINANCE: 'litefinance.org',
        GOLDCOPYTRADING: 'goldcopytrading.com'
    },

    // Conversion values (USD)
    values: {
        COPY_TRADE_SIGNUP: 200,        // Minimum investment
        REPORT_ENGAGEMENT: 25,         // High-value content view
        FAQ_INTERACTION: 10,           // Support engagement
        EMAIL_SIGNUP: 50,              // Lead generation
        PHONE_INQUIRY: 100,            // High-intent contact
        PWA_INSTALL: 75                // App engagement
    },

    // Attribution windows (days)
    attribution: {
        CLICK: 7,                      // 7-day click attribution
        VIEW: 1                        // 1-day view attribution
    }
};

// Enhanced Conversion Tracker
class ConversionTracker {
    constructor() {
        this.conversions = new Map();
        this.attributionData = this.loadAttributionData();
        this.sessionStart = Date.now();

        this.init();
    }

    init() {
        this.setupConversionTracking();
        this.setupAttributionTracking();
        this.setupHeatmapTracking();
        this.setupABTestTracking();
    }

    /**
     * Setup comprehensive conversion tracking
     */
    setupConversionTracking() {
        // Enhanced copy trading button tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a, button');
            if (!target) return;

            // Copy trading platform links
            if (this.isCopyTradingLink(target)) {
                this.trackConversion('copy_trade_click', {
                    link_url: target.href,
                    button_text: target.textContent.trim(),
                    button_position: this.getElementPosition(target),
                    currency_pair: this.extractCurrencyPair(target),
                    page_section: this.getPageSection(target),
                    value: ConversionConfig.values.COPY_TRADE_SIGNUP,
                    conversion_probability: this.calculateConversionProbability(target)
                });

                // Track in attribution system
                this.recordAttribution('click', target.href);
            }

            // Report download/view tracking
            if (this.isReportLink(target)) {
                this.trackConversion('report_engagement', {
                    report_type: this.getReportType(target),
                    currency_pair: this.extractCurrencyPair(target),
                    value: ConversionConfig.values.REPORT_ENGAGEMENT,
                    engagement_depth: this.calculateEngagementDepth()
                });
            }

            // Contact form interactions
            if (this.isContactAction(target)) {
                this.trackConversion('contact_intent', {
                    contact_type: this.getContactType(target),
                    page_context: this.getPageContext(),
                    value: this.getContactValue(target)
                });
            }
        });

        // Form submission tracking with lead scoring
        document.addEventListener('submit', (e) => {
            const form = e.target;
            this.trackFormSubmission(form);
        });

        // Phone number click tracking
        document.addEventListener('click', (e) => {
            const target = e.target.closest('a[href^="tel:"], a[href^="mailto:"]');
            if (target) {
                this.trackContactConversion(target);
            }
        });
    }

    /**
     * Setup attribution tracking
     */
    setupAttributionTracking() {
        // Track referral sources
        const referrer = document.referrer;
        const utmParams = this.getUTMParameters();

        // Store attribution data
        const attribution = {
            referrer,
            utm_source: utmParams.utm_source,
            utm_medium: utmParams.utm_medium,
            utm_campaign: utmParams.utm_campaign,
            utm_term: utmParams.utm_term,
            utm_content: utmParams.utm_content,
            landing_page: window.location.href,
            timestamp: Date.now()
        };

        this.saveAttributionData(attribution);

        // Track first-touch and last-touch attribution
        this.trackAttribution(attribution);
    }

    /**
     * Setup heatmap and user behavior tracking
     */
    setupHeatmapTracking() {
        // Track click heatmap data
        document.addEventListener('click', (e) => {
            const heatmapData = {
                x: e.clientX,
                y: e.clientY,
                element: this.getElementPath(e.target),
                timestamp: Date.now(),
                viewport_width: window.innerWidth,
                viewport_height: window.innerHeight,
                scroll_position: window.pageYOffset
            };

            this.recordHeatmapData('click', heatmapData);
        });

        // Track scroll heatmap
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.recordHeatmapData('scroll', {
                    scroll_position: window.pageYOffset,
                    scroll_percentage: this.getScrollPercentage(),
                    timestamp: Date.now()
                });
            }, 100);
        });

        // Track mouse movement patterns (sampled)
        let mouseTimeout;
        document.addEventListener('mousemove', (e) => {
            clearTimeout(mouseTimeout);
            mouseTimeout = setTimeout(() => {
                this.recordHeatmapData('mouse', {
                    x: e.clientX,
                    y: e.clientY,
                    timestamp: Date.now()
                });
            }, 200);
        });
    }

    /**
     * Setup A/B test tracking
     */
    setupABTestTracking() {
        // Implement A/B test variants
        const tests = this.getActiveABTests();

        tests.forEach(test => {
            const variant = this.getTestVariant(test);
            this.trackABTestParticipation(test, variant);
            this.applyTestVariant(test, variant);
        });
    }

    /**
     * Track high-value conversions
     */
    trackConversion(conversionType, data = {}) {
        const conversionId = this.generateConversionId();
        const conversionData = {
            id: conversionId,
            type: conversionType,
            timestamp: Date.now(),
            session_id: this.getSessionId(),
            user_id: this.getUserId(),
            page_url: window.location.href,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            attribution: this.getAttributionData(),
            session_duration: Date.now() - this.sessionStart,
            page_views: this.getSessionPageViews(),
            previous_conversions: this.getPreviousConversions(),
            ...data
        };

        // Store conversion
        this.conversions.set(conversionId, conversionData);

        // Send to analytics platforms
        this.sendToAnalytics(conversionType, conversionData);

        // Send to conversion APIs
        this.sendToConversionAPI(conversionData);

        // Update conversion funnel
        this.updateConversionFunnel(conversionType, conversionData);

        console.log(`Conversion tracked: ${conversionType}`, conversionData);
    }

    /**
     * Track form submissions with lead scoring
     */
    trackFormSubmission(form) {
        const formData = new FormData(form);
        const leadScore = this.calculateLeadScore(formData);

        const conversionData = {
            form_id: form.id || 'contact_form',
            form_fields: this.getFormFields(formData),
            lead_score: leadScore,
            value: this.calculateFormValue(leadScore),
            submission_time: this.getFormCompletionTime(),
            form_interactions: this.getFormInteractionCount()
        };

        this.trackConversion('form_submission', conversionData);
    }

    /**
     * Track contact conversions (phone, email)
     */
    trackContactConversion(element) {
        const contactType = element.href.startsWith('tel:') ? 'phone' : 'email';
        const contactValue = contactType === 'phone'
            ? ConversionConfig.values.PHONE_INQUIRY
            : ConversionConfig.values.EMAIL_SIGNUP;

        this.trackConversion('contact_conversion', {
            contact_type: contactType,
            contact_value: element.href,
            value: contactValue,
            urgency_indicators: this.getUrgencyIndicators()
        });
    }

    /**
     * Send conversion data to analytics
     */
    sendToAnalytics(conversionType, data) {
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'conversion', {
                send_to: 'AW-XXXXXXXX/' + this.getGoogleAdsConversionLabel(conversionType),
                value: data.value || 1,
                currency: 'USD',
                transaction_id: data.id
            });

            // Enhanced ecommerce
            if (conversionType === 'copy_trade_click') {
                gtag('event', 'purchase', {
                    transaction_id: data.id,
                    value: data.value,
                    currency: 'USD',
                    items: [{
                        item_id: 'copy_trading_service',
                        item_name: data.currency_pair + ' Copy Trading',
                        category: 'Trading Services',
                        quantity: 1,
                        price: data.value
                    }]
                });
            }
        }

        // Facebook Pixel
        if (typeof fbq !== 'undefined') {
            fbq('track', this.getFacebookEventName(conversionType), {
                value: data.value,
                currency: 'USD',
                content_name: conversionType,
                content_category: 'copy_trading'
            });
        }

        // LinkedIn Insight Tag
        if (typeof lintrk !== 'undefined') {
            lintrk('track', { conversion_id: data.id });
        }
    }

    /**
     * Send to conversion API for server-side tracking
     */
    sendToConversionAPI(conversionData) {
        // Server-side conversion tracking
        fetch('/api/conversions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Conversion-Source': 'web'
            },
            body: JSON.stringify(conversionData)
        }).catch(error => {
            console.error('Conversion API error:', error);
        });
    }

    /**
     * Calculate lead score based on behavior
     */
    calculateLeadScore(formData) {
        let score = 0;

        // Base score for form submission
        score += 20;

        // Email domain scoring
        const email = formData.get('email') || '';
        if (email.includes('@gmail.com') || email.includes('@outlook.com')) {
            score += 5;
        } else if (email.includes('.edu') || email.includes('.gov')) {
            score += 15;
        } else if (!email.includes('@gmail.com') && !email.includes('@outlook.com')) {
            score += 10; // Business email
        }

        // Investment amount interest
        const investment = formData.get('investment_amount') || '';
        if (investment.includes('10000+')) score += 30;
        else if (investment.includes('5000')) score += 20;
        else if (investment.includes('1000')) score += 10;

        // Urgency indicators
        const message = (formData.get('message') || '').toLowerCase();
        if (message.includes('urgent') || message.includes('asap')) score += 15;
        if (message.includes('ready') || message.includes('start')) score += 10;

        // Behavioral scoring
        score += this.getEngagementScore();

        return Math.min(score, 100); // Cap at 100
    }

    /**
     * Calculate conversion probability
     */
    calculateConversionProbability(element) {
        let probability = 0.1; // Base 10%

        // Button position (above fold is higher)
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight) probability += 0.2;

        // Button visibility duration
        const visibilityTime = this.getElementVisibilityTime(element);
        probability += Math.min(visibilityTime / 10000, 0.3); // Max 30% for 10s+

        // Previous engagement
        probability += this.getEngagementScore() / 100 * 0.4;

        // Time on page
        const timeOnPage = Date.now() - this.sessionStart;
        if (timeOnPage > 60000) probability += 0.1; // 1 minute+
        if (timeOnPage > 300000) probability += 0.2; // 5 minutes+

        return Math.min(probability, 0.9); // Cap at 90%
    }

    // Utility Methods
    isCopyTradingLink(element) {
        return element.href && element.href.includes(ConversionConfig.platforms.LITEFINANCE);
    }

    isReportLink(element) {
        return element.href && (
            element.href.includes('/reports/') ||
            element.textContent.toLowerCase().includes('report') ||
            element.textContent.toLowerCase().includes('performance')
        );
    }

    isContactAction(element) {
        return element.href && (
            element.href.startsWith('mailto:') ||
            element.href.startsWith('tel:') ||
            element.closest('.contact-form') ||
            element.textContent.toLowerCase().includes('contact')
        );
    }

    getUTMParameters() {
        const params = new URLSearchParams(window.location.search);
        return {
            utm_source: params.get('utm_source'),
            utm_medium: params.get('utm_medium'),
            utm_campaign: params.get('utm_campaign'),
            utm_term: params.get('utm_term'),
            utm_content: params.get('utm_content')
        };
    }

    getElementPosition(element) {
        const rect = element.getBoundingClientRect();
        return {
            x: rect.left,
            y: rect.top,
            above_fold: rect.top < window.innerHeight
        };
    }

    getScrollPercentage() {
        const scrolled = window.pageYOffset;
        const maxScroll = document.body.scrollHeight - window.innerHeight;
        return Math.round((scrolled / maxScroll) * 100);
    }

    generateConversionId() {
        return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Attribution and analytics helper methods would continue here...
    // (Additional methods for completeness)

    extractCurrencyPair(element) {
        const text = element.textContent || element.getAttribute('data-pair') || '';
        const pairs = ['EURUSD', 'GBPUSD', 'USDCHF', 'AUDUSD'];
        return pairs.find(pair => text.toUpperCase().includes(pair)) || 'MULTI';
    }

    getPageSection(element) {
        const section = element.closest('section, .section');
        return section ? section.className || section.id || 'unknown' : 'main';
    }

    getEngagementScore() {
        // Simple engagement scoring based on time and interactions
        const timeScore = Math.min((Date.now() - this.sessionStart) / 60000 * 20, 40);
        const interactionScore = Math.min(this.conversions.size * 10, 30);
        const scrollScore = Math.min(this.getScrollPercentage() / 10, 30);
        return timeScore + interactionScore + scrollScore;
    }

    loadAttributionData() {
        const stored = localStorage.getItem('gct_attribution');
        return stored ? JSON.parse(stored) : {};
    }

    saveAttributionData(data) {
        localStorage.setItem('gct_attribution', JSON.stringify(data));
    }

    getSessionId() {
        let sessionId = sessionStorage.getItem('gct_session_id');
        if (!sessionId) {
            sessionId = 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('gct_session_id', sessionId);
        }
        return sessionId;
    }

    getUserId() {
        let userId = localStorage.getItem('gct_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('gct_user_id', userId);
        }
        return userId;
    }
}

// Initialize Conversion Tracker
const conversionTracker = new ConversionTracker();

// Global conversion tracking interface
window.GCTConversions = {
    track: (type, data) => conversionTracker.trackConversion(type, data),
    getConversions: () => Array.from(conversionTracker.conversions.values()),
    getEngagementScore: () => conversionTracker.getEngagementScore()
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ConversionTracker, ConversionConfig };
}