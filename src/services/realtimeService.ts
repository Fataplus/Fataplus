import { pb } from '@/integrations/pocketbase/client';
import { toast } from '@/components/ui/use-toast';
import { useEffect, useState } from 'react';

// Types for realtime events
export type RealtimeEvent = {
  action: 'create' | 'update' | 'delete';
  record: any;
  collection: string;
};

export type RealtimeSubscription = {
  collection: string;
  callback: (event: RealtimeEvent) => void;
};

// Custom hook for subscribing to realtime updates
export const useRealtimeSubscription = (
  subscription: RealtimeSubscription | RealtimeSubscription[]
) => {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Handle connection status changes
    const handleConnectionChange = (status: boolean) => {
      setIsConnected(status);
      
      if (status) {
        toast({
          title: 'Connected to realtime updates',
          description: 'You will now receive live updates.',
          duration: 3000
        });
      } else {
        toast({
          title: 'Disconnected from realtime updates',
          description: 'You may miss some updates. Trying to reconnect...',
          variant: 'destructive',
          duration: 5000
        });
      }
    };

    // Subscribe to connection status changes
    pb.realtime.subscribe('$connection', (status) => {
      handleConnectionChange(status === 'connected');
    });

    // Initial connection status
    setIsConnected(pb.realtime.isConnected);

    // Subscribe to collections
    const subscriptions = Array.isArray(subscription) ? subscription : [subscription];
    
    subscriptions.forEach(sub => {
      try {
        pb.collection(sub.collection).subscribe('*', (data) => {
          const event: RealtimeEvent = {
            action: data.action,
            record: data.record,
            collection: sub.collection
          };
          
          sub.callback(event);
        });
      } catch (err) {
        console.error(`Error subscribing to ${sub.collection}:`, err);
        setError(err instanceof Error ? err : new Error(String(err)));
      }
    });

    // Cleanup function
    return () => {
      subscriptions.forEach(sub => {
        try {
          pb.collection(sub.collection).unsubscribe();
        } catch (err) {
          console.error(`Error unsubscribing from ${sub.collection}:`, err);
        }
      });
      
      pb.realtime.unsubscribe('$connection');
    };
  }, [subscription]);

  return { isConnected, error };
};

// Function to manually connect to realtime updates
export const connectToRealtime = () => {
  if (!pb.realtime.isConnected) {
    pb.realtime.connect();
    return true;
  }
  return false;
};

// Function to manually disconnect from realtime updates
export const disconnectFromRealtime = () => {
  if (pb.realtime.isConnected) {
    pb.realtime.disconnect();
    return true;
  }
  return false;
};

// Function to check if realtime is connected
export const isRealtimeConnected = () => {
  return pb.realtime.isConnected;
};

// Function to subscribe to a collection
export const subscribeToCollection = (
  collection: string,
  callback: (event: RealtimeEvent) => void
) => {
  try {
    pb.collection(collection).subscribe('*', (data) => {
      const event: RealtimeEvent = {
        action: data.action,
        record: data.record,
        collection
      };
      
      callback(event);
    });
    return true;
  } catch (err) {
    console.error(`Error subscribing to ${collection}:`, err);
    return false;
  }
};

// Function to unsubscribe from a collection
export const unsubscribeFromCollection = (collection: string) => {
  try {
    pb.collection(collection).unsubscribe();
    return true;
  } catch (err) {
    console.error(`Error unsubscribing from ${collection}:`, err);
    return false;
  }
};

// Function to subscribe to a specific record
export const subscribeToRecord = (
  collection: string,
  recordId: string,
  callback: (event: RealtimeEvent) => void
) => {
  try {
    pb.collection(collection).subscribe(recordId, (data) => {
      const event: RealtimeEvent = {
        action: data.action,
        record: data.record,
        collection
      };
      
      callback(event);
    });
    return true;
  } catch (err) {
    console.error(`Error subscribing to record ${recordId} in ${collection}:`, err);
    return false;
  }
};

// Function to unsubscribe from a specific record
export const unsubscribeFromRecord = (collection: string, recordId: string) => {
  try {
    pb.collection(collection).unsubscribe(recordId);
    return true;
  } catch (err) {
    console.error(`Error unsubscribing from record ${recordId} in ${collection}:`, err);
    return false;
  }
};
