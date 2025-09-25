/**
 * Gold Copy Trading - Service Worker
 * Handles caching, offline functionality, and background sync
 */

const CACHE_NAME = 'gold-copy-trading-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/css/critical.css',
  '/assets/css/homepage.css',
  '/assets/css/accessibility.css',
  '/assets/js/utils.js',
  '/assets/js/report-utils.js',
  '/reports/combined.html',
  '/reports/eurusd.html',
  '/reports/gbpusd.html',
  '/reports/usdchf.html',
  '/reports/audusd.html',
  '/manifest.json',
  // External dependencies that are critical
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap'
];

// Dynamic content patterns to cache
const CACHE_PATTERNS = [
  /^https:\/\/images\.unsplash\.com\//,
  /^https:\/\/cdn\.jsdelivr\.net\/npm\/chart\.js/,
  /^https:\/\/www\.googletagmanager\.com\/gtag/,
  /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
  /\.(?:css|js)$/
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker installing...');

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, {
          credentials: 'same-origin'
        })));
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Old caches cleaned up');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests except for allowed patterns
  if (url.origin !== location.origin && !shouldCacheCrossOrigin(url)) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Serve from cache and update in background for dynamic content
          if (isDynamicContent(request.url)) {
            updateCacheInBackground(request);
          }
          return cachedResponse;
        }

        // Network request for uncached content
        return fetch(request)
          .then(response => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              const cacheType = isStaticAsset(request.url) ? STATIC_CACHE : DYNAMIC_CACHE;

              caches.open(cacheType)
                .then(cache => {
                  cache.put(request, responseClone);
                })
                .catch(error => {
                  console.warn('Failed to cache response:', error);
                });
            }

            return response;
          })
          .catch(error => {
            console.error('Network request failed:', error);

            // Return offline fallback for HTML pages
            if (request.destination === 'document') {
              return caches.match('/index.html');
            }

            // Return placeholder for images
            if (request.destination === 'image') {
              return new Response(
                '<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="150" fill="#f0f0f0"/><text x="100" y="75" text-anchor="middle" fill="#666">Image unavailable</text></svg>',
                { headers: { 'Content-Type': 'image/svg+xml' } }
              );
            }

            throw error;
          });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/assets/icons/icon-192x192.png',
      badge: '/assets/icons/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: '/'
      },
      actions: [
        {
          action: 'open',
          title: 'View Trading Dashboard'
        },
        {
          action: 'close',
          title: 'Close'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Gold Copy Trading', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.matchAll({ type: 'window' })
        .then(clientList => {
          for (const client of clientList) {
            if (client.url === '/' && 'focus' in client) {
              return client.focus();
            }
          }

          if (clients.openWindow) {
            return clients.openWindow('/');
          }
        })
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CACHE_UPDATE') {
    event.waitUntil(updateSpecificCache(event.data.url));
  }
});

// Helper functions
function shouldCacheCrossOrigin(url) {
  return CACHE_PATTERNS.some(pattern => pattern.test(url.href));
}

function isDynamicContent(url) {
  return url.includes('/reports/') || url.includes('/api/') || url.includes('chart');
}

function isStaticAsset(url) {
  return /\.(css|js|png|jpg|jpeg|svg|gif|webp|ico|woff|woff2|ttf|eot)$/.test(url) ||
         url.includes('/assets/') ||
         STATIC_ASSETS.some(asset => url.includes(asset));
}

function updateCacheInBackground(request) {
  fetch(request)
    .then(response => {
      if (response.status === 200) {
        caches.open(DYNAMIC_CACHE)
          .then(cache => {
            cache.put(request, response);
          });
      }
    })
    .catch(error => {
      console.warn('Background cache update failed:', error);
    });
}

function updateSpecificCache(url) {
  return fetch(url)
    .then(response => {
      if (response.status === 200) {
        const cacheType = isStaticAsset(url) ? STATIC_CACHE : DYNAMIC_CACHE;
        return caches.open(cacheType)
          .then(cache => {
            cache.put(url, response);
          });
      }
    });
}

function doBackgroundSync() {
  // Handle any queued form submissions or data sync
  return Promise.resolve();
}

// Performance monitoring
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/reports/')) {
    const startTime = performance.now();

    event.respondWith(
      fetch(event.request)
        .then(response => {
          const endTime = performance.now();
          const duration = endTime - startTime;

          // Log slow requests
          if (duration > 2000) {
            console.warn(`Slow request detected: ${event.request.url} took ${duration.toFixed(2)}ms`);
          }

          return response;
        })
    );
  }
});

console.log('Gold Copy Trading Service Worker loaded successfully');