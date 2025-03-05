
import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, Cloud, CheckCircle2, XCircle, AlertTriangle, ArrowLeft, Clock, FileText, Calendar, MapPin } from "lucide-react";
import { getOfflineIncidents, removeOfflineIncident, markIncidentAsSynced, clearOfflineIncidents } from "@/services/offlineStorage";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function SyncIncidents() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<{ success: number; failed: number }>({ success: 0, failed: 0 });
  const [showResults, setShowResults] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [currentIncidentIndex, setCurrentIncidentIndex] = useState(0);
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const [offlineIncidents, setOfflineIncidents] = useState(getOfflineIncidents());
  
  useEffect(() => {
    // Mettre à jour la liste des incidents hors ligne régulièrement
    const interval = setInterval(() => {
      setOfflineIncidents(getOfflineIncidents());
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const handleSync = async () => {
    if (!isOnline) {
      toast.error("Vous êtes hors ligne", {
        description: "Impossible de synchroniser les incidents sans connexion internet."
      });
      return;
    }
    
    setIsSyncing(true);
    setShowResults(false);
    setSyncResults({ success: 0, failed: 0 });
    setSyncProgress(0);
    setCurrentIncidentIndex(0);
    
    const pendingIncidents = offlineIncidents.filter(incident => incident.pendingUpload);
    
    if (pendingIncidents.length === 0) {
      toast.info("Aucun incident à synchroniser");
      setIsSyncing(false);
      return;
    }
    
    let successCount = 0;
    let failedCount = 0;
    
    for (let i = 0; i < pendingIncidents.length; i++) {
      const incident = pendingIncidents[i];
      setCurrentIncidentIndex(i);
      
      // Calculer la progression
      const progress = Math.round((i / pendingIncidents.length) * 100);
      setSyncProgress(progress);
      
      try {
        // Transformer l'incident hors ligne pour correspondre au schéma de la base de données
        const dbIncident = {
          title: incident.title,
          description: incident.description,
          category_id: incident.categoryId,
          location_lat: incident.location.lat,
          location_lng: incident.location.lng,
          status: incident.status,
          created_at: incident.createdAt,
          // Ajouter d'autres champs si nécessaire
        };
        
        // Uploader vers Supabase
        const { error } = await supabase.from("incidents").insert(dbIncident);
        
        // Simuler un délai pour montrer la progression (en environnement réel, cette ligne serait supprimée)
        await new Promise(resolve => setTimeout(resolve, 300));
        
        if (error) {
          console.error("Erreur de synchronisation d'incident:", error);
          failedCount++;
        } else {
          // Marquer comme synchronisé dans le stockage local
          markIncidentAsSynced(incident.offlineId);
          successCount++;
        }
      } catch (error) {
        console.error("Erreur de traitement d'incident:", error);
        failedCount++;
      }
    }
    
    // Mise à jour des incidents après synchronisation
    setOfflineIncidents(getOfflineIncidents());
    
    setSyncProgress(100);
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

  const handleDeleteIncident = (offlineId: string) => {
    removeOfflineIncident(offlineId);
    setOfflineIncidents(getOfflineIncidents());
    toast.success("Incident supprimé avec succès");
  };

  const handleClearAll = () => {
    clearOfflineIncidents();
    setOfflineIncidents([]);
    toast.success("Tous les incidents hors-ligne ont été supprimés");
  };

  const pendingCount = offlineIncidents.filter(incident => incident.pendingUpload).length;
  const syncedCount = offlineIncidents.filter(incident => !incident.pendingUpload).length;

  return (
    <DashboardShell>
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Synchronisation des incidents</h1>
          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour
          </Button>
        </div>
        
        {!isOnline && (
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Vous êtes hors ligne</AlertTitle>
            <AlertDescription>
              La synchronisation des incidents n'est pas disponible sans connexion internet. 
              Veuillez vous reconnecter pour synchroniser vos incidents.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>En attente</CardTitle>
              <CardDescription>Incidents à synchroniser</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{pendingCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Synchronisés</CardTitle>
              <CardDescription>Incidents déjà synchronisés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{syncedCount}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Total</CardTitle>
              <CardDescription>Tous les incidents locaux</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{offlineIncidents.length}</div>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Synchronisation</CardTitle>
            <CardDescription>
              {isSyncing 
                ? `Synchronisation en cours (${currentIncidentIndex + 1}/${pendingCount})...` 
                : "Synchronisez vos incidents enregistrés localement"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isSyncing && (
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progression</span>
                  <span>{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            )}
            
            {showResults && (
              <div className="grid grid-cols-2 gap-4 my-6">
                <Card className="bg-green-50 border-green-100">
                  <CardContent className="p-4 flex items-center">
                    <CheckCircle2 className="text-green-500 h-8 w-8 mr-4" />
                    <div>
                      <p className="text-sm text-green-700">Réussis</p>
                      <p className="text-2xl font-bold text-green-800">{syncResults.success}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className={`${syncResults.failed > 0 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                  <CardContent className="p-4 flex items-center">
                    <XCircle className={`${syncResults.failed > 0 ? "text-red-500" : "text-gray-400"} h-8 w-8 mr-4`} />
                    <div>
                      <p className={`text-sm ${syncResults.failed > 0 ? "text-red-700" : "text-gray-700"}`}>Échoués</p>
                      <p className={`text-2xl font-bold ${syncResults.failed > 0 ? "text-red-800" : "text-gray-600"}`}>{syncResults.failed}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={handleSync} 
                disabled={isSyncing || pendingCount === 0 || !isOnline}
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
          </CardContent>
        </Card>
        
        {offlineIncidents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Liste des incidents</CardTitle>
              <CardDescription>
                {pendingCount > 0 
                  ? `${pendingCount} incident(s) en attente de synchronisation` 
                  : "Tous les incidents sont synchronisés"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offlineIncidents.map((incident) => (
                  <div key={incident.offlineId} className="border rounded-lg p-4 relative">
                    <div className="absolute top-3 right-3">
                      <Badge variant={incident.pendingUpload ? "secondary" : "outline"} className={incident.pendingUpload ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" : "bg-green-100 text-green-800 hover:bg-green-200"}>
                        {incident.pendingUpload ? "En attente" : "Synchronisé"}
                      </Badge>
                    </div>
                    <h3 className="font-medium mb-2 pr-24">{incident.title}</h3>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{incident.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {format(new Date(incident.createdAt), "PP", { locale: fr })}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3.5 w-3.5 mr-1" />
                        {format(new Date(incident.createdAt), "p", { locale: fr })}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-3.5 w-3.5 mr-1" />
                        {incident.location.lat.toFixed(4)}, {incident.location.lng.toFixed(4)}
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-3.5 w-3.5 mr-1" />
                        {incident.categoryId || "Non catégorisé"}
                      </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                      {incident.pendingUpload && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteIncident(incident.offlineId)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardShell>
  );
}
