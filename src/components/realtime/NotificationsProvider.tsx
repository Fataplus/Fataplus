import React, { createContext, useContext, useEffect, useState } from 'react';
import { pb } from '@/integrations/pocketbase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Bell, MessageCircle, ThumbsUp, ShoppingBag } from 'lucide-react';

// Types
export interface Notification {
  id: string;
  message: string;
  type: 'post' | 'comment' | 'like' | 'order' | 'system';
  read: boolean;
  data?: any;
  created: Date;
}

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

// Create context
const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearNotifications: () => {}
});

// Provider component
export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  
  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Subscribe to notifications
  useEffect(() => {
    if (!user) return;
    
    // Subscribe to user-specific notifications
    const userSubscription = pb.collection('users').subscribe(user.id, (data) => {
      if (data.action === 'update') {
        // User data updated, check for new notifications
        if (data.record.notifications) {
          try {
            const userNotifications = JSON.parse(data.record.notifications);
            setNotifications(userNotifications);
          } catch (error) {
            console.error('Error parsing notifications:', error);
          }
        }
      }
    });
    
    // Subscribe to comments on user's posts
    pb.collection('comments').subscribe('*', (data) => {
      if (data.action === 'create' && data.record.post?.author === user.id) {
        const notification: Notification = {
          id: `comment_${data.record.id}`,
          message: `New comment on your post`,
          type: 'comment',
          read: false,
          data: data.record,
          created: new Date()
        };
        
        setNotifications(prev => [notification, ...prev]);
        
        toast({
          title: 'New Comment',
          description: notification.message,
          duration: 5000
        });
      }
    });
    
    // Subscribe to likes on user's posts
    pb.collection('likes').subscribe('*', (data) => {
      if (data.action === 'create' && data.record.post?.author === user.id) {
        const notification: Notification = {
          id: `like_${data.record.id}`,
          message: `Someone liked your post`,
          type: 'like',
          read: false,
          data: data.record,
          created: new Date()
        };
        
        setNotifications(prev => [notification, ...prev]);
        
        toast({
          title: 'New Like',
          description: notification.message,
          duration: 3000
        });
      }
    });
    
    // Subscribe to order status changes
    pb.collection('orders').subscribe('*', (data) => {
      if (data.action === 'update' && data.record.user === user.id) {
        const oldStatus = data.oldRecord?.status;
        const newStatus = data.record.status;
        
        if (oldStatus !== newStatus) {
          const notification: Notification = {
            id: `order_${data.record.id}_${newStatus}`,
            message: `Your order #${data.record.id} status changed to ${newStatus}`,
            type: 'order',
            read: false,
            data: data.record,
            created: new Date()
          };
          
          setNotifications(prev => [notification, ...prev]);
          
          toast({
            title: 'Order Update',
            description: notification.message,
            duration: 5000
          });
        }
      }
    });
    
    // Fetch initial notifications
    const fetchNotifications = async () => {
      try {
        const userData = await pb.collection('users').getOne(user.id);
        
        if (userData.notifications) {
          try {
            const userNotifications = JSON.parse(userData.notifications);
            setNotifications(userNotifications);
          } catch (error) {
            console.error('Error parsing notifications:', error);
          }
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };
    
    fetchNotifications();
    
    // Cleanup
    return () => {
      pb.collection('users').unsubscribe(user.id);
      pb.collection('comments').unsubscribe();
      pb.collection('likes').unsubscribe();
      pb.collection('orders').unsubscribe();
    };
  }, [user, toast]);
  
  // Save notifications to user record
  useEffect(() => {
    if (!user || notifications.length === 0) return;
    
    const saveNotifications = async () => {
      try {
        await pb.collection('users').update(user.id, {
          notifications: JSON.stringify(notifications)
        });
      } catch (error) {
        console.error('Error saving notifications:', error);
      }
    };
    
    // Debounce to avoid too many updates
    const timeoutId = setTimeout(saveNotifications, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [notifications, user]);
  
  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };
  
  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
  };
  
  return (
    <NotificationsContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        clearNotifications 
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

// Hook to use notifications
export const useNotifications = () => useContext(NotificationsContext);

// Notification icon component
export const NotificationIcon: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  switch (type) {
    case 'post':
      return <Bell className="h-4 w-4" />;
    case 'comment':
      return <MessageCircle className="h-4 w-4" />;
    case 'like':
      return <ThumbsUp className="h-4 w-4" />;
    case 'order':
      return <ShoppingBag className="h-4 w-4" />;
    default:
      return <Bell className="h-4 w-4" />;
  }
};
