
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

type NotificationType = 'info' | 'warning' | 'success' | 'error';

type Notification = {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  created_at: string;
};

type NotificationsContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  subscribeToIncidentUpdates: (incidentId: number) => Promise<void>;
  unsubscribeFromIncidentUpdates: (incidentId: number) => Promise<void>;
  requestPushPermission: () => Promise<boolean>;
  isPushEnabled: boolean;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isPushEnabled, setIsPushEnabled] = useState<boolean>(false);
  
  console.log('NotificationsProvider rendered', { notificationsCount: notifications.length });

  useEffect(() => {
    // Vérifier si les notifications push sont déjà activées
    checkPushPermission();
    
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching notifications:', error);
        return;
      }

      // Validate and transform the notification type
      const validatedNotifications = (data || []).map(notification => ({
        ...notification,
        type: validateNotificationType(notification.type)
      })) as Notification[];

      setNotifications(validatedNotifications);
    };

    fetchNotifications();

    // Subscribe to realtime notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          console.log('Received notification update:', payload);
          
          if (payload.eventType === 'INSERT') {
            showPushNotification(payload.new);
          }
          
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Fonctions pour les notifications push
  const checkPushPermission = () => {
    if ('Notification' in window) {
      const permissionStatus = Notification.permission;
      setIsPushEnabled(permissionStatus === 'granted');
    }
  };

  const requestPushPermission = async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      toast.error('Les notifications ne sont pas supportées par votre navigateur');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === 'granted';
      setIsPushEnabled(granted);
      
      if (granted) {
        toast.success('Notifications push activées');
      } else {
        toast.error('Vous avez refusé les notifications push');
      }
      
      return granted;
    } catch (error) {
      console.error('Erreur lors de la demande de permission pour les notifications:', error);
      toast.error('Erreur lors de l\'activation des notifications');
      return false;
    }
  };

  const showPushNotification = (notification: any) => {
    if (!isPushEnabled || !('Notification' in window)) return;
    
    try {
      // Afficher la notification avec l'API Notification
      const pushNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
      
      // Optionnel: ajouter un événement de clic sur la notification
      pushNotification.onclick = () => {
        window.focus();
        pushNotification.close();
      };
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification push:', error);
    }
  };

  // Helper function to validate notification type
  const validateNotificationType = (type: string): NotificationType => {
    const validTypes: NotificationType[] = ['info', 'warning', 'success', 'error'];
    return validTypes.includes(type as NotificationType) 
      ? (type as NotificationType) 
      : 'info';
  };

  const markAsRead = async (id: number) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
      return;
    }

    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = async () => {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
      return;
    }

    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  // Fonctions pour s'abonner/désabonner aux mises à jour d'incidents
  const subscribeToIncidentUpdates = async (incidentId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Vérifier si l'incident existe
      const { data: incident, error: incidentError } = await supabase
        .from('incidents')
        .select('id')
        .eq('id', incidentId)
        .single();

      if (incidentError || !incident) {
        throw new Error('Incident introuvable');
      }

      // Obtenir les subscribers actuels (si disponible dans les métadonnées)
      const { data: metadata, error: metadataError } = await supabase
        .from('incidents')
        .select('metadata')
        .eq('id', incidentId)
        .single();

      if (metadataError) {
        throw new Error('Erreur lors de la récupération des métadonnées');
      }

      let subscribers = [];
      if (metadata && metadata.metadata && metadata.metadata.subscribers) {
        subscribers = metadata.metadata.subscribers;
        if (!Array.isArray(subscribers)) {
          subscribers = [];
        }
      }

      // Ajouter l'utilisateur s'il n'est pas déjà abonné
      if (!subscribers.includes(user.id)) {
        subscribers.push(user.id);
      }

      // Mettre à jour les métadonnées
      const updatedMetadata = {
        ...(metadata?.metadata || {}),
        subscribers
      };

      const { error: updateError } = await supabase
        .from('incidents')
        .update({ metadata: updatedMetadata })
        .eq('id', incidentId);

      if (updateError) {
        throw new Error('Erreur lors de la mise à jour des abonnements');
      }

      toast.success('Vous êtes maintenant abonné aux mises à jour de cet incident');
    } catch (error) {
      console.error('Erreur lors de l\'abonnement:', error);
      toast.error('Erreur lors de l\'abonnement');
    }
  };

  const unsubscribeFromIncidentUpdates = async (incidentId: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      // Obtenir les subscribers actuels
      const { data: metadata, error: metadataError } = await supabase
        .from('incidents')
        .select('metadata')
        .eq('id', incidentId)
        .single();

      if (metadataError) {
        throw new Error('Erreur lors de la récupération des métadonnées');
      }

      let subscribers = [];
      if (metadata && metadata.metadata && metadata.metadata.subscribers) {
        subscribers = metadata.metadata.subscribers;
        if (!Array.isArray(subscribers)) {
          subscribers = [];
        }
      }

      // Filtrer pour retirer l'utilisateur
      subscribers = subscribers.filter((id: string) => id !== user.id);

      // Mettre à jour les métadonnées
      const updatedMetadata = {
        ...(metadata?.metadata || {}),
        subscribers
      };

      const { error: updateError } = await supabase
        .from('incidents')
        .update({ metadata: updatedMetadata })
        .eq('id', incidentId);

      if (updateError) {
        throw new Error('Erreur lors de la mise à jour des abonnements');
      }

      toast.success('Vous êtes désabonné des mises à jour de cet incident');
    } catch (error) {
      console.error('Erreur lors du désabonnement:', error);
      toast.error('Erreur lors du désabonnement');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationsContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead,
      subscribeToIncidentUpdates,
      unsubscribeFromIncidentUpdates,
      requestPushPermission,
      isPushEnabled
    }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};

// Helper pour afficher les toasts
const toast = {
  success: (message: string) => {
    console.log('SUCCESS:', message);
    // Cette fonction sera remplacée lors de l'import
  },
  error: (message: string) => {
    console.error('ERROR:', message);
    // Cette fonction sera remplacée lors de l'import
  },
  info: (message: string) => {
    console.info('INFO:', message);
    // Cette fonction sera remplacée lors de l'import
  }
};
