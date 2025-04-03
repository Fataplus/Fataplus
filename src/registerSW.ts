import { registerSW } from 'virtual:pwa-register';
import { toast } from '@/components/ui/use-toast';

// This is the service worker registration function
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    // Register the service worker
    const updateSW = registerSW({
      onNeedRefresh() {
        // Show a toast notification to the user that there's an update available
        toast({
          title: 'Update Available',
          description: 'New content is available. Click to update.',
          action: {
            label: 'Update',
            onClick: () => updateSW(true)
          },
          duration: 10000 // 10 seconds
        });
      },
      onOfflineReady() {
        // Show a notification that the app is ready for offline use
        toast({
          title: 'Offline Ready',
          description: 'FataPlus is now available offline.',
          duration: 3000
        });
      },
    });

    // Add event listeners for online/offline status
    window.addEventListener('online', () => {
      toast({
        title: 'You\'re back online',
        description: 'Internet connection restored.',
        duration: 3000
      });
    });

    window.addEventListener('offline', () => {
      toast({
        title: 'You\'re offline',
        description: 'Some features may be limited.',
        variant: 'destructive',
        duration: 3000
      });
    });

    // Register background sync for forms
    navigator.serviceWorker.ready.then((registration) => {
      if ('sync' in registration) {
        // Background sync is supported
        console.log('Background sync is supported');
      }
    });
  }
};
