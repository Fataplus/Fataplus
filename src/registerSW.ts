import { registerSW } from 'virtual:pwa-register';

// This is the service worker registration function
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    const updateSW = registerSW({
      onNeedRefresh() {
        // Show a notification to the user that there's an update available
        if (confirm('New content available. Reload?')) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        // Show a notification that the app is ready for offline use
        console.log('App ready to work offline');
        // You could show a toast notification here
      },
    });
  }
};
