
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Wifi, CheckCircle, XCircle, AlertTriangle, CloudSync } from "lucide-react";
import { getOfflineIncidents, OfflineIncident, removeOfflineIncident, markIncidentAsSynced } from "@/services/offlineStorage";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

export default function SyncIncidents() {
  const [offlineIncidents, setOfflineIncidents] = useState<OfflineIncident[]>([]);
  const [syncingIncidents, setSyncingIncidents] = useState<Record<string, boolean>>({});
  const [syncResults, setSyncResults] = useState<Record<string, { success: boolean; message: string }>>({});
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOfflineIncidents();
  }, []);

  const loadOfflineIncidents = () => {
    const incidents = getOfflineIncidents();
    setOfflineIncidents(incidents.filter(inc => inc.pendingUpload));
  };

  const handleSyncIncident = async (incident: OfflineIncident) => {
    try {
      setSyncingIncidents(prev => ({ ...prev, [incident.offlineId]: true }));

      // Convert the metadata object to a JSON string if it's not already a string
      let metadataJson;
      if (typeof incident.metadata === 'object') {
        metadataJson = JSON.stringify(incident.metadata);
      } else {
        metadataJson = incident.metadata;
      }

      // Create the upload payload
      const uploadPayload = {
        category_id: incident.categoryId,
        description: incident.description,
        location_lat: incident.location.lat,
        location_lng: incident.location.lng,
        status: incident.status,
        metadata: metadataJson
      };

      // Upload to Supabase
      const { data, error } = await supabase
        .from("incidents")
        .insert(uploadPayload)
        .select("id")
        .single();

      if (error) {
        throw error;
      }

      // Upload was successful
      markIncidentAsSynced(incident.offlineId);
      setSyncResults(prev => ({
        ...prev,
        [incident.offlineId]: { success: true, message: `Synchronisé avec l'ID: ${data.id}` }
      }));

      toast.success("Incident synchronisé avec succès", {
        description: `L'incident a été synchronisé avec l'ID: ${data.id}`
      });

      // After a successful sync, remove the incident from the list or mark it as synced
      loadOfflineIncidents();
    } catch (error) {
      console.error("Erreur lors de la synchronisation:", error);
      setSyncResults(prev => ({
        ...prev,
        [incident.offlineId]: { success: false, message: `Erreur: ${(error as Error).message}` }
      }));

      toast.error("Erreur de synchronisation", {
        description: (error as Error).message
      });
    } finally {
      setSyncingIncidents(prev => ({ ...prev, [incident.offlineId]: false }));
    }
  };

  const handleSyncAll = async () => {
    if (offlineIncidents.length === 0) return;

    setIsSyncingAll(true);
    let successCount = 0;
    let errorCount = 0;

    for (const incident of offlineIncidents) {
      if (!syncResults[incident.offlineId]?.success) {
        try {
          await handleSyncIncident(incident);
          successCount++;
        } catch (error) {
          errorCount++;
        }
      }
    }

    setIsSyncingAll(false);
    toast(
      successCount > 0 ? "Synchronisation terminée" : "Échec de la synchronisation",
      {
        description: `${successCount} incident(s) synchronisé(s) avec succès. ${errorCount} échec(s).`
      }
    );
  };

  const handleDeleteIncident = (offlineId: string) => {
    try {
      removeOfflineIncident(offlineId);
      toast.success("Incident supprimé", {
        description: "L'incident a été supprimé de la file d'attente."
      });
      loadOfflineIncidents();
    } catch (error) {
      toast.error("Erreur", {
        description: "Impossible de supprimer l'incident."
      });
    }
  };

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Synchronisation des incidents</h1>
            <p className="text-gray-600">
              {offlineIncidents.length} incident(s) en attente de synchronisation.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
            >
              Retour
            </Button>
            <Button
              onClick={handleSyncAll}
              disabled={isSyncingAll || offlineIncidents.length === 0}
            >
              {isSyncingAll ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Synchronisation...
                </>
              ) : (
                <>
                  <CloudSync className="h-4 w-4 mr-2" />
                  Tout synchroniser
                </>
              )}
            </Button>
          </div>
        </div>

        {offlineIncidents.length === 0 ? (
          <div className="text-center py-10">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Tous synchronisés!</h2>
            <p className="text-gray-600 mb-6">
              Tous vos incidents ont été synchronisés avec succès.
            </p>
            <Button onClick={() => navigate("/")}>
              Retour à l'accueil
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {offlineIncidents.map((incident) => (
              <div
                key={incident.offlineId}
                className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-lg">
                      {incident.description?.substring(0, 50)}
                      {incident.description && incident.description.length > 50 ? "..." : ""}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">
                      Créé {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                  <Badge variant={incident.status === "PENDING" ? "outline" : "secondary"}>
                    {incident.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
                  <div>
                    <span className="font-medium">Catégorie:</span> {incident.categoryId}
                  </div>
                  <div>
                    <span className="font-medium">Localisation:</span>{" "}
                    {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
                  </div>
                </div>

                {syncResults[incident.offlineId] && (
                  <div
                    className={`p-2 mb-4 text-sm rounded-md ${
                      syncResults[incident.offlineId].success
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }`}
                  >
                    <div className="flex items-center">
                      {syncResults[incident.offlineId].success ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      {syncResults[incident.offlineId].message}
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteIncident(incident.offlineId)}
                    disabled={syncingIncidents[incident.offlineId]}
                  >
                    Supprimer
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSyncIncident(incident)}
                    disabled={syncingIncidents[incident.offlineId]}
                  >
                    {syncingIncidents[incident.offlineId] ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Synchronisation...
                      </>
                    ) : (
                      <>
                        <Wifi className="h-4 w-4 mr-2" />
                        Synchroniser
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
