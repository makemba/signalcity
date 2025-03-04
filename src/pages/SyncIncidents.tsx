
import React, { useEffect, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cloud, RefreshCw, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getOfflineIncidents, clearOfflineIncidents } from "@/services/offlineStorage";

const SyncIncidents: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncedCount, setSyncedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [offlineIncidentsCount, setOfflineIncidentsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOfflineIncidentsCount = async () => {
      const incidents = await getOfflineIncidents();
      setOfflineIncidentsCount(incidents.length);
    };

    fetchOfflineIncidentsCount();
  }, []);

  const syncIncidents = async () => {
    setIsSyncing(true);
    setError(null);
    setSyncedCount(0);

    try {
      const offlineIncidents = await getOfflineIncidents();

      if (offlineIncidents.length === 0) {
        toast.info("Aucun incident hors ligne à synchroniser.");
        return;
      }

      let successCount = 0;
      
      for (const incident of offlineIncidents) {
        // Transform offline incident to match database schema
        const incidentData = {
          category_id: incident.categoryId || incident.category || '',
          description: incident.description || '',
          location_lat: 0,
          location_lng: 0,
          status: incident.status || 'PENDING',
          created_at: incident.createdAt || new Date().toISOString(),
          title: incident.title || '',
          // Add other required fields
        };
        
        // Parse location if available
        if (incident.location) {
          try {
            if (typeof incident.location === 'string') {
              const [lat, lng] = incident.location.split(',').map(coord => parseFloat(coord.trim()));
              incidentData.location_lat = lat;
              incidentData.location_lng = lng;
            } else if (typeof incident.location === 'object' && incident.location !== null) {
              incidentData.location_lat = incident.location.lat || 0;
              incidentData.location_lng = incident.location.lng || 0;
            }
          } catch (e) {
            console.error('Error parsing location:', e);
          }
        }

        const { data, error } = await supabase
          .from("incidents")
          .insert([incidentData]);

        if (error) {
          console.error("Erreur lors de la synchronisation de l'incident:", error);
          setError("Erreur lors de la synchronisation des incidents. Veuillez réessayer.");
          break;
        } else {
          successCount++;
          setSyncedCount(successCount);
        }
      }

      if (successCount > 0) {
        await clearOfflineIncidents();
        toast.success("Incidents synchronisés avec succès !");
        navigate("/");
      }
    } catch (err) {
      console.error("Erreur lors de la synchronisation des incidents:", err);
      setError("Erreur inattendue lors de la synchronisation. Veuillez réessayer.");
    } finally {
      setIsSyncing(false);
      const incidents = await getOfflineIncidents();
      setOfflineIncidentsCount(incidents.length);
    }
  };

  return (
    <DashboardShell>
      <div className="container mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cloud className="mr-2 h-5 w-5" />
              Synchronisation des incidents hors ligne
            </CardTitle>
            <CardDescription>
              Synchronisez les incidents enregistrés hors ligne avec la base de données en ligne.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Erreur
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <p>Nombre d'incidents hors ligne :</p>
              <span className="font-medium">{offlineIncidentsCount}</span>
            </div>

            <Button
              onClick={syncIncidents}
              disabled={isSyncing || offlineIncidentsCount === 0}
            >
              {isSyncing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Synchronisation...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Synchroniser maintenant
                </>
              )}
            </Button>

            {syncedCount > 0 && (
              <div className="rounded-md bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Succès
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      <p>{syncedCount} incidents synchronisés avec succès.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
};

export default SyncIncidents;
