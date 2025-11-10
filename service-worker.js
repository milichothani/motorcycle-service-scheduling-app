const CACHE_NAME = 'corner-tuned-cache-v6';

// All local application files, now using relative paths
const APP_SHELL_URLS = [
  '.',
  './index.html',
  './manifest.json',
  './index.tsx',
  './App.tsx',
  './types.ts',
  './components/AdminDashboard.tsx',
  './components/Articles.tsx',
  './components/BookingCard.tsx',
  './components/BookingModal.tsx',
  './components/CustomerForm.tsx',
  './components/Header.tsx',
  './components/icons.tsx',
  './components/Invoice.tsx',
  './components/TechSuggestions.tsx',
  './components/ShoppingList.tsx',
  './services/geminiService.ts',
  './hooks/useOnlineStatus.ts',
  './icons/icon-192.svg',
  './icons/icon-512.svg',
];

// Third-party resources essential for the app to work offline
const THIRD_PARTY_URLS = [
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Roboto:wght@400;500;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js',
    'https://aistudiocdn.com/react@^19.2.0',
    'https://aistudiocdn.com/react@^19.2.0/jsx-runtime',
    'https://aistudiocdn.com/react-dom@^19.2.0/client',
    'https://aistudiocdn.com/@google/genai@^1.28.0',
];

const urlsToCache = [...APP_SHELL_URLS, ...THIRD_PARTY_URLS];

// Install event: cache all essential assets.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell for v6');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Force the new service worker to activate immediately.
      .catch(error => {
        console.error('Failed to cache app shell for v6:', error);
      })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients.
  );
});

// Fetch event: Implement the "Stale-While-Revalidate" strategy.
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Create a promise that fetches from the network and updates the cache.
        const fetchAndUpdatePromise = fetch(event.request)
          .then(networkResponse => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(err => {
            console.warn(`Network fetch failed for ${event.request.url}. Serving stale content if available.`);
            // If the network fails, we can still return the cached response if it exists.
            if (cachedResponse) {
              return cachedResponse;
            }
          });

        // Return the cached response immediately if it exists,
        // otherwise, wait for the network to respond.
        return cachedResponse || fetchAndUpdatePromise;
      });
    })
  );
});