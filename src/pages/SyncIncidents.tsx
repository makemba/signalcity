
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CloudSyncIcon, Check, AlertTriangle, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DashboardShell } from '@/components/DashboardShell';
import { toast } from 'sonner';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { getOfflineIncidents, removeOfflineIncident, markIncidentAsSynced, OfflineIncident } from '@/services/offlineStorage';

export default function SyncIncidents() {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [offlineIncidents, setOfflineIncidents] = useState<OfflineIncident[]>([]);
  const [syncStatus, setSyncStatus] = useState<Record<string, 'pending' | 'success' | 'error'>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  
  useEffect(() => {
    document.title = 'Synchronisation | Incident Signal';
    loadOfflineIncidents();
  }, []);
  
  const loadOfflineIncidents = () => {
    const incidents = getOfflineIncidents();
    setOfflineIncidents(incidents.filter(inc => inc.pendingUpload));
    
    // Initialize sync status
    const initialStatus: Record<string, 'pending' | 'success' | 'error'> = {};
    incidents.forEach(inc => {
      if (inc.pendingUpload) {
        initialStatus[inc.offlineId] = 'pending';
      }
    });
    setSyncStatus(initialStatus);
  };
  
  const syncIncident = async (incident: OfflineIncident) => {
    if (!isOnline) {
      toast.error('Vous êtes hors ligne. Veuillez vous reconnecter pour synchroniser.');
      return;
    }
    
    try {
      setSyncStatus(prev => ({ ...prev, [incident.offlineId]: 'pending' }));
      
      // Extract location data
      let locationLat = 0;
      let locationLng = 0;
      
      if (typeof incident.location === 'object' && incident.location) {
        locationLat = incident.location.lat;
        locationLng = incident.location.lng;
      }
      
      // Prepare incident data for upload
      const incidentData = {
        category_id: incident.categoryId,
        description: incident.description,
        location_lat: locationLat,
        location_lng: locationLng,
        status: "PENDING",
        metadata: incident.metadata || null
      };
      
      // Insert into Supabase
      const { data, error } = await supabase
        .from('incidents')
        .insert(incidentData)
        .select()
        .single();
        
      if (error) throw error;
      
      // Handle attachments if any
      if (incident.attachments && incident.attachments.length > 0) {
        // We can't actually upload the files from local storage due to limitations
        // In a real app, we'd need to store the actual files and not just metadata
        console.log('Would upload attachments for incident:', data.id);
      }
      
      // Mark as synced
      markIncidentAsSynced(incident.offlineId);
      setSyncStatus(prev => ({ ...prev, [incident.offlineId]: 'success' }));
      
      // Refresh the list
      setTimeout(() => {
        loadOfflineIncidents();
      }, 1000);
      
    } catch (error) {
      console.error('Error syncing incident:', error);
      setSyncStatus(prev => ({ ...prev, [incident.offlineId]: 'error' }));
    }
  };
  
  const deleteOfflineIncident = (offlineId: string) => {
    try {
      removeOfflineIncident(offlineId);
      loadOfflineIncidents();
      toast.success('Signalement supprimé');
    } catch (error) {
      console.error('Error deleting incident:', error);
      toast.error('Erreur lors de la suppression');
    }
  };
  
  const syncAllIncidents = async () => {
    if (!isOnline) {
      toast.error('Vous êtes hors ligne. Veuillez vous reconnecter pour synchroniser.');
      return;
    }
    
    setIsSyncing(true);
    
    try {
      // Process incidents one by one
      for (const incident of offlineIncidents) {
        await syncIncident(incident);
      }
      
      toast.success('Synchronisation terminée');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error in sync all:', error);
      toast.error('Erreur lors de la synchronisation');
    } finally {
      setIsSyncing(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  return (
    <DashboardShell>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Synchronisation des signalements</h1>
              {offlineIncidents.length > 0 && (
                <Button 
                  onClick={syncAllIncidents} 
                  disabled={!isOnline || isSyncing}
                  className="flex items-center gap-2"
                >
                  {isSyncing ? (
                    <>
                      <div className="animate-spin h-4 w-4">
                        <CloudSyncIcon className="h-4 w-4" />
                      </div>
                      Synchronisation...
                    </>
                  ) : (
                    <>
                      <CloudSyncIcon className="h-4 w-4" />
                      Tout synchroniser
                    </>
                  )}
                </Button>
              )}
            </div>
            
            {!isOnline && (
              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="h-5 w-5" />
                    <p>Vous êtes actuellement hors ligne. Connectez-vous à Internet pour synchroniser vos signalements.</p>
                  </div>
                </CardContent>
              </Card>
            )}
            
            {offlineIncidents.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <div className="flex flex-col items-center gap-4">
                    <Check className="h-12 w-12 text-green-500" />
                    <div>
                      <h3 className="text-xl font-medium mb-2">Aucun signalement en attente</h3>
                      <p className="text-gray-500">Tous vos signalements sont synchronisés</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate('/')}>
                      Retour à l'accueil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {offlineIncidents.map((incident) => (
                  <Card key={incident.offlineId} className="overflow-hidden">
                    <div className={`h-1 ${
                      syncStatus[incident.offlineId] === 'success' ? 'bg-green-500' :
                      syncStatus[incident.offlineId] === 'error' ? 'bg-red-500' :
                      'bg-gray-200'
                    }`} />
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {incident.categoryId === 'noise' ? 'Nuisance sonore' : 
                             incident.categoryId === 'security' ? 'Problème de sécurité' : 
                             incident.categoryId === 'maintenance' ? 'Maintenance' : 
                             'Incident'}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            Créé le {formatDate(incident.createdAt)}
                          </p>
                          {incident.description && (
                            <p className="text-sm mt-2 line-clamp-2">{incident.description}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-500"
                            onClick={() => deleteOfflineIncident(incident.offlineId)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            disabled={!isOnline || syncStatus[incident.offlineId] === 'success'}
                            onClick={() => syncIncident(incident)}
                          >
                            {syncStatus[incident.offlineId] === 'success' ? (
                              <>
                                <Check className="h-4 w-4 mr-1" />
                                Synchronisé
                              </>
                            ) : syncStatus[incident.offlineId] === 'error' ? (
                              'Réessayer'
                            ) : (
                              'Synchroniser'
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
