
import { useEffect, useState } from 'react';
import { CloudOff, CloudCheck, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { countPendingIncidents } from '@/services/offlineStorage';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState<number>(0);
  
  useEffect(() => {
    const checkPendingIncidents = () => {
      const count = countPendingIncidents();
      setPendingCount(count);
    };
    
    checkPendingIncidents();
    
    // Check when app comes back online
    const handleOnline = () => {
      checkPendingIncidents();
      if (countPendingIncidents() > 0) {
        toast.info('Connexion rétablie', {
          description: 'Vous pouvez maintenant synchroniser vos signalements'
        });
      } else {
        toast.success('Connexion rétablie');
      }
    };
    
    // Notify when app goes offline
    const handleOffline = () => {
      toast.warning('Mode hors connexion activé', {
        description: 'Vos signalements seront enregistrés localement'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  
  const navigateToSync = () => {
    window.location.href = '/sync-incidents';
  };
  
  if (!isOnline || pendingCount > 0) {
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className={`fixed top-0 left-0 right-0 z-50 px-4 py-2 text-sm font-medium 
            ${!isOnline ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}
        >
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {!isOnline ? (
                <>
                  <CloudOff className="h-4 w-4" />
                  <span>Mode hors connexion. Vos signalements seront enregistrés localement.</span>
                </>
              ) : pendingCount > 0 ? (
                <>
                  <Upload className="h-4 w-4" />
                  <span>Vous avez {pendingCount} signalement{pendingCount > 1 ? 's' : ''} en attente de synchronisation.</span>
                </>
              ) : (
                <>
                  <CloudCheck className="h-4 w-4" />
                  <span>Connecté</span>
                </>
              )}
            </div>
            
            {isOnline && pendingCount > 0 && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white" 
                onClick={navigateToSync}
              >
                Synchroniser
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    );
  }
  
  return null;
}
