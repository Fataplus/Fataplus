'use client';

import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      // Register the service worker
      if (process.env.NODE_ENV === 'production') {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('Service Worker registered with scope:', registration.scope);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              
              if (newWorker) {
                newWorker.addEventListener('statechange', () => {
                  if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    // New content is available, show a notification
                    toast.info('New version available!', {
                      description: 'Refresh the page to update the app.',
                      action: {
                        label: 'Refresh',
                        onClick: () => window.location.reload(),
                      },
                      duration: 10000,
                    });
                  }
                });
              }
            });
          })
          .catch((error) => {
            console.error('Service Worker registration failed:', error);
          });
      }
      
      // Add offline/online event listeners
      const handleOffline = () => {
        toast.error('You are offline', {
          description: 'Some features may be unavailable until you reconnect.',
        });
      };
      
      const handleOnline = () => {
        toast.success('You are back online', {
          description: 'All features are now available.',
        });
      };
      
      window.addEventListener('offline', handleOffline);
      window.addEventListener('online', handleOnline);
      
      return () => {
        window.removeEventListener('offline', handleOffline);
        window.removeEventListener('online', handleOnline);
      };
    }
  }, []);
  
  return null;
}
