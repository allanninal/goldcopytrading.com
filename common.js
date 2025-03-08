// Timeframe switching functionality
const showTimeframe = (timeframe) => {
    // Cache DOM queries
    const timeframeContents = document.querySelectorAll('.timeframe-content');
    const timeframeTabs = document.querySelectorAll('.timeframe-tab');
    
    // Hide all timeframe contents
    timeframeContents.forEach(content => content.classList.add('hidden'));
    
    // Remove active state from all tabs
    timeframeTabs.forEach(tab => {
        tab.classList.remove('bg-white', 'shadow', 'text-blue-700');
        tab.classList.add('text-gray-700', 'hover:bg-gray-50');
    });
    
    // Show selected timeframe content
    document.getElementById(`timeframe-${timeframe}`).classList.remove('hidden');
    
    // Update active tab styling
    const activeTab = document.querySelector(`[data-timeframe="${timeframe}"]`);
    activeTab.classList.remove('text-gray-700', 'hover:bg-gray-50');
    activeTab.classList.add('bg-white', 'shadow', 'text-blue-700');
};

// Mobile menu functionality
const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById('mobileMenu');
    const menuIcon = document.getElementById('menuIcon');
    const closeIcon = document.getElementById('closeIcon');
    
    const isOpen = mobileMenu.classList.toggle('hidden');
    menuIcon.classList.toggle('hidden', !isOpen);
    closeIcon.classList.toggle('hidden', isOpen);
};

// Quick Access Menu Functions
function toggleQuickMenu() {
    const panel = document.getElementById('quickAccessPanel');
    panel.classList.toggle('hidden');
}

function showScenario(type) {
    // Hide all scenarios
    document.querySelectorAll('.scenario-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show selected scenario
    document.getElementById(`${type}Scenario`).classList.remove('hidden');
    
    // Update tab styles
    document.querySelectorAll('.scenario-tab').forEach(tab => {
        tab.classList.remove('border-primary', 'text-primary');
        tab.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Highlight active tab
    event.currentTarget.classList.remove('border-transparent', 'text-gray-500');
    event.currentTarget.classList.add('border-primary', 'text-primary');
}

// Scroll to top functionality
const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

// Intersection Observer for lazy loading
const observeElements = () => {
    if (!('IntersectionObserver' in window)) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.lazy-load').forEach(el => observer.observe(el));
};

// Smooth scroll functionality
const initSmoothScroll = () => {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
};

// Initialize all functionality when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Show initial timeframe if present
    if (document.querySelector('.timeframe-tab')) {
        showTimeframe('15min');
    }
    
    // Initialize observers and event listeners
    observeElements();
    initSmoothScroll();
    
    // Scroll to top button
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                scrollTopBtn.classList.remove('hidden');
            } else {
                scrollTopBtn.classList.add('hidden');
            }
        });
        
        scrollTopBtn.addEventListener('click', scrollToTop);
    }
    
    // Close panel when clicking outside
    document.addEventListener('click', (event) => {
        const panel = document.getElementById('quickAccessPanel');
        const fab = document.getElementById('quickAccessMenu');
        
        if (panel && fab && !fab.contains(event.target) && !panel.classList.contains('hidden')) {
            panel.classList.add('hidden');
        }
    });
}); 