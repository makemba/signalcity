/* eslint-disable no-restricted-globals */

// This service worker can be customized!
// See https://developers.google.com/web/tools/workbox/modules
// for the list of available Workbox modules, or add any other
// code you'd like.

// Cache names
const CACHE_NAME = 'report-helper-hub-v1';
const RUNTIME_CACHE = 'runtime-cache';

// Assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.json',
  '/locales/fr/common.json',
  '/locales/en/common.json',
];

// URLs we want to keep "fresh"
const RUNTIME_URLS = [
  '/api/',
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
];

// Install event - precache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName));
    }).then((cachesToDelete) => {
      return Promise.all(cachesToDelete.map((cacheToDelete) => {
        return caches.delete(cacheToDelete);
      }));
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network-first strategy for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  // Skip cross-origin and non-GET requests
  if (event.request.mode !== 'navigate' && 
      !event.request.url.startsWith(self.location.origin) &&
      !RUNTIME_URLS.some(url => event.request.url.startsWith(url))) {
    return;
  }

  // For API requests, use network-first strategy
  if (event.request.url.includes('/api/') || 
      RUNTIME_URLS.some(url => event.request.url.startsWith(url))) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If the response was good, clone it and store it in the cache
          if (response.status === 200) {
            const clonedResponse = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Network failed, try the cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // For everything else, use cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      // Request is not in cache, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Clone the response
          const responseToCache = response.clone();
          
          // Open the cache and put the fetched response in it
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        });
    })
  );
});

// Handle offline form submissions with Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'submit-offline-form') {
    event.waitUntil(
      self.db.getAll('offlineForms').then((forms) => {
        return Promise.all(
          forms.map((form) => {
            return fetch('/api/incidents', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(form),
            })
            .then((response) => {
              if (response.ok) {
                return self.db.delete('offlineForms', form.id);
              }
            });
          })
        );
      })
    );
  }
});

// Push Notifications Support
self.addEventListener('push', (event) => {
  if (!event.data) return;

  const data = event.data.json();
  
  const options = {
    body: data.message,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(
    self.registration.showNotification('Report Helper Hub', options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});
