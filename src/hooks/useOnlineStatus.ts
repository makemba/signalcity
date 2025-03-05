
import { useState, useEffect, useCallback } from 'react';

interface OnlineStatusOptions {
  /**
   * L'URL à pinger pour vérifier la connexion internet
   */
  pingUrl?: string;
  /**
   * L'intervalle de ping en millisecondes
   */
  pingInterval?: number;
  /**
   * Le délai de ping en millisecondes
   */
  pingTimeout?: number;
  /**
   * Si true, effectue des pings réguliers même si le navigateur indique que l'utilisateur est en ligne
   */
  alwaysPing?: boolean;
}

/**
 * Hook personnalisé pour suivre l'état de la connexion internet
 * @param options Options de configuration
 * @returns Statut de la connexion (true = en ligne, false = hors ligne)
 */
export function useOnlineStatus(options: OnlineStatusOptions = {}) {
  const {
    pingUrl = 'https://www.google.com/favicon.ico',
    pingInterval = 30000, // 30 secondes
    pingTimeout = 5000,   // 5 secondes
    alwaysPing = false,
  } = options;

  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' && 'onLine' in navigator 
      ? navigator.onLine 
      : true
  );
  
  const [lastPingStatus, setLastPingStatus] = useState<boolean | null>(null);
  const [lastPingTime, setLastPingTime] = useState<Date | null>(null);

  // Fonction de ping pour vérifier la connexion internet
  const checkConnection = useCallback(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), pingTimeout);
      
      const startTime = new Date();
      const response = await fetch(pingUrl, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: controller.signal,
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
      });
      
      clearTimeout(timeoutId);
      setLastPingTime(new Date());
      
      // Si nous avons reçu une réponse, nous sommes en ligne
      setLastPingStatus(true);
      setIsOnline(true);
    } catch (error) {
      setLastPingTime(new Date());
      
      // Si nous avons une erreur d'avortement, c'est probablement un délai d'attente
      if ((error as Error).name === 'AbortError') {
        setLastPingStatus(false);
        // Ne définissez pas isOnline à false uniquement sur la base d'un ping échoué
        // à moins que nous ne soyons déjà hors ligne selon l'API du navigateur
        if (!navigator.onLine) {
          setIsOnline(false);
        }
      } else {
        // Toute autre erreur pourrait être due à des restrictions CORS,
        // donc nous ne changeons pas nécessairement l'état en ligne
        console.warn('Erreur lors de la vérification de la connexion (cela pourrait être normal):', error);
      }
    }
  }, [pingUrl, pingTimeout]);

  useEffect(() => {
    // Vérifier la connexion au montage
    if (alwaysPing) {
      checkConnection();
    }
    
    const handleOnline = () => {
      setIsOnline(true);
      // Vérifier si nous sommes vraiment en ligne avec un ping
      checkConnection();
    };
    
    const handleOffline = () => {
      setIsOnline(false);
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Configurer un intervalle pour vérifier périodiquement la connexion
    let intervalId: number | undefined;
    
    if (alwaysPing || !navigator.onLine) {
      intervalId = window.setInterval(checkConnection, pingInterval);
    }
    
    // Vérifier également la connexion lorsque l'onglet redevient actif
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkConnection();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (intervalId !== undefined) {
        clearInterval(intervalId);
      }
    };
  }, [checkConnection, alwaysPing, pingInterval]);

  return isOnline;
}

// Exporter également des versions avancées du hook
export function useDetailedOnlineStatus(options: OnlineStatusOptions = {}) {
  const isOnline = useOnlineStatus(options);
  const [lastChangeTime, setLastChangeTime] = useState<Date | null>(null);
  
  useEffect(() => {
    setLastChangeTime(new Date());
  }, [isOnline]);
  
  return {
    isOnline,
    lastChangeTime,
    isNetworkConnected: typeof navigator !== 'undefined' && 'onLine' in navigator ? navigator.onLine : true,
  };
}
