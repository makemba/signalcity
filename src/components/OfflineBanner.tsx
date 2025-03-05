
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";
import { Wifi, WifiOff, Check, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { countPendingIncidents } from "@/services/offlineStorage";
import { Progress } from "@/components/ui/progress";

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [showStatusChange, setShowStatusChange] = useState(false);
  const [lastOnlineState, setLastOnlineState] = useState(isOnline);
  const navigate = useNavigate();

  useEffect(() => {
    // Détecter les changements d'état de connexion
    if (lastOnlineState !== isOnline) {
      setShowStatusChange(true);
      setLastOnlineState(isOnline);
      
      // Cacher la notification après 5 secondes si nous sommes de nouveau en ligne
      if (isOnline) {
        const timer = setTimeout(() => {
          setShowStatusChange(false);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
    
    // Mettre à jour le compteur d'incidents en attente
    const updatePendingCount = () => {
      const count = countPendingIncidents();
      setPendingCount(count);
    };
    
    updatePendingCount();
    
    // Mettre à jour le compteur toutes les 3 secondes
    const interval = setInterval(updatePendingCount, 3000);
    
    return () => clearInterval(interval);
  }, [isOnline, lastOnlineState]);

  // Si nous sommes en ligne et qu'il n'y a pas d'incidents en attente et pas de changement d'état récent
  if (isOnline && pendingCount === 0 && !showStatusChange) {
    return null;
  }

  // Calculer le niveau de risque (pour la barre de progression)
  const getProgressValue = () => {
    if (!isOnline) return 75; // Risque modéré-élevé quand hors ligne
    if (pendingCount > 10) return 60; // Risque modéré avec beaucoup d'incidents en attente
    if (pendingCount > 0) return 30; // Risque faible avec quelques incidents en attente
    return 0; // Pas de risque
  };

  // Définir la couleur de la barre de progression
  const getProgressColor = () => {
    if (!isOnline) return "bg-yellow-500";
    if (pendingCount > 10) return "bg-amber-500";
    if (pendingCount > 0) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleSyncClick = () => {
    navigate("/sync-incidents");
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={`p-3 ${isOnline ? (pendingCount > 0 ? "bg-blue-50" : "bg-green-50") : "bg-yellow-50"} border-b ${isOnline ? (pendingCount > 0 ? "border-blue-200" : "border-green-200") : "border-yellow-200"}`}>
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div className="flex items-center space-x-3 flex-1">
            {isOnline ? (
              pendingCount > 0 ? (
                <div className="p-1.5 bg-blue-100 rounded-full">
                  <Wifi className="h-4 w-4 text-blue-600" />
                </div>
              ) : (
                <div className="p-1.5 bg-green-100 rounded-full">
                  <Check className="h-4 w-4 text-green-600" />
                </div>
              )
            ) : (
              <div className="p-1.5 bg-yellow-100 rounded-full">
                <WifiOff className="h-4 w-4 text-yellow-600" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isOnline ? (pendingCount > 0 ? "text-blue-700" : "text-green-700") : "text-yellow-700"}`}>
                  {isOnline
                    ? pendingCount > 0
                      ? "Connecté - Données à synchroniser"
                      : "Connexion rétablie"
                    : "Mode hors ligne"}
                </span>
                {showStatusChange && isOnline && (
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full animate-pulse">
                    Connexion rétablie
                  </span>
                )}
              </div>
              <p className={`text-sm ${isOnline ? (pendingCount > 0 ? "text-blue-600" : "text-green-600") : "text-yellow-600"}`}>
                {isOnline
                  ? pendingCount > 0
                    ? `${pendingCount} signalement${pendingCount > 1 ? "s" : ""} en attente de synchronisation.`
                    : "Toutes les données sont synchronisées."
                  : "Les signalements sont enregistrés localement et seront synchronisés automatiquement lorsque la connexion sera rétablie."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            {!isOnline && (
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleRefresh}
                className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 hover:text-yellow-800"
              >
                <RefreshCcw className="h-3 w-3 mr-1" />
                Vérifier
              </Button>
            )}
            
            {isOnline && pendingCount > 0 && (
              <Button
                size="sm"
                variant="outline"
                onClick={handleSyncClick}
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              >
                <Wifi className="h-3 w-3 mr-1" />
                Synchroniser {pendingCount > 0 ? `(${pendingCount})` : ""}
              </Button>
            )}
          </div>
        </div>
        
        {/* Barre de progression pour visualiser le niveau de risque */}
        <div className="mt-2">
          <Progress value={getProgressValue()} className={`h-1.5 ${getProgressColor()}`} />
        </div>
      </div>
    </div>
  );
};

export default OfflineBanner;
