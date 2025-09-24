/**
 * Gold Copy Trading - Shared JavaScript Utilities
 * Common functions and configurations used across the website
 */

// Enhanced Google Analytics configuration
const GTMConfig = {
    trackingId: 'G-JYMV22G2B2',
    cookieDomain: 'goldcopytrading.com',
    config: {
        page_title: document.title,
        anonymize_ip: true,
        allow_google_signals: true,
        allow_ad_personalization_signals: true,
        send_page_view: true,
        cookie_flags: 'secure;samesite=none',
        user_properties: {
            visitor_type: 'prospect'
        }
    }
};

// Analytics Helper Functions
const Analytics = {
    // Track button clicks
    trackButtonClick: function(buttonText, buttonUrl, section = 'unknown-section') {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'button_click', {
                event_category: 'Conversion',
                event_label: buttonText,
                button_url: buttonUrl,
                section: section
            });

            // Track primary conversion buttons
            if (buttonText.includes('Copy') || buttonText.includes('Create Account')) {
                gtag('event', 'conversion', {
                    send_to: GTMConfig.trackingId,
                    event_category: 'Lead',
                    event_label: buttonText
                });
            }
        }
    },

    // Track FAQ interactions
    trackFAQ: function(questionText) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'faq_open', {
                event_category: 'Engagement',
                event_label: questionText
            });
        }
    },

    // Track section visibility
    trackSectionView: function(sectionId) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'section_view', {
                event_category: 'Content',
                event_label: sectionId,
                non_interaction: true
            });
        }
    },

    // Track scroll depth
    trackScrollDepth: function(depth) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'scroll_depth', {
                event_category: 'Engagement',
                event_label: depth + '%',
                non_interaction: true
            });
        }
    },

    // Track navigation
    trackNavigation: function(targetId) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'navigation', {
                event_category: 'Engagement',
                event_label: 'To ' + targetId
            });
        }
    },

    // Track outbound links
    trackOutboundLink: function(href) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'outbound_link', {
                event_category: 'Navigation',
                event_label: href,
                transport_type: 'beacon'
            });
        }
    },

    // Track time on page milestones
    trackTimeOnPage: function(duration) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'time_on_page', {
                event_category: 'Engagement',
                event_label: duration,
                non_interaction: true
            });
        }
    }
};

// Performance Monitoring
const Performance = {
    // Track page load performance
    trackPageLoad: function() {
        if (typeof gtag !== 'undefined' && performance) {
            gtag('event', 'timing_complete', {
                name: 'page_load',
                value: Math.round(performance.now()),
                event_category: 'Page Performance'
            });
        }
    },

    // Lazy load images with performance tracking
    lazyLoadImages: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
};

// FAQ Functionality
const FAQ = {
    // Initialize accessible FAQ accordion
    initialize: function() {
        document.querySelectorAll('.faq-question').forEach(button => {
            button.addEventListener('click', this.handleClick.bind(this));
            button.addEventListener('keydown', this.handleKeydown.bind(this));
        });
    },

    handleClick: function(event) {
        const button = event.currentTarget;
        const item = button.parentNode;
        const answer = button.nextElementSibling;
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Close all other items
        document.querySelectorAll('.faq-question').forEach(otherButton => {
            if (otherButton !== button) {
                const otherAnswer = otherButton.nextElementSibling;
                otherButton.setAttribute('aria-expanded', 'false');
                otherAnswer.setAttribute('hidden', '');
                otherButton.parentNode.classList.remove('active');
            }
        });

        // Toggle clicked item
        if (!isExpanded) {
            button.setAttribute('aria-expanded', 'true');
            answer.removeAttribute('hidden');
            item.classList.add('active');

            // Track FAQ engagement
            const questionText = button.querySelector('span').textContent;
            Analytics.trackFAQ(questionText);
        } else {
            button.setAttribute('aria-expanded', 'false');
            answer.setAttribute('hidden', '');
            item.classList.remove('active');
        }
    },

    handleKeydown: function(event) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.currentTarget.click();
        }
    }
};

// Scroll Tracking
const ScrollTracker = {
    scrollDepthTriggered: {
        '25': false,
        '50': false,
        '75': false,
        '100': false
    },

    initialize: function() {
        window.addEventListener('scroll', this.handleScroll.bind(this));
    },

    handleScroll: function() {
        const scrollPosition = window.scrollY;
        const totalHeight = document.body.scrollHeight - window.innerHeight;
        const scrollPercentage = (scrollPosition / totalHeight) * 100;

        Object.keys(this.scrollDepthTriggered).forEach(depth => {
            if (!this.scrollDepthTriggered[depth] && scrollPercentage >= parseInt(depth)) {
                this.scrollDepthTriggered[depth] = true;
                Analytics.trackScrollDepth(parseInt(depth));
            }
        });
    }
};

// Section Visibility Tracking
const SectionTracker = {
    initialize: function() {
        if ('IntersectionObserver' in window) {
            const observeSection = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = entry.target.getAttribute('id');
                        if (sectionId) {
                            Analytics.trackSectionView(sectionId);
                        }
                    }
                });
            }, { threshold: 0.5 });

            // Observe all major sections
            document.querySelectorAll('section[id]').forEach(section => {
                observeSection.observe(section);
            });
        }
    }
};

// Navigation and Smooth Scrolling
const Navigation = {
    initialize: function() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleAnchorClick.bind(this));
        });

        // Track all button clicks
        document.querySelectorAll('.btn, .cta-button').forEach(button => {
            button.addEventListener('click', this.handleButtonClick.bind(this));
        });

        // Track outbound links
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            link.addEventListener('click', this.handleOutboundClick.bind(this));
        });
    },

    handleAnchorClick: function(event) {
        const targetId = event.currentTarget.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            event.preventDefault();
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            Analytics.trackNavigation(targetId);
        }
    },

    handleButtonClick: function(event) {
        const button = event.currentTarget;
        const buttonText = button.textContent.trim();
        const buttonUrl = button.getAttribute('href') || '';
        const buttonSection = button.closest('section')?.getAttribute('id') || 'unknown-section';
        
        Analytics.trackButtonClick(buttonText, buttonUrl, buttonSection);
    },

    handleOutboundClick: function(event) {
        const href = event.currentTarget.getAttribute('href');
        const isExternal = !href.includes('goldcopytrading.com');
        
        if (isExternal) {
            Analytics.trackOutboundLink(href);
        }
    }
};

// Time on Page Tracking
const TimeTracker = {
    initialize: function() {
        // Track engagement milestones
        setTimeout(() => Analytics.trackTimeOnPage('30 seconds'), 30000);
        setTimeout(() => Analytics.trackTimeOnPage('2 minutes'), 120000);
        setTimeout(() => Analytics.trackTimeOnPage('5 minutes'), 300000);
    }
};

// Chart.js Common Configuration
const ChartConfig = {
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderWidth: 1,
                cornerRadius: 10
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1
                },
                ticks: {
                    font: { size: 12 },
                    color: '#666'
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12, weight: 'bold' },
                    color: '#333'
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    },

    // Color schemes for different currency pairs
    colors: {
        eurUsd: 'rgba(102, 126, 234, 1)',
        gbpUsd: 'rgba(56, 239, 125, 1)',
        usdChf: 'rgba(17, 153, 142, 1)',
        audUsd: 'rgba(245, 87, 108, 1)',
        portfolio: 'rgba(255, 193, 7, 1)'
    }
};

// Loading States and Error Handling
const LoadingManager = {
    showLoading: function(element) {
        element.classList.add('loading');
    },

    hideLoading: function(element) {
        element.classList.remove('loading');
    },

    showError: function(message, container) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="background: var(--dark-gray); border: 2px solid #e74c3c; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <i class="fas fa-exclamation-triangle" style="color: #e74c3c; font-size: 2rem; margin-bottom: 10px;"></i>
                <p style="color: var(--white); margin: 0;">${message}</p>
            </div>
        `;
        container.appendChild(errorDiv);
    }
};

// Accessibility Utilities
const A11y = {
    // Announce content changes to screen readers
    announce: function(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.position = 'absolute';
        announcement.style.left = '-10000px';
        announcement.style.width = '1px';
        announcement.style.height = '1px';
        announcement.style.overflow = 'hidden';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    },

    // Manage focus for dynamic content
    manageFocus: function(element) {
        element.setAttribute('tabindex', '-1');
        element.focus();
        element.addEventListener('blur', () => element.removeAttribute('tabindex'));
    }
};

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Core functionality
    FAQ.initialize();
    Navigation.initialize();
    ScrollTracker.initialize();
    SectionTracker.initialize();
    TimeTracker.initialize();
    Performance.lazyLoadImages();
    
    // Track initial page load
    Performance.trackPageLoad();
    
    // Announce page readiness to screen readers
    A11y.announce('Page loaded successfully');
});

// Export for use in other scripts
window.GoldCopyTrading = {
    Analytics,
    Performance,
    FAQ,
    Navigation,
    ChartConfig,
    LoadingManager,
    A11y,
    GTMConfig
};