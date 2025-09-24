/**
 * Gold Copy Trading - Shared Report Utilities
 * Common functions and configurations for all trading report pages
 */

// Chart.js configurations for different currency pairs
const ReportChartConfig = {
    // Common chart options for all reports
    defaultOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    font: { size: 14, weight: 'bold' },
                    padding: 20,
                    color: '#333'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: 'white',
                bodyColor: 'white',
                borderWidth: 1,
                cornerRadius: 10,
                callbacks: {
                    label: function(context) {
                        const dataPoint = context.raw;
                        if (typeof dataPoint === 'object' && dataPoint.profit) {
                            return [
                                `Return: ${context.parsed.y.toFixed(2)}%`,
                                `Profit: $${dataPoint.profit.toFixed(2)}`,
                                `Start: $${dataPoint.startBalance.toFixed(2)}`
                            ];
                        }
                        return `Return: ${context.parsed.y.toFixed(2)}%`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0, 0, 0, 0.1)',
                    lineWidth: 1
                },
                title: {
                    display: true,
                    font: { size: 14, weight: 'bold' },
                    color: '#333'
                },
                ticks: {
                    font: { size: 12 },
                    color: '#666',
                    callback: function(value) {
                        return value.toFixed(1) + '%';
                    }
                }
            },
            x: {
                grid: { display: false },
                ticks: {
                    font: { size: 12, weight: 'bold' },
                    color: '#333'
                },
                title: {
                    display: true,
                    text: 'Month',
                    font: { size: 14, weight: 'bold' },
                    color: '#333'
                }
            }
        },
        animation: {
            duration: 2000,
            easing: 'easeOutQuart'
        }
    },

    // Currency pair specific colors and configurations
    currencyPairs: {
        'EUR/USD': {
            color: 'rgba(102, 126, 234, 1)',
            backgroundColor: 'rgba(102, 126, 234, 0.1)',
            borderColor: 'rgba(102, 126, 234, 1)'
        },
        'GBP/USD': {
            color: 'rgba(56, 239, 125, 1)',
            backgroundColor: 'rgba(56, 239, 125, 0.1)',
            borderColor: 'rgba(56, 239, 125, 1)'
        },
        'USD/CHF': {
            color: 'rgba(17, 153, 142, 1)',
            backgroundColor: 'rgba(17, 153, 142, 0.1)',
            borderColor: 'rgba(17, 153, 142, 1)'
        },
        'AUD/USD': {
            color: 'rgba(245, 87, 108, 1)',
            backgroundColor: 'rgba(245, 87, 108, 0.1)',
            borderColor: 'rgba(245, 87, 108, 1)'
        },
        'Portfolio': {
            color: 'rgba(255, 193, 7, 1)',
            backgroundColor: 'rgba(255, 193, 7, 0.1)',
            borderColor: 'rgba(255, 193, 7, 1)'
        }
    },

    // Create dataset configuration for a currency pair
    createDataset: function(pairName, data, options = {}) {
        const pairConfig = this.currencyPairs[pairName] || this.currencyPairs['Portfolio'];
        const colorVariations = options.colorVariations || [];
        
        return {
            label: pairName + ' Monthly Return (%)',
            data: data,
            backgroundColor: colorVariations.length > 0 ? colorVariations : pairConfig.backgroundColor,
            borderColor: pairConfig.borderColor,
            borderWidth: options.borderWidth || 3,
            borderRadius: options.borderRadius || 8,
            borderSkipped: false,
            fill: options.fill || false,
            tension: options.tension || 0.4,
            pointRadius: options.pointRadius || 6,
            pointHoverRadius: options.pointHoverRadius || 8,
            pointBackgroundColor: pairConfig.color,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            ...options.overrides
        };
    }
};

// Performance calculation utilities
const PerformanceUtils = {
    // Calculate monthly percentage return
    calculateMonthlyReturn: function(startBalance, endBalance) {
        return ((endBalance - startBalance) / startBalance) * 100;
    },

    // Calculate total return over period
    calculateTotalReturn: function(initialInvestment, finalValue) {
        return ((finalValue - initialInvestment) / initialInvestment) * 100;
    },

    // Format currency values
    formatCurrency: function(amount, currency = 'USD') {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    },

    // Format percentage values
    formatPercentage: function(value, decimals = 1) {
        return `${value.toFixed(decimals)}%`;
    },

    // Calculate profit from percentage and initial amount
    calculateProfit: function(percentage, initialAmount) {
        return (percentage / 100) * initialAmount;
    },

    // Generate performance summary
    generateSummary: function(data) {
        const totalReturn = data.reduce((sum, month) => sum + month.percentage, 0);
        const totalProfit = data.reduce((sum, month) => sum + month.profit, 0);
        const bestMonth = data.reduce((best, month) => 
            month.percentage > best.percentage ? month : best
        );
        const averageMonthly = totalReturn / data.length;

        return {
            totalReturn: this.formatPercentage(totalReturn),
            totalProfit: this.formatCurrency(totalProfit),
            bestMonth: {
                month: bestMonth.month,
                return: this.formatPercentage(bestMonth.percentage)
            },
            averageMonthly: this.formatPercentage(averageMonthly),
            totalTrades: data.reduce((sum, month) => sum + (month.trades || 0), 0)
        };
    }
};

// Lazy loading utilities for report images
const ReportLazyLoad = {
    // Initialize intersection observer for lazy loading
    init: function() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            // Observe all images with data-src attribute
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.loadImage(img);
            });
        }
    },

    // Load individual image
    loadImage: function(img) {
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        img.classList.add('loaded');
        
        // Add loading animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
        
        img.onload = function() {
            this.style.opacity = '1';
        };
        
        // Remove data-src to prevent reprocessing
        delete img.dataset.src;
    }
};

// Report navigation utilities
const ReportNavigation = {
    // Generate breadcrumb navigation
    generateBreadcrumbs: function(currentPage) {
        const breadcrumbsContainer = document.querySelector('.breadcrumb');
        if (!breadcrumbsContainer) return;

        const breadcrumbs = [
            { text: 'Home', href: '../index.html' },
            { text: 'Reports', href: '../index.html#performance' },
            { text: currentPage, href: null }
        ];

        const breadcrumbHTML = breadcrumbs.map((item, index) => {
            if (index === breadcrumbs.length - 1) {
                return `<li class="breadcrumb-item active" aria-current="page">${item.text}</li>`;
            } else {
                return `<li class="breadcrumb-item"><a href="${item.href}">${item.text}</a></li>`;
            }
        }).join('');

        breadcrumbsContainer.innerHTML = `<ol class="breadcrumb">${breadcrumbHTML}</ol>`;
    },

    // Add smooth scrolling to anchors
    initSmoothScrolling: function() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
};

// Accessibility enhancements for reports
const ReportA11y = {
    // Add screen reader descriptions for charts
    addChartDescriptions: function() {
        const charts = document.querySelectorAll('canvas');
        charts.forEach((chart, index) => {
            if (!chart.getAttribute('aria-label')) {
                const pairName = this.extractPairFromContext(chart);
                chart.setAttribute('aria-label', 
                    `Trading performance chart for ${pairName} showing monthly returns over 6-month period`
                );
                chart.setAttribute('role', 'img');
            }
        });
    },

    // Extract currency pair name from context
    extractPairFromContext: function(element) {
        // Look for pair name in page title, headers, or nearby elements
        const title = document.title;
        const pairs = ['EUR/USD', 'GBP/USD', 'USD/CHF', 'AUD/USD', 'Multi-Currency Portfolio'];
        
        for (const pair of pairs) {
            if (title.includes(pair) || title.includes(pair.replace('/', ''))) {
                return pair;
            }
        }
        
        return 'Currency pair';
    },

    // Enhance form accessibility
    enhanceFormAccessibility: function() {
        // Add labels to form elements that might be missing them
        document.querySelectorAll('input, select, textarea').forEach(input => {
            if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
                const label = input.previousElementSibling;
                if (label && label.tagName === 'LABEL') {
                    const labelId = 'label-' + Math.random().toString(36).substr(2, 9);
                    label.id = labelId;
                    input.setAttribute('aria-labelledby', labelId);
                }
            }
        });
    }
};

// Error handling for reports
const ReportErrorHandler = {
    // Handle chart loading errors
    handleChartError: function(error, container) {
        console.error('Chart loading error:', error);
        
        const errorMessage = document.createElement('div');
        errorMessage.className = 'chart-error';
        errorMessage.innerHTML = `
            <div class="error-content">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Chart Loading Error</h3>
                <p>Unable to load the performance chart. Please refresh the page or try again later.</p>
                <button class="btn btn-secondary" onclick="location.reload()">Refresh Page</button>
            </div>
        `;
        
        if (container) {
            container.appendChild(errorMessage);
        }
        
        // Track error with analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                description: 'Chart loading failed: ' + error.message,
                fatal: false
            });
        }
    },

    // Handle image loading errors
    handleImageError: function(img) {
        img.style.display = 'none';
        
        const placeholder = document.createElement('div');
        placeholder.className = 'image-error-placeholder';
        placeholder.innerHTML = `
            <i class="fas fa-image"></i>
            <p>Image temporarily unavailable</p>
        `;
        
        img.parentNode.insertBefore(placeholder, img.nextSibling);
    }
};

// Initialize report utilities when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize lazy loading
    ReportLazyLoad.init();
    
    // Add accessibility enhancements
    ReportA11y.addChartDescriptions();
    ReportA11y.enhanceFormAccessibility();
    
    // Initialize smooth scrolling
    ReportNavigation.initSmoothScrolling();
    
    // Add chart hover effects
    document.querySelectorAll('canvas').forEach(canvas => {
        canvas.addEventListener('mousemove', function() {
            this.style.cursor = 'pointer';
        });
        
        canvas.addEventListener('mouseleave', function() {
            this.style.cursor = 'default';
        });
    });
    
    // Add image error handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            ReportErrorHandler.handleImageError(this);
        });
    });
});

// Export utilities for use in report pages
window.ReportUtils = {
    ChartConfig: ReportChartConfig,
    Performance: PerformanceUtils,
    LazyLoad: ReportLazyLoad,
    Navigation: ReportNavigation,
    A11y: ReportA11y,
    ErrorHandler: ReportErrorHandler
};