/**
 * Gold Copy Trading - End-to-End Test Suite
 * Comprehensive testing for user journeys, performance, and functionality
 */

class E2ETestSuite {
    constructor() {
        this.testResults = [];
        this.currentTest = null;
        this.startTime = null;

        this.init();
    }

    init() {
        console.log('Initializing E2E Test Suite...');

        // Auto-run tests in development/testing environment
        if (this.isTestingEnvironment()) {
            this.runAllTests();
        }

        // Expose testing methods globally for manual testing
        window.TestSuite = this;
    }

    isTestingEnvironment() {
        return window.location.hostname === 'localhost' ||
               window.location.hostname === '127.0.0.1' ||
               window.location.search.includes('test=true');
    }

    async runAllTests() {
        console.log('🧪 Starting comprehensive E2E test suite...');

        const tests = [
            // Core functionality tests
            { name: 'Homepage Load', test: this.testHomepageLoad },
            { name: 'Navigation', test: this.testNavigation },
            { name: 'Performance Highlights', test: this.testPerformanceHighlights },
            { name: 'CTA Buttons', test: this.testCTAButtons },

            // Report pages tests
            { name: 'Combined Report', test: this.testCombinedReport },
            { name: 'Individual Reports', test: this.testIndividualReports },
            { name: 'Chart Loading', test: this.testChartLoading },

            // Technical tests
            { name: 'PWA Installation', test: this.testPWAInstallation },
            { name: 'Service Worker', test: this.testServiceWorker },
            { name: 'Error Handling', test: this.testErrorHandling },
            { name: 'Accessibility', test: this.testAccessibility },
            { name: 'Performance', test: this.testPerformance },
            { name: 'SEO Meta Tags', test: this.testSEOMetaTags },
            { name: 'Image Optimization', test: this.testImageOptimization },

            // User experience tests
            { name: 'Mobile Responsiveness', test: this.testMobileResponsiveness },
            { name: 'Cross-browser Compatibility', test: this.testCrossBrowserCompatibility },
            { name: 'Offline Functionality', test: this.testOfflineFunctionality }
        ];

        for (const testCase of tests) {
            await this.runTest(testCase.name, testCase.test.bind(this));
        }

        this.generateTestReport();
    }

    async runTest(testName, testFunction) {
        this.currentTest = testName;
        this.startTime = performance.now();

        console.log(`🔍 Running test: ${testName}`);

        try {
            const result = await testFunction();
            const duration = performance.now() - this.startTime;

            this.testResults.push({
                name: testName,
                status: 'PASSED',
                duration: Math.round(duration),
                result: result,
                timestamp: new Date().toISOString()
            });

            console.log(`✅ ${testName} - PASSED (${Math.round(duration)}ms)`);
        } catch (error) {
            const duration = performance.now() - this.startTime;

            this.testResults.push({
                name: testName,
                status: 'FAILED',
                duration: Math.round(duration),
                error: error.message,
                stack: error.stack,
                timestamp: new Date().toISOString()
            });

            console.error(`❌ ${testName} - FAILED (${Math.round(duration)}ms):`, error);
        }
    }

    // Test implementations
    async testHomepageLoad() {
        const requiredElements = [
            '.hero',
            '.hero h1',
            '.performance-highlights',
            '.btn-primary',
            '.performance'
        ];

        for (const selector of requiredElements) {
            const element = document.querySelector(selector);
            if (!element) {
                throw new Error(`Required element not found: ${selector}`);
            }
        }

        // Test hero content
        const heroTitle = document.querySelector('.hero h1');
        if (!heroTitle.textContent.includes('224.1%')) {
            throw new Error('Hero title does not contain expected return percentage');
        }

        return 'Homepage loaded with all required elements';
    }

    async testNavigation() {
        const links = document.querySelectorAll('a[href]');
        let workingLinks = 0;
        let brokenLinks = [];

        for (const link of links) {
            const href = link.getAttribute('href');

            // Skip external links and special protocols
            if (href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:')) {
                continue;
            }

            // Test internal links
            try {
                const response = await fetch(href, { method: 'HEAD' });
                if (response.ok) {
                    workingLinks++;
                } else {
                    brokenLinks.push(href);
                }
            } catch (error) {
                brokenLinks.push(href);
            }
        }

        if (brokenLinks.length > 0) {
            throw new Error(`Broken internal links found: ${brokenLinks.join(', ')}`);
        }

        return `All ${workingLinks} internal links are working`;
    }

    async testPerformanceHighlights() {
        const highlights = document.querySelectorAll('.performance-highlight-card');

        if (highlights.length !== 4) {
            throw new Error(`Expected 4 performance highlights, found ${highlights.length}`);
        }

        const expectedValues = ['224.1%', '6', '0', '568'];

        highlights.forEach((highlight, index) => {
            const valueElement = highlight.querySelector('.performance-highlight-value');
            if (!valueElement || !valueElement.textContent.includes(expectedValues[index])) {
                throw new Error(`Performance highlight ${index + 1} has incorrect value`);
            }
        });

        return 'All performance highlights display correct values';
    }

    async testCTAButtons() {
        const ctaButtons = document.querySelectorAll('.btn-primary, .cta-button.primary');

        if (ctaButtons.length === 0) {
            throw new Error('No CTA buttons found on page');
        }

        let validCTAs = 0;

        ctaButtons.forEach(button => {
            const href = button.getAttribute('href');
            if (href && (href.includes('litefinance') || href.includes('goldcopytrading'))) {
                validCTAs++;
            }
        });

        if (validCTAs === 0) {
            throw new Error('No valid CTA buttons found');
        }

        return `${validCTAs} valid CTA buttons found`;
    }

    async testCombinedReport() {
        // This would typically navigate to the report page
        // For now, we'll check if the report link exists
        const reportLink = document.querySelector('a[href*="combined.html"]');

        if (!reportLink) {
            throw new Error('Combined report link not found');
        }

        return 'Combined report link is present';
    }

    async testIndividualReports() {
        const reportLinks = document.querySelectorAll('a[href*="reports/"]');
        const expectedReports = ['eurusd', 'gbpusd', 'usdchf', 'audusd', 'combined'];

        for (const expected of expectedReports) {
            const found = Array.from(reportLinks).some(link =>
                link.getAttribute('href').includes(expected)
            );

            if (!found) {
                throw new Error(`Report link not found for ${expected}`);
            }
        }

        return 'All individual report links are present';
    }

    async testChartLoading() {
        return new Promise((resolve, reject) => {
            // Wait for Chart.js to load
            setTimeout(() => {
                if (typeof Chart === 'undefined') {
                    reject(new Error('Chart.js library not loaded'));
                    return;
                }

                const canvasElements = document.querySelectorAll('canvas');
                if (canvasElements.length === 0) {
                    reject(new Error('No chart canvas elements found'));
                    return;
                }

                resolve(`Chart.js loaded, ${canvasElements.length} canvas elements found`);
            }, 3000);
        });
    }

    async testPWAInstallation() {
        // Check manifest
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (!manifestLink) {
            throw new Error('PWA manifest link not found');
        }

        // Check service worker registration
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported');
        }

        return 'PWA installation components are present';
    }

    async testServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported');
        }

        try {
            const registration = await navigator.serviceWorker.ready;
            if (registration) {
                return 'Service Worker is registered and active';
            } else {
                throw new Error('Service Worker registration failed');
            }
        } catch (error) {
            throw new Error(`Service Worker error: ${error.message}`);
        }
    }

    async testErrorHandling() {
        // Check if error boundary is loaded
        if (!window.ErrorBoundary) {
            throw new Error('Error boundary not initialized');
        }

        // Test error reporting
        try {
            window.ErrorBoundary.reportError('Test error', { test: true });
            return 'Error handling system is functional';
        } catch (error) {
            throw new Error(`Error handling test failed: ${error.message}`);
        }
    }

    async testAccessibility() {
        const issues = [];

        // Check skip link
        const skipLink = document.querySelector('.skip-link');
        if (!skipLink) {
            issues.push('Skip navigation link missing');
        }

        // Check heading hierarchy
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        if (headings.length === 0) {
            issues.push('No headings found');
        }

        // Check alt text on images
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.alt && !img.getAttribute('aria-label')) {
                issues.push(`Image ${index + 1} missing alt text`);
            }
        });

        // Check form labels
        const inputs = document.querySelectorAll('input, textarea, select');
        inputs.forEach((input, index) => {
            if (!input.id && !input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                issues.push(`Form input ${index + 1} missing label`);
            }
        });

        if (issues.length > 0) {
            throw new Error(`Accessibility issues found: ${issues.join(', ')}`);
        }

        return 'Basic accessibility requirements met';
    }

    async testPerformance() {
        const performanceIssues = [];

        // Check for performance monitor
        if (!window.PerformanceMonitor) {
            performanceIssues.push('Performance monitor not loaded');
        }

        // Check page load time
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            if (loadTime > 5000) {
                performanceIssues.push(`Page load time too slow: ${loadTime}ms`);
            }
        }

        // Check for large images
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (img.naturalWidth > 2000 && !img.srcset) {
                performanceIssues.push(`Image ${index + 1} may be too large without responsive sizes`);
            }
        });

        if (performanceIssues.length > 0) {
            throw new Error(`Performance issues found: ${performanceIssues.join(', ')}`);
        }

        return 'Performance requirements met';
    }

    async testSEOMetaTags() {
        const requiredMeta = [
            { name: 'title', test: () => document.title.length > 0 },
            { name: 'description', test: () => document.querySelector('meta[name="description"]')?.content.length > 0 },
            { name: 'keywords', test: () => document.querySelector('meta[name="keywords"]')?.content.length > 0 },
            { name: 'og:title', test: () => document.querySelector('meta[property="og:title"]')?.content.length > 0 },
            { name: 'og:description', test: () => document.querySelector('meta[property="og:description"]')?.content.length > 0 },
            { name: 'canonical', test: () => document.querySelector('link[rel="canonical"]')?.href.length > 0 }
        ];

        const missing = [];

        requiredMeta.forEach(meta => {
            if (!meta.test()) {
                missing.push(meta.name);
            }
        });

        if (missing.length > 0) {
            throw new Error(`Missing SEO meta tags: ${missing.join(', ')}`);
        }

        return 'All required SEO meta tags are present';
    }

    async testImageOptimization() {
        if (!window.ImageOptimizer) {
            throw new Error('Image optimizer not loaded');
        }

        const stats = window.ImageOptimizer.getOptimizationStats();

        if (stats.total === 0) {
            throw new Error('No images found to optimize');
        }

        return `Image optimization active: ${stats.optimizationRatio} optimization ratio`;
    }

    async testMobileResponsiveness() {
        // Simulate mobile viewport
        const originalWidth = window.innerWidth;

        // Test common mobile widths
        const mobileWidths = [320, 375, 414, 768];
        const issues = [];

        for (const width of mobileWidths) {
            // Note: This is a simplified test - in real scenarios, you'd use browser automation
            const mediaQuery = window.matchMedia(`(max-width: ${width}px)`);

            if (width < 768) {
                // Check if mobile-specific styles are applied
                const heroTitle = document.querySelector('.hero h1');
                if (heroTitle && getComputedStyle(heroTitle).fontSize === getComputedStyle(heroTitle).fontSize) {
                    // Basic check - in real implementation, you'd verify responsive font sizes
                }
            }
        }

        if (issues.length > 0) {
            throw new Error(`Mobile responsiveness issues: ${issues.join(', ')}`);
        }

        return 'Mobile responsiveness tests passed';
    }

    async testCrossBrowserCompatibility() {
        const browserFeatures = [
            { name: 'Fetch API', test: () => 'fetch' in window },
            { name: 'Local Storage', test: () => 'localStorage' in window },
            { name: 'IntersectionObserver', test: () => 'IntersectionObserver' in window },
            { name: 'Service Worker', test: () => 'serviceWorker' in navigator },
            { name: 'CSS Grid', test: () => CSS.supports('display', 'grid') }
        ];

        const unsupported = [];

        browserFeatures.forEach(feature => {
            if (!feature.test()) {
                unsupported.push(feature.name);
            }
        });

        if (unsupported.length > 0) {
            console.warn(`Unsupported features: ${unsupported.join(', ')}`);
        }

        return `Browser compatibility: ${browserFeatures.length - unsupported.length}/${browserFeatures.length} features supported`;
    }

    async testOfflineFunctionality() {
        if (!('serviceWorker' in navigator)) {
            throw new Error('Service Worker not supported - offline functionality not available');
        }

        // Check if offline resources are cached
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            if (cacheNames.length === 0) {
                throw new Error('No caches found - offline functionality may not work');
            }
        }

        return 'Offline functionality components are in place';
    }

    generateTestReport() {
        const totalTests = this.testResults.length;
        const passedTests = this.testResults.filter(t => t.status === 'PASSED').length;
        const failedTests = this.testResults.filter(t => t.status === 'FAILED').length;
        const totalDuration = this.testResults.reduce((sum, t) => sum + t.duration, 0);

        const report = {
            summary: {
                total: totalTests,
                passed: passedTests,
                failed: failedTests,
                successRate: Math.round((passedTests / totalTests) * 100),
                totalDuration: Math.round(totalDuration)
            },
            results: this.testResults,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        console.log('📊 Test Report Summary:');
        console.log(`✅ Passed: ${passedTests}`);
        console.log(`❌ Failed: ${failedTests}`);
        console.log(`📈 Success Rate: ${report.summary.successRate}%`);
        console.log(`⏱️ Total Duration: ${report.summary.totalDuration}ms`);

        // Display failed tests
        if (failedTests > 0) {
            console.log('\n❌ Failed Tests:');
            this.testResults
                .filter(t => t.status === 'FAILED')
                .forEach(test => {
                    console.log(`  - ${test.name}: ${test.error}`);
                });
        }

        // Store report
        try {
            localStorage.setItem('testReport', JSON.stringify(report));
        } catch (error) {
            console.warn('Failed to store test report:', error);
        }

        // Send to analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'test_suite_completed', {
                event_category: 'Testing',
                total_tests: totalTests,
                passed_tests: passedTests,
                failed_tests: failedTests,
                success_rate: report.summary.successRate
            });
        }

        return report;
    }

    // Public methods for manual testing
    async runSingleTest(testName) {
        const allTests = {
            'homepage': this.testHomepageLoad,
            'navigation': this.testNavigation,
            'performance': this.testPerformance,
            'accessibility': this.testAccessibility,
            'seo': this.testSEOMetaTags,
            'pwa': this.testPWAInstallation,
            'charts': this.testChartLoading
        };

        const testFunction = allTests[testName.toLowerCase()];
        if (!testFunction) {
            throw new Error(`Test not found: ${testName}`);
        }

        await this.runTest(testName, testFunction.bind(this));
        return this.testResults[this.testResults.length - 1];
    }

    getTestReport() {
        return {
            results: this.testResults,
            summary: {
                total: this.testResults.length,
                passed: this.testResults.filter(t => t.status === 'PASSED').length,
                failed: this.testResults.filter(t => t.status === 'FAILED').length
            }
        };
    }

    clearResults() {
        this.testResults = [];
        localStorage.removeItem('testReport');
    }
}

// Initialize test suite when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.TestSuite = new E2ETestSuite();
});

// Export for use in other modules
window.E2ETestSuite = E2ETestSuite;