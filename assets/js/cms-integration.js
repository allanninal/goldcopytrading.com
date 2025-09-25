/**
 * Gold Copy Trading - Content Management System Integration
 * Headless CMS integration for dynamic content management
 */

// CMS Configuration
const CMSConfig = {
    // Content sources
    sources: {
        STRAPI: 'strapi',
        CONTENTFUL: 'contentful',
        SANITY: 'sanity',
        LOCAL_JSON: 'local'
    },

    // Content types
    contentTypes: {
        TRADING_REPORTS: 'trading-reports',
        PERFORMANCE_DATA: 'performance-data',
        FAQ_ITEMS: 'faq-items',
        TESTIMONIALS: 'testimonials',
        BLOG_POSTS: 'blog-posts',
        TRADING_PAIRS: 'trading-pairs'
    },

    // Cache settings
    cache: {
        duration: 5 * 60 * 1000, // 5 minutes
        maxSize: 100 // Max cached items
    },

    // API endpoints (configure based on chosen CMS)
    endpoints: {
        base_url: 'https://api.goldcopytrading.com',
        auth_token: null // Set via environment
    }
};

// Content Management System
class ContentManager {
    constructor() {
        this.cache = new Map();
        this.cacheTimestamps = new Map();
        this.contentSource = this.detectContentSource();
        this.initialized = false;

        this.init();
    }

    /**
     * Initialize CMS integration
     */
    async init() {
        try {
            // Load configuration
            await this.loadConfig();

            // Initialize content source
            await this.initializeContentSource();

            // Setup real-time updates
            this.setupRealTimeUpdates();

            // Prefetch critical content
            await this.prefetchCriticalContent();

            this.initialized = true;
            console.log('CMS integration initialized successfully');

        } catch (error) {
            console.error('CMS initialization failed:', error);
            this.fallbackToStaticContent();
        }
    }

    /**
     * Load CMS configuration
     */
    async loadConfig() {
        try {
            const response = await fetch('/cms-config.json');
            if (response.ok) {
                const config = await response.json();
                Object.assign(CMSConfig, config);
            }
        } catch (error) {
            console.warn('Could not load CMS config, using defaults');
        }
    }

    /**
     * Initialize content source
     */
    async initializeContentSource() {
        switch (this.contentSource) {
            case CMSConfig.sources.STRAPI:
                await this.initStrapi();
                break;
            case CMSConfig.sources.CONTENTFUL:
                await this.initContentful();
                break;
            case CMSConfig.sources.SANITY:
                await this.initSanity();
                break;
            default:
                await this.initLocalContent();
                break;
        }
    }

    /**
     * Initialize Strapi CMS
     */
    async initStrapi() {
        // Strapi-specific initialization
        this.apiClient = {
            baseURL: CMSConfig.endpoints.base_url,
            headers: {
                'Authorization': `Bearer ${CMSConfig.endpoints.auth_token}`,
                'Content-Type': 'application/json'
            }
        };
    }

    /**
     * Initialize Contentful CMS
     */
    async initContentful() {
        // Contentful-specific initialization
        if (typeof window.contentful !== 'undefined') {
            this.apiClient = window.contentful.createClient({
                space: CMSConfig.contentful?.space_id,
                accessToken: CMSConfig.contentful?.access_token
            });
        }
    }

    /**
     * Initialize Sanity CMS
     */
    async initSanity() {
        // Sanity-specific initialization
        this.apiClient = {
            projectId: CMSConfig.sanity?.project_id,
            dataset: CMSConfig.sanity?.dataset,
            baseURL: `https://${CMSConfig.sanity?.project_id}.api.sanity.io/v1/data/query/${CMSConfig.sanity?.dataset}`
        };
    }

    /**
     * Initialize local JSON content
     */
    async initLocalContent() {
        this.apiClient = {
            baseURL: '/content',
            method: 'local'
        };
    }

    /**
     * Get trading performance data
     */
    async getTradingPerformance() {
        const cacheKey = 'trading_performance';

        // Check cache first
        const cached = this.getCachedContent(cacheKey);
        if (cached) return cached;

        try {
            const data = await this.fetchContent(CMSConfig.contentTypes.PERFORMANCE_DATA);
            this.setCachedContent(cacheKey, data);
            return data;
        } catch (error) {
            console.error('Failed to fetch trading performance:', error);
            return this.getFallbackPerformanceData();
        }
    }

    /**
     * Get trading reports
     */
    async getTradingReports() {
        const cacheKey = 'trading_reports';

        const cached = this.getCachedContent(cacheKey);
        if (cached) return cached;

        try {
            const reports = await this.fetchContent(CMSConfig.contentTypes.TRADING_REPORTS);
            this.setCachedContent(cacheKey, reports);
            return reports;
        } catch (error) {
            console.error('Failed to fetch trading reports:', error);
            return this.getFallbackReports();
        }
    }

    /**
     * Get FAQ content
     */
    async getFAQItems() {
        const cacheKey = 'faq_items';

        const cached = this.getCachedContent(cacheKey);
        if (cached) return cached;

        try {
            const faqs = await this.fetchContent(CMSConfig.contentTypes.FAQ_ITEMS);
            this.setCachedContent(cacheKey, faqs);
            return faqs;
        } catch (error) {
            console.error('Failed to fetch FAQ items:', error);
            return this.getFallbackFAQs();
        }
    }

    /**
     * Get testimonials
     */
    async getTestimonials() {
        const cacheKey = 'testimonials';

        const cached = this.getCachedContent(cacheKey);
        if (cached) return cached;

        try {
            const testimonials = await this.fetchContent(CMSConfig.contentTypes.TESTIMONIALS);
            this.setCachedContent(cacheKey, testimonials);
            return testimonials;
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
            return this.getFallbackTestimonials();
        }
    }

    /**
     * Get currency pair data
     */
    async getTradingPairs() {
        const cacheKey = 'trading_pairs';

        const cached = this.getCachedContent(cacheKey);
        if (cached) return cached;

        try {
            const pairs = await this.fetchContent(CMSConfig.contentTypes.TRADING_PAIRS);
            this.setCachedContent(cacheKey, pairs);
            return pairs;
        } catch (error) {
            console.error('Failed to fetch trading pairs:', error);
            return this.getFallbackTradingPairs();
        }
    }

    /**
     * Fetch content from CMS
     */
    async fetchContent(contentType, filters = {}) {
        switch (this.contentSource) {
            case CMSConfig.sources.STRAPI:
                return await this.fetchFromStrapi(contentType, filters);
            case CMSConfig.sources.CONTENTFUL:
                return await this.fetchFromContentful(contentType, filters);
            case CMSConfig.sources.SANITY:
                return await this.fetchFromSanity(contentType, filters);
            default:
                return await this.fetchFromLocal(contentType);
        }
    }

    /**
     * Fetch from Strapi
     */
    async fetchFromStrapi(contentType, filters) {
        const params = new URLSearchParams();
        if (filters.populate) params.append('populate', filters.populate);
        if (filters.sort) params.append('sort', filters.sort);
        if (filters.limit) params.append('pagination[limit]', filters.limit);

        const url = `${this.apiClient.baseURL}/api/${contentType}?${params.toString()}`;

        const response = await fetch(url, {
            headers: this.apiClient.headers
        });

        if (!response.ok) {
            throw new Error(`Strapi fetch failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.data;
    }

    /**
     * Fetch from Contentful
     */
    async fetchFromContentful(contentType, filters) {
        if (!this.apiClient) {
            throw new Error('Contentful client not initialized');
        }

        const entries = await this.apiClient.getEntries({
            content_type: contentType,
            ...filters
        });

        return entries.items;
    }

    /**
     * Fetch from Sanity
     */
    async fetchFromSanity(contentType, filters) {
        const query = this.buildSanityQuery(contentType, filters);
        const url = `${this.apiClient.baseURL}?query=${encodeURIComponent(query)}`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Sanity fetch failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.result;
    }

    /**
     * Fetch from local JSON files
     */
    async fetchFromLocal(contentType) {
        const response = await fetch(`${this.apiClient.baseURL}/${contentType}.json`);
        if (!response.ok) {
            throw new Error(`Local content fetch failed: ${response.statusText}`);
        }

        return await response.json();
    }

    /**
     * Setup real-time content updates
     */
    setupRealTimeUpdates() {
        // WebSocket connection for real-time updates
        if ('WebSocket' in window && CMSConfig.realtime?.enabled) {
            try {
                this.websocket = new WebSocket(CMSConfig.realtime.websocket_url);

                this.websocket.onmessage = (event) => {
                    const update = JSON.parse(event.data);
                    this.handleContentUpdate(update);
                };

                this.websocket.onerror = (error) => {
                    console.error('WebSocket error:', error);
                };

            } catch (error) {
                console.warn('Real-time updates not available:', error);
            }
        }

        // Periodic content refresh
        setInterval(() => {
            this.refreshCriticalContent();
        }, CMSConfig.cache.duration);
    }

    /**
     * Handle real-time content updates
     */
    handleContentUpdate(update) {
        const { contentType, action, data } = update;

        // Invalidate cache for updated content type
        const cacheKeys = Array.from(this.cache.keys()).filter(key =>
            key.includes(contentType)
        );

        cacheKeys.forEach(key => {
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
        });

        // Trigger content refresh
        this.refreshContentType(contentType);

        // Dispatch custom event for components to listen
        window.dispatchEvent(new CustomEvent('contentUpdated', {
            detail: { contentType, action, data }
        }));
    }

    /**
     * Prefetch critical content
     */
    async prefetchCriticalContent() {
        const criticalContent = [
            CMSConfig.contentTypes.PERFORMANCE_DATA,
            CMSConfig.contentTypes.TRADING_PAIRS,
            CMSConfig.contentTypes.FAQ_ITEMS
        ];

        // Fetch critical content in parallel
        const promises = criticalContent.map(contentType =>
            this.fetchContent(contentType).catch(error => {
                console.warn(`Failed to prefetch ${contentType}:`, error);
                return null;
            })
        );

        await Promise.allSettled(promises);
    }

    /**
     * Update page content dynamically
     */
    async updatePageContent() {
        if (!this.initialized) return;

        try {
            // Update performance highlights
            await this.updatePerformanceHighlights();

            // Update trading reports
            await this.updateTradingReports();

            // Update FAQ section
            await this.updateFAQSection();

            // Update testimonials
            await this.updateTestimonials();

        } catch (error) {
            console.error('Failed to update page content:', error);
        }
    }

    /**
     * Update performance highlights
     */
    async updatePerformanceHighlights() {
        const performance = await this.getTradingPerformance();
        if (!performance) return;

        const highlightsContainer = document.querySelector('.performance-highlights');
        if (highlightsContainer && performance.highlights) {
            highlightsContainer.innerHTML = this.renderPerformanceHighlights(performance.highlights);
        }
    }

    /**
     * Update FAQ section
     */
    async updateFAQSection() {
        const faqs = await this.getFAQItems();
        if (!faqs) return;

        const faqContainer = document.querySelector('.faq-container');
        if (faqContainer) {
            faqContainer.innerHTML = this.renderFAQItems(faqs);
        }
    }

    // Cache management
    getCachedContent(key) {
        const timestamp = this.cacheTimestamps.get(key);
        if (!timestamp || Date.now() - timestamp > CMSConfig.cache.duration) {
            this.cache.delete(key);
            this.cacheTimestamps.delete(key);
            return null;
        }
        return this.cache.get(key);
    }

    setCachedContent(key, content) {
        // Implement cache size limit
        if (this.cache.size >= CMSConfig.cache.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
            this.cacheTimestamps.delete(oldestKey);
        }

        this.cache.set(key, content);
        this.cacheTimestamps.set(key, Date.now());
    }

    // Fallback content methods
    getFallbackPerformanceData() {
        return {
            total_return: "224.1%",
            total_profit: "$448.20",
            initial_investment: "$200",
            final_amount: "$648.20",
            duration: "6 months",
            trades: 568,
            losing_months: 0
        };
    }

    getFallbackReports() {
        return [
            { pair: 'EURUSD', return: '79.1%', profit: '$158.20' },
            { pair: 'GBPUSD', return: '57.6%', profit: '$115.20' },
            { pair: 'USDCHF', return: '49.2%', profit: '$98.40' },
            { pair: 'AUDUSD', return: '38.2%', profit: '$76.40' }
        ];
    }

    getFallbackFAQs() {
        return [
            {
                question: "What is the minimum investment?",
                answer: "The minimum investment is $200 USD to start copying our trading strategy."
            },
            {
                question: "How do I copy the trades?",
                answer: "Simply click on any 'Copy Trades' button to be redirected to our LiteFinance platform where you can start copying immediately."
            }
        ];
    }

    getFallbackTestimonials() {
        return [];
    }

    getFallbackTradingPairs() {
        return [
            { symbol: 'EURUSD', name: 'Euro / US Dollar' },
            { symbol: 'GBPUSD', name: 'British Pound / US Dollar' },
            { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc' },
            { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar' }
        ];
    }

    // Content rendering helpers
    renderPerformanceHighlights(highlights) {
        return highlights.map(highlight => `
            <div class="highlight-item" role="listitem">
                <div class="highlight-icon">${highlight.icon || '📈'}</div>
                <div class="highlight-content">
                    <h3>${highlight.title}</h3>
                    <p>${highlight.description}</p>
                </div>
            </div>
        `).join('');
    }

    renderFAQItems(faqs) {
        return faqs.map((faq, index) => `
            <div class="faq-item">
                <button class="faq-question"
                        onclick="toggleFAQ(this)"
                        aria-expanded="false"
                        aria-controls="faq-answer-${index}">
                    <span>${faq.question}</span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="faq-answer" id="faq-answer-${index}">
                    <p>${faq.answer}</p>
                </div>
            </div>
        `).join('');
    }

    // Utility methods
    detectContentSource() {
        // Auto-detect content source based on configuration or environment
        if (CMSConfig.endpoints.base_url && CMSConfig.endpoints.base_url.includes('strapi')) {
            return CMSConfig.sources.STRAPI;
        }
        if (CMSConfig.contentful?.space_id) {
            return CMSConfig.sources.CONTENTFUL;
        }
        if (CMSConfig.sanity?.project_id) {
            return CMSConfig.sources.SANITY;
        }
        return CMSConfig.sources.LOCAL_JSON;
    }

    buildSanityQuery(contentType, filters) {
        let query = `*[_type == "${contentType}"]`;

        if (filters.limit) {
            query += `[0...${filters.limit}]`;
        }

        if (filters.sort) {
            query += ` | order(${filters.sort})`;
        }

        return query;
    }

    fallbackToStaticContent() {
        console.warn('CMS unavailable, using static fallback content');
        this.contentSource = 'static';
        this.initialized = true;
    }

    async refreshContentType(contentType) {
        // Refresh specific content type
        try {
            await this.fetchContent(contentType);
        } catch (error) {
            console.error(`Failed to refresh ${contentType}:`, error);
        }
    }

    async refreshCriticalContent() {
        // Refresh critical content periodically
        await this.prefetchCriticalContent();
    }
}

// Initialize Content Manager
const contentManager = new ContentManager();

// Global CMS interface
window.GCTCMS = {
    getContent: (type, filters) => contentManager.fetchContent(type, filters),
    updateContent: () => contentManager.updatePageContent(),
    refreshCache: () => {
        contentManager.cache.clear();
        contentManager.cacheTimestamps.clear();
    }
};

// Auto-update content when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (contentManager.initialized) {
        contentManager.updatePageContent();
    } else {
        // Wait for initialization
        const checkInit = setInterval(() => {
            if (contentManager.initialized) {
                contentManager.updatePageContent();
                clearInterval(checkInit);
            }
        }, 100);
    }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ContentManager, CMSConfig };
}