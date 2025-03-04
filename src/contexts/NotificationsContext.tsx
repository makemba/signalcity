
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Bell } from 'lucide-react';
import { Notification } from '@/types/notification';

interface NotificationsContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  isPushEnabled: boolean;
  requestPushPermission: () => Promise<boolean>;
  pushSubscription: PushSubscription | null;
}

const NotificationsContext = createContext<NotificationsContextType>({
  notifications: [],
  unreadCount: 0,
  markAsRead: () => {},
  markAllAsRead: () => {},
  isPushEnabled: false,
  requestPushPermission: async () => false,
  pushSubscription: null,
});

export const useNotifications = () => useContext(NotificationsContext);

interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationsProvider = ({ children }: NotificationsProviderProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [pushSubscription, setPushSubscription] = useState<PushSubscription | null>(null);

  // Initialize notifications
  useEffect(() => {
    loadNotifications();

    // Check if push notifications are already enabled
    checkPushEnabled();

    // Subscribe to notifications table changes
    const subscription = supabase
      .channel('notifications-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'notifications' }, 
        payload => {
          handleNewNotification(payload.new as Notification);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('createdAt', { ascending: false })
        .limit(20);

      if (error) throw error;

      if (data) {
        setNotifications(data as Notification[]);
        setUnreadCount(data.filter(notification => !notification.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  const handleNewNotification = (notification: Notification) => {
    setNotifications(prev => [notification, ...prev].slice(0, 20));
    setUnreadCount(prev => prev + 1);

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    });

    // Show push notification if enabled
    if (isPushEnabled && pushSubscription) {
      sendPushNotification(notification);
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
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const notificationIds = notifications
        .filter(notification => !notification.read)
        .map(notification => notification.id);

      if (notificationIds.length === 0) return;

      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .in('id', notificationIds);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const checkPushEnabled = async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setIsPushEnabled(false);
        return;
      }

      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        setIsPushEnabled(false);
        return;
      }

      const subscription = await registration.pushManager.getSubscription();
      setIsPushEnabled(!!subscription);
      setPushSubscription(subscription);
    } catch (error) {
      console.error('Error checking push notifications:', error);
      setIsPushEnabled(false);
    }
  };

  const requestPushPermission = async (): Promise<boolean> => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        toast.error('Votre navigateur ne supporte pas les notifications push');
        return false;
      }

      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        toast.error('Permissions de notification refusées');
        return false;
      }

      // Register service worker if not already registered
      let registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        registration = await navigator.serviceWorker.register('/service-worker.js');
      }

      // Get or create push subscription
      const existingSubscription = await registration.pushManager.getSubscription();
      if (existingSubscription) {
        setPushSubscription(existingSubscription);
        setIsPushEnabled(true);
        return true;
      }

      try {
        // This would be a VAPID public key in a real implementation
        const applicationServerKey = new Uint8Array([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
        
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: applicationServerKey,
        });
        
        setPushSubscription(subscription);
        setIsPushEnabled(true);
        
        // In a real app, you would send this subscription to your server
        // await sendSubscriptionToServer(subscription);
        
        return true;
      } catch (error) {
        console.error('Error subscribing to push notifications:', error);
        toast.error("Erreur lors de l'activation des notifications push");
        return false;
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
      toast.error("Erreur lors de la demande d'autorisation de notifications");
      return false;
    }
  };

  const sendPushNotification = (notification: Notification) => {
    // In a real app, this would be done server-side
    // This is a mock implementation since we can't actually send push notifications from client-side
    console.log('Would send push notification:', notification);
    
    try {
      // For demonstration, we'll use the standard Notification API instead
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        isPushEnabled,
        requestPushPermission,
        pushSubscription,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};
