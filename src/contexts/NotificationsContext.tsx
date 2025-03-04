
/* 
  Ce fichier gère le système de notifications de l'application, y compris:
  - Les notifications push via l'API Notifications Web
  - L'abonnement aux notifications pour les incidents
  - La gestion des préférences de notification par utilisateur
*/

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NotificationsContextProps {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  isPushEnabled: boolean;
  requestPushPermission: () => Promise<boolean>;
  subscribeTo: (incidentId: number) => Promise<void>;
  unsubscribeFrom: (incidentId: number) => Promise<void>;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: string;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isPushEnabled, setIsPushEnabled] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // Charger les notifications au démarrage
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching notifications:', error);
          return;
        }

        const formattedNotifications = data.map(item => ({
          id: item.id,
          title: item.title,
          message: item.message,
          createdAt: item.created_at,
          read: item.read,
          type: item.type
        }));

        setNotifications(formattedNotifications);
        setUnreadCount(formattedNotifications.filter(n => !n.read).length);
      } catch (error) {
        console.error('Failed to load notifications:', error);
      }
    };

    loadNotifications();
    checkPushPermission();

    // S'abonner aux mises à jour de notifications en temps réel
    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        (payload) => {
          const newNotification = {
            id: payload.new.id,
            title: payload.new.title,
            message: payload.new.message,
            createdAt: payload.new.created_at,
            read: payload.new.read,
            type: payload.new.type
          };
          
          setNotifications(prev => [newNotification, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Afficher une notification toast
          toast({
            title: newNotification.title,
            description: newNotification.message,
            duration: 5000,
          });

          // Envoyer une notification push si activé
          if (isPushEnabled && subscription) {
            sendPushNotification(
              subscription, 
              newNotification.title, 
              newNotification.message
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isPushEnabled, subscription]);

  // Vérifier si les notifications push sont disponibles et activées
  const checkPushPermission = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.log('Push notifications not supported');
      return false;
    }

    try {
      const permission = Notification.permission;
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const existingSubscription = await registration.pushManager.getSubscription();
        
        if (existingSubscription) {
          setSubscription(existingSubscription);
          setIsPushEnabled(true);
          return true;
        }
      }
      
      setIsPushEnabled(false);
      return false;
    } catch (error) {
      console.error('Error checking push permission:', error);
      setIsPushEnabled(false);
      return false;
    }
  }, []);

  // Demander l'autorisation pour les notifications push
  const requestPushPermission = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      toast.error("Les notifications push ne sont pas supportées par votre navigateur");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // Enregistrer le service worker si nécessaire
        const registration = await navigator.serviceWorker.ready;
        
        // Créer un abonnement push
        const subscriptionOptions = {
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
          )
        };
        
        const newSubscription = await registration.pushManager.subscribe(subscriptionOptions);
        setSubscription(newSubscription);
        setIsPushEnabled(true);
        
        // Ici, vous devriez normalement envoyer l'abonnement à votre serveur
        // pour pouvoir envoyer des notifications plus tard
        console.log('Push subscription successful:', newSubscription);
        
        return true;
      } else {
        toast.error("L'autorisation pour les notifications a été refusée");
        setIsPushEnabled(false);
        return false;
      }
    } catch (error) {
      console.error('Error requesting push permission:', error);
      toast.error("Erreur lors de l'activation des notifications push");
      setIsPushEnabled(false);
      return false;
    }
  };

  // Fonction pour s'abonner aux notifications d'un incident
  const subscribeTo = async (incidentId: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour vous abonner");
        return;
      }

      // Récupérer l'incident actuel
      const { data: incidentData, error: incidentError } = await supabase
        .from('incidents')
        .select('metadata')
        .eq('id', incidentId)
        .single();

      if (incidentError) {
        console.error('Error fetching incident:', incidentError);
        toast.error("Erreur lors de l'abonnement");
        return;
      }

      // Préparer les données de metadata mises à jour
      const metadata = incidentData.metadata || {};
      let subscribers = metadata.subscribers || [];
      
      // Vérifier si l'utilisateur est déjà abonné
      if (Array.isArray(subscribers) && !subscribers.includes(session.user.id)) {
        subscribers.push(session.user.id);
      } else if (!Array.isArray(subscribers)) {
        subscribers = [session.user.id];
      }

      // Mettre à jour l'incident avec le nouvel abonné
      const { error: updateError } = await supabase
        .from('incidents')
        .update({
          metadata: {
            ...metadata,
            subscribers
          }
        })
        .eq('id', incidentId);

      if (updateError) {
        console.error('Error subscribing to incident:', updateError);
        toast.error("Erreur lors de l'abonnement");
        return;
      }

      toast.success("Vous êtes maintenant abonné aux mises à jour de cet incident");
    } catch (error) {
      console.error('Error in subscribeTo:', error);
      toast.error("Une erreur s'est produite lors de l'abonnement");
    }
  };

  // Fonction pour se désabonner des notifications d'un incident
  const unsubscribeFrom = async (incidentId: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Vous devez être connecté pour vous désabonner");
        return;
      }

      // Récupérer l'incident actuel
      const { data: incidentData, error: incidentError } = await supabase
        .from('incidents')
        .select('metadata')
        .eq('id', incidentId)
        .single();

      if (incidentError) {
        console.error('Error fetching incident:', incidentError);
        toast.error("Erreur lors du désabonnement");
        return;
      }

      // Préparer les données de metadata mises à jour
      const metadata = incidentData.metadata || {};
      let subscribers = metadata.subscribers || [];
      
      // Vérifier si l'utilisateur est abonné
      if (Array.isArray(subscribers)) {
        subscribers = subscribers.filter(id => id !== session.user.id);
      }

      // Mettre à jour l'incident sans l'abonné
      const { error: updateError } = await supabase
        .from('incidents')
        .update({
          metadata: {
            ...metadata,
            subscribers
          }
        })
        .eq('id', incidentId);

      if (updateError) {
        console.error('Error unsubscribing from incident:', updateError);
        toast.error("Erreur lors du désabonnement");
        return;
      }

      toast.success("Vous êtes maintenant désabonné des mises à jour de cet incident");
    } catch (error) {
      console.error('Error in unsubscribeFrom:', error);
      toast.error("Une erreur s'est produite lors du désabonnement");
    }
  };

  // Fonction pour envoyer une notification push
  const sendPushNotification = async (
    subscription: PushSubscription,
    title: string,
    message: string
  ) => {
    // Cette fonction simule l'envoi d'une notification push
    // En production, cette logique devrait être sur le serveur
    console.log('Sending push notification:', { title, message, subscription });
    
    // En production, vous devriez faire une requête à votre serveur qui enverrait
    // ensuite la notification push via l'API Web Push
  };

  // Fonction pour marquer une notification comme lue
  const markAsRead = async (id: number) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Mettre à jour dans la base de données
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) {
        console.error('Error marking notification as read:', error);
        return;
      }

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Fonction pour marquer toutes les notifications comme lues
  const markAllAsRead = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      // Mettre à jour dans la base de données
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', session.user.id)
        .eq('read', false);

      if (error) {
        console.error('Error marking all notifications as read:', error);
        return;
      }

      // Mettre à jour l'état local
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Fonction utilitaire pour convertir une clé base64 en Uint8Array pour Web Push
  const urlBase64ToUint8Array = (base64String: string) => {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
  
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
  
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
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
        subscribeTo,
        unsubscribeFrom,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
