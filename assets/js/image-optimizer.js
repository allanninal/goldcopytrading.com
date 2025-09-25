/**
 * Gold Copy Trading - Image Optimization & WebP Support
 * Handles responsive images, WebP conversion, and progressive loading
 */

class ImageOptimizer {
    constructor() {
        this.supportsWebP = false;
        this.observerConfig = {
            root: null,
            rootMargin: '50px 0px',
            threshold: 0.1
        };

        this.init();
    }

    async init() {
        // Check WebP support
        this.supportsWebP = await this.checkWebPSupport();

        // Initialize lazy loading
        this.initLazyLoading();

        // Initialize responsive images
        this.initResponsiveImages();

        // Add progressive enhancement for existing images
        this.enhanceExistingImages();

        // Monitor for new images added dynamically
        this.observeNewImages();

        console.log('Image optimizer initialized, WebP support:', this.supportsWebP);
    }

    async checkWebPSupport() {
        return new Promise(resolve => {
            const webP = new Image();
            webP.onload = webP.onerror = function () {
                resolve(webP.height === 2);
            };
            webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
        });
    }

    initLazyLoading() {
        if ('IntersectionObserver' in window) {
            this.imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadImage(img);
                        this.imageObserver.unobserve(img);
                    }
                });
            }, this.observerConfig);

            // Observe existing lazy images
            document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
                this.imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-src], img[data-srcset]').forEach(img => {
                this.loadImage(img);
            });
        }
    }

    initResponsiveImages() {
        // Handle picture elements and srcset
        document.querySelectorAll('picture').forEach(picture => {
            this.optimizePictureElement(picture);
        });

        document.querySelectorAll('img[sizes]').forEach(img => {
            this.optimizeResponsiveImage(img);
        });
    }

    enhanceExistingImages() {
        document.querySelectorAll('img:not([data-optimized])').forEach(img => {
            if (!img.dataset.src && !img.dataset.srcset) {
                this.enhanceImage(img);
            }
        });
    }

    observeNewImages() {
        // Monitor for dynamically added images
        if ('MutationObserver' in window) {
            this.mutationObserver = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.tagName === 'IMG') {
                                this.enhanceImage(node);
                            } else {
                                node.querySelectorAll('img').forEach(img => {
                                    this.enhanceImage(img);
                                });
                            }
                        }
                    });
                });
            });

            this.mutationObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    loadImage(img) {
        // Show loading spinner
        this.showLoadingState(img);

        // Determine the best image source
        const imageSrc = this.getBestImageSource(img);

        if (imageSrc) {
            const tempImage = new Image();

            tempImage.onload = () => {
                // Successful load
                this.applyImage(img, tempImage, imageSrc);
                this.hideLoadingState(img);
                img.classList.add('loaded');

                // Trigger load event for analytics
                this.trackImageLoad(img, imageSrc, true);
            };

            tempImage.onerror = () => {
                // Failed load - try fallback
                this.handleImageError(img, imageSrc);
                this.hideLoadingState(img);

                // Track failure
                this.trackImageLoad(img, imageSrc, false);
            };

            // Start loading
            if (img.dataset.srcset) {
                tempImage.srcset = img.dataset.srcset;
                tempImage.sizes = img.sizes || '100vw';
            }
            tempImage.src = imageSrc;
        }
    }

    getBestImageSource(img) {
        let src = img.dataset.src || img.src;

        if (this.supportsWebP && src) {
            // Try to convert to WebP
            src = this.convertToWebP(src);
        }

        // Add responsive parameters if needed
        src = this.addResponsiveParams(src, img);

        return src;
    }

    convertToWebP(src) {
        // Only convert certain image types
        const supportedExtensions = ['.jpg', '.jpeg', '.png'];
        const hasSupported = supportedExtensions.some(ext => src.toLowerCase().includes(ext));

        if (hasSupported && !src.includes('.webp')) {
            // For external images, we can't convert, but we can suggest WebP
            if (src.includes('images.unsplash.com')) {
                // Unsplash supports WebP via format parameter
                const url = new URL(src);
                url.searchParams.set('fm', 'webp');
                return url.toString();
            }

            // For local images, assume WebP versions exist
            if (src.startsWith('/') || src.startsWith('./') || src.startsWith('../')) {
                const webpSrc = src.replace(/\.(jpg|jpeg|png)$/i, '.webp');
                return webpSrc;
            }
        }

        return src;
    }

    addResponsiveParams(src, img) {
        // Add responsive parameters for external services
        if (src.includes('images.unsplash.com')) {
            const url = new URL(src);

            // Get intended display size
            const rect = img.getBoundingClientRect();
            const displayWidth = rect.width || img.naturalWidth || 800;
            const displayHeight = rect.height || img.naturalHeight || 600;

            // Account for device pixel ratio
            const dpr = window.devicePixelRatio || 1;
            const targetWidth = Math.ceil(displayWidth * dpr);
            const targetHeight = Math.ceil(displayHeight * dpr);

            url.searchParams.set('w', Math.min(targetWidth, 1920).toString());
            url.searchParams.set('h', Math.min(targetHeight, 1080).toString());
            url.searchParams.set('fit', 'crop');
            url.searchParams.set('auto', 'format,compress');
            url.searchParams.set('q', '85');

            return url.toString();
        }

        return src;
    }

    applyImage(img, tempImage, src) {
        // Apply loaded image
        if (img.dataset.srcset && tempImage.srcset) {
            img.srcset = tempImage.srcset;
        }

        img.src = src;

        // Clean up data attributes
        delete img.dataset.src;
        delete img.dataset.srcset;

        // Mark as optimized
        img.dataset.optimized = 'true';

        // Add smooth transition
        img.style.transition = 'opacity 0.3s ease';
        img.style.opacity = '1';
    }

    handleImageError(img, failedSrc) {
        console.warn('Failed to load image:', failedSrc);

        // Try fallback without WebP
        if (failedSrc.includes('.webp')) {
            const fallbackSrc = failedSrc.replace('.webp', '.jpg');

            const fallbackImage = new Image();
            fallbackImage.onload = () => {
                this.applyImage(img, fallbackImage, fallbackSrc);
            };
            fallbackImage.onerror = () => {
                this.showImagePlaceholder(img);
            };
            fallbackImage.src = fallbackSrc;
        } else {
            this.showImagePlaceholder(img);
        }
    }

    showImagePlaceholder(img) {
        // Create placeholder
        const placeholder = document.createElement('div');
        placeholder.className = 'image-placeholder';
        placeholder.style.cssText = `
            width: ${img.offsetWidth || 300}px;
            height: ${img.offsetHeight || 200}px;
            background: linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            border: 2px dashed #ccc;
            color: #666;
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            font-size: 14px;
        `;

        placeholder.innerHTML = `
            <div>
                <i class="fas fa-image" style="font-size: 24px; margin-bottom: 8px;"></i>
                <br>
                Image unavailable
            </div>
        `;

        img.parentNode.replaceChild(placeholder, img);
    }

    showLoadingState(img) {
        // Add loading class and spinner
        img.classList.add('loading');

        // Create loading overlay
        const loadingOverlay = document.createElement('div');
        loadingOverlay.className = 'image-loading-overlay';
        loadingOverlay.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
        `;

        loadingOverlay.innerHTML = `
            <div class="loading-spinner" style="
                width: 20px;
                height: 20px;
                border: 2px solid #f3f3f3;
                border-top: 2px solid #d4af37;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
        `;

        // Position parent relatively if needed
        const parent = img.parentNode;
        if (getComputedStyle(parent).position === 'static') {
            parent.style.position = 'relative';
        }

        parent.appendChild(loadingOverlay);

        // Add CSS animation if not present
        if (!document.getElementById('loading-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'loading-animation-styles';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .image-loading-overlay {
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        }
    }

    hideLoadingState(img) {
        img.classList.remove('loading');

        // Remove loading overlay
        const overlay = img.parentNode.querySelector('.image-loading-overlay');
        if (overlay) {
            overlay.remove();
        }
    }

    enhanceImage(img) {
        if (img.dataset.optimized) return;

        // Make image lazy-loadable if not already
        if (!img.dataset.src && img.src) {
            img.dataset.src = img.src;
            img.src = this.createPlaceholderDataURL(img.offsetWidth || 300, img.offsetHeight || 200);
            img.style.opacity = '0.3';

            if (this.imageObserver) {
                this.imageObserver.observe(img);
            }
        }

        // Add error handling
        img.addEventListener('error', (event) => {
            this.handleImageError(img, img.src);
        });

        img.dataset.optimized = 'true';
    }

    createPlaceholderDataURL(width, height) {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext('2d');

        // Create gradient background
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#f0f0f0');
        gradient.addColorStop(1, '#e0e0e0');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        return canvas.toDataURL('image/png');
    }

    optimizePictureElement(picture) {
        const sources = picture.querySelectorAll('source');
        const img = picture.querySelector('img');

        sources.forEach(source => {
            if (this.supportsWebP && source.type !== 'image/webp') {
                // Add WebP source
                const webpSource = document.createElement('source');
                webpSource.srcset = this.convertToWebP(source.srcset);
                webpSource.type = 'image/webp';
                webpSource.media = source.media;
                webpSource.sizes = source.sizes;

                picture.insertBefore(webpSource, source);
            }
        });

        if (img) {
            this.enhanceImage(img);
        }
    }

    optimizeResponsiveImage(img) {
        if (img.dataset.optimized) return;

        // Enhance srcset with WebP alternatives
        if (img.srcset && this.supportsWebP) {
            const webpSrcset = img.srcset.split(',').map(src => {
                const [url, size] = src.trim().split(' ');
                return `${this.convertToWebP(url)} ${size || ''}`.trim();
            }).join(', ');

            // Create picture element with WebP source
            const picture = document.createElement('picture');

            const webpSource = document.createElement('source');
            webpSource.srcset = webpSrcset;
            webpSource.type = 'image/webp';
            webpSource.sizes = img.sizes;

            const fallbackSource = document.createElement('source');
            fallbackSource.srcset = img.srcset;
            fallbackSource.sizes = img.sizes;

            picture.appendChild(webpSource);
            picture.appendChild(fallbackSource);
            picture.appendChild(img.cloneNode(true));

            img.parentNode.replaceChild(picture, img);
        }
    }

    trackImageLoad(img, src, success) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'image_load', {
                event_category: 'Performance',
                event_label: success ? 'success' : 'error',
                custom_parameter_1: src,
                custom_parameter_2: this.supportsWebP ? 'webp_supported' : 'webp_not_supported'
            });
        }
    }

    // Public methods
    preloadImages(urls) {
        urls.forEach(url => {
            const img = new Image();
            img.src = this.supportsWebP ? this.convertToWebP(url) : url;
        });
    }

    getOptimizationStats() {
        const allImages = document.querySelectorAll('img');
        const optimizedImages = document.querySelectorAll('img[data-optimized="true"]');
        const lazyImages = document.querySelectorAll('img[data-src]');

        return {
            total: allImages.length,
            optimized: optimizedImages.length,
            lazy: lazyImages.length,
            webpSupported: this.supportsWebP,
            optimizationRatio: allImages.length ? (optimizedImages.length / allImages.length * 100).toFixed(1) + '%' : '0%'
        };
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.ImageOptimizer = new ImageOptimizer();
});

// Export for use in other modules
window.ImageOptimizer = ImageOptimizer;