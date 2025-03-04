
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Bell } from 'lucide-react';
import type { Notification, DatabaseNotification } from '@/types/notification';

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  isPushEnabled: boolean;
  togglePushNotifications: () => void;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider: React.FC<NotificationsProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(
    localStorage.getItem('pushNotificationsEnabled') === 'true'
  );

  const unreadCount = notifications.filter(notification => !notification.read).length;

  useEffect(() => {
    // Fetch notifications when the component mounts
    fetchNotifications();

    // Set up a real-time subscription
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log('Notification change received:', payload);
          fetchNotifications();
          
          // Show toast for new notifications
          if (payload.eventType === 'INSERT') {
            showNotificationToast(payload.new as DatabaseNotification);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert DatabaseNotification to Notification
      const formattedNotifications: Notification[] = (data as DatabaseNotification[]).map(item => ({
        id: item.id,
        title: item.title,
        message: item.message,
        type: item.type as 'info' | 'warning' | 'success' | 'error',
        read: item.read,
        createdAt: item.created_at,
        user_id: item.user_id
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const showNotificationToast = (notification: DatabaseNotification) => {
    if (isPushEnabled) {
      toast(notification.title, {
        description: notification.message,
        icon: <Bell className="h-4 w-4" />,
      });
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notifications.filter(n => !n.read).map(n => n.id));

      if (error) throw error;

      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const addNotification = async (notification: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .insert([
          {
            title: notification.title,
            message: notification.message,
            type: notification.type,
            read: false
          }
        ]);

      if (error) throw error;
      
      // The real-time subscription will update the notifications
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setNotifications(prev => prev.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const togglePushNotifications = () => {
    const newState = !isPushEnabled;
    setIsPushEnabled(newState);
    localStorage.setItem('pushNotificationsEnabled', String(newState));
    
    toast(newState ? 'Notifications activées' : 'Notifications désactivées', {
      description: newState 
        ? 'Vous recevrez des notifications en temps réel' 
        : 'Vous ne recevrez plus de notifications en temps réel',
      icon: <Bell className="h-4 w-4" />,
    });
  };

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    isPushEnabled,
    togglePushNotifications
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
