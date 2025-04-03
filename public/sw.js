// Service Worker for FataPlus PWA
const CACHE_NAME = 'fataplus-cache-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache immediately on service worker install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/assets/logo.svg',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/images/placeholder.jpg'
];

// Install event - precache key assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Precaching App Shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[Service Worker] Installation complete');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
      .then(() => {
        console.log('[Service Worker] Claiming clients');
        return self.clients.claim();
      })
  );
});

// Helper function to determine if a request is an API call
const isApiRequest = (url) => {
  return url.includes('/api/') || url.includes('backend.fata.plus');
};

// Helper function to determine if a request is for a static asset
const isStaticAsset = (url) => {
  return (
    url.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/) ||
    PRECACHE_ASSETS.includes(url)
  );
};

// Fetch event - network-first for API, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Skip cross-origin requests
  if (url.origin !== self.location.origin && !url.href.includes('backend.fata.plus')) {
    return;
  }
  
  // API requests - Network first, fall back to offline response
  if (isApiRequest(url.href)) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the response for future offline use
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            // Only cache successful responses
            if (clonedResponse.ok) {
              cache.put(event.request, clonedResponse);
            }
          });
          return response;
        })
        .catch(() => {
          // Try to get from cache first
          return caches.match(event.request)
            .then((cachedResponse) => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If not in cache, return offline JSON for API requests
              return new Response(
                JSON.stringify({ 
                  error: true, 
                  message: 'You are offline. Please check your internet connection.' 
                }),
                { 
                  headers: { 'Content-Type': 'application/json' },
                  status: 503
                }
              );
            });
        })
    );
    return;
  }
  
  // Static assets - Cache first, network fallback
  if (isStaticAsset(url.href)) {
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Not in cache, get from network
          return fetch(event.request)
            .then((response) => {
              // Cache the new asset for future
              const clonedResponse = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, clonedResponse);
              });
              return response;
            })
            .catch(() => {
              // If it's an image, return a placeholder
              if (event.request.url.match(/\.(jpg|jpeg|png|gif|svg)$/)) {
                return caches.match('/assets/images/placeholder.jpg');
              }
              
              // For other assets, just fail
              return new Response('Not available offline', { status: 404 });
            });
        })
    );
    return;
  }
  
  // HTML navigation - Network first with cache fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Cache the response
          const clonedResponse = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clonedResponse);
          });
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then((cachedResponse) => {
              // Return cached page if available
              if (cachedResponse) {
                return cachedResponse;
              }
              // Otherwise show generic offline page
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // Default fetch behavior for everything else
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request)
          .then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            return caches.match(OFFLINE_URL);
          });
      })
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-forms') {
    event.waitUntil(syncForms());
  }
});

// Function to sync stored form data when back online
async function syncForms() {
  try {
    const db = await openDB();
    const pendingForms = await db.getAll('pendingForms');
    
    for (const form of pendingForms) {
      try {
        const response = await fetch(form.url, {
          method: form.method,
          headers: form.headers,
          body: form.body
        });
        
        if (response.ok) {
          await db.delete('pendingForms', form.id);
        }
      } catch (error) {
        console.error('Failed to sync form:', error);
      }
    }
  } catch (error) {
    console.error('Error syncing forms:', error);
  }
}

// IndexedDB helper for storing offline data
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fataplus-offline', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('pendingForms')) {
        db.createObjectStore('pendingForms', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve({
        getAll: (storeName) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
          });
        },
        delete: (storeName, id) => {
          return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);
            
            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
          });
        }
      });
    };
    
    request.onerror = () => reject(request.error);
  });
}

// Push notification event
self.addEventListener('push', (event) => {
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    data: {
      url: data.url || '/'
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' })
      .then((clientList) => {
        // Check if there's already a window open
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        // If no window is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(event.notification.data.url);
        }
      })
  );
});
