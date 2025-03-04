
import React, { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Cloud, CheckCircle2, XCircle } from "lucide-react";
import { getOfflineIncidents, removeOfflineIncident, markIncidentAsSynced, clearOfflineIncidents } from "@/services/offlineStorage";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export default function SyncIncidents() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSync = async () => {
    setIsSyncing(true);
    setShowResults(false);
    setSyncResults({ success: 0, failed: 0 });
    
    const offlineIncidents = getOfflineIncidents().filter(incident => incident.pendingUpload);
    
    if (offlineIncidents.length === 0) {
      toast.info("Aucun incident à synchroniser");
      setIsSyncing(false);
      return;
    }
    
    let successCount = 0;
    let failedCount = 0;
    
    for (const incident of offlineIncidents) {
      try {
        // Transform offline incident to match database schema
        const dbIncident = {
          title: incident.title,
          description: incident.description,
          category_id: incident.categoryId,
          location_lat: incident.location.lat,
          location_lng: incident.location.lng,
          status: incident.status,
          created_at: incident.createdAt,
          // Add other fields as needed
        };
        
        // Upload to Supabase
        const { error } = await supabase.from("incidents").insert(dbIncident);
        
        if (error) {
          console.error("Error syncing incident:", error);
          failedCount++;
        } else {
          // Mark as synced in local storage
          markIncidentAsSynced(incident.offlineId);
          successCount++;
        }
      } catch (error) {
        console.error("Error processing incident:", error);
        failedCount++;
      }
    }
    
    setSyncResults({ success: successCount, failed: failedCount });
    setShowResults(true);
    setIsSyncing(false);
    
    if (successCount > 0) {
      toast.success(`${successCount} incident(s) synchronisé(s) avec succès`);
    }
    
    if (failedCount > 0) {
      toast.error(`Échec de la synchronisation pour ${failedCount} incident(s)`);
    }
  };

  const handleClearAll = () => {
    clearOfflineIncidents();
    toast.success("Tous les incidents hors-ligne ont été supprimés");
    navigate("/");
  };

  const offlineIncidents = getOfflineIncidents();
  const pendingCount = offlineIncidents.filter(incident => incident.pendingUpload).length;

  return (
    <DashboardShell>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Synchronisation des incidents</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Incidents hors-ligne</CardTitle>
          </CardHeader>
          <CardContent>
            {offlineIncidents.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500">Aucun incident hors-ligne à synchroniser</p>
              </div>
            ) : (
              <div className="space-y-6">
                <p>
                  Vous avez <strong>{pendingCount}</strong> incident(s) en attente de synchronisation.
                </p>
                
                {showResults && (
                  <div className="flex items-center justify-center gap-6 my-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="text-green-500 h-5 w-5" />
                      <span>Réussis: {syncResults.success}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <XCircle className="text-red-500 h-5 w-5" />
                      <span>Échoués: {syncResults.failed}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    onClick={handleSync} 
                    disabled={isSyncing || pendingCount === 0}
                    className="flex-1"
                  >
                    {isSyncing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Synchronisation...
                      </>
                    ) : (
                      <>
                        <Cloud className="mr-2 h-4 w-4" />
                        Synchroniser {pendingCount > 0 && `(${pendingCount})`}
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    onClick={handleClearAll}
                    disabled={isSyncing || offlineIncidents.length === 0}
                    className="flex-1 sm:flex-none"
                  >
                    Supprimer tous les incidents
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Button variant="outline" onClick={() => navigate("/")}>
          Retour à l'accueil
        </Button>
      </div>
    </DashboardShell>
  );
}
