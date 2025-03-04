
import React, { useEffect } from "react";
import IncidentForm from "@/components/IncidentForm";
import OfflineIncidentForm from "@/components/OfflineIncidentForm";
import { DashboardShell } from "@/components/DashboardShell";
import SafetyTips from "@/components/SafetyTips";
import { RealtimeIncidentUpdates } from "@/components/RealtimeIncidentUpdates";
import { Bell, BellOff, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationsContext";
import { toast } from "sonner";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { hasPendingIncidents } from "@/services/offlineStorage";
import { Link } from "react-router-dom";

export default function ReportIncident() {
  const { isPushEnabled, requestPushPermission } = useNotifications();
  const isOnline = useOnlineStatus();
  const [hasPendingSync, setHasPendingSync] = React.useState(false);

  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Signaler un incident | Incident Signal";
    checkPendingIncidents();
  }, []);

  const checkPendingIncidents = () => {
    const pending = hasPendingIncidents();
    setHasPendingSync(pending);
  };

  const handleEnablePushNotifications = async () => {
    if (!isPushEnabled) {
      const granted = await requestPushPermission();
      if (granted) {
        toast.success("Notifications push activées avec succès");
      }
    } else {
      toast.info("Les notifications push sont déjà activées");
    }
  };

  return (
    <DashboardShell>
      <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Signaler un incident</h1>
            <p className="text-gray-500 mt-1">
              Décrivez la situation et fournissez autant de détails que possible
            </p>
          </div>
          
          <div className="mt-3 md:mt-0 flex flex-col md:flex-row gap-2">
            {!isOnline && (
              <div className="flex items-center gap-2 text-amber-600 text-sm bg-amber-50 px-3 py-1.5 rounded-md">
                <WifiOff className="h-4 w-4" />
                <span>Mode hors ligne</span>
              </div>
            )}
            
            {hasPendingSync && isOnline && (
              <Link to="/sync-incidents">
                <Button variant="outline" className="text-blue-600 border-blue-200 bg-blue-50">
                  Synchroniser les signalements
                </Button>
              </Link>
            )}
            
            {!isPushEnabled && isOnline && (
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleEnablePushNotifications}
              >
                <Bell className="h-4 w-4" />
                <span>Activer les notifications</span>
              </Button>
            )}
            
            {isPushEnabled && isOnline && (
              <div className="flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-1.5 rounded-md">
                <Bell className="h-4 w-4" />
                <span>Notifications activées</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {isOnline ? (
              <IncidentForm onSubmit={checkPendingIncidents} />
            ) : (
              <OfflineIncidentForm onSubmit={checkPendingIncidents} />
            )}
          </div>
          <div className="space-y-6">
            {isOnline && <RealtimeIncidentUpdates />}
            <SafetyTips />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
