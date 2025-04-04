import { useEffect, useState } from 'react';
import { isRealtimeConnected, connectToRealtime, disconnectFromRealtime } from '@/services/realtimeService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Wifi, WifiOff } from 'lucide-react';

interface RealtimeIndicatorProps {
  className?: string;
}

const RealtimeIndicator = ({ className }: RealtimeIndicatorProps) => {
  const [connected, setConnected] = useState(false);
  
  // Check connection status periodically
  useEffect(() => {
    const checkConnection = () => {
      setConnected(isRealtimeConnected());
    };
    
    // Initial check
    checkConnection();
    
    // Set up interval to check connection status
    const interval = setInterval(checkConnection, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  const handleToggleConnection = () => {
    if (connected) {
      disconnectFromRealtime();
    } else {
      connectToRealtime();
    }
    
    // Update status after a short delay to allow connection to change
    setTimeout(() => {
      setConnected(isRealtimeConnected());
    }, 500);
  };
  
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {connected ? (
              <Wifi className="h-4 w-4 text-green-500" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-500" />
            )}
            <span className="text-sm">
              {connected ? 'Connected to realtime updates' : 'Disconnected from realtime updates'}
            </span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleToggleConnection}
          >
            {connected ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealtimeIndicator;
