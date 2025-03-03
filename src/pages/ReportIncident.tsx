
import React, { useEffect } from "react";
import IncidentForm from "@/components/IncidentForm";
import { DashboardShell } from "@/components/DashboardShell";
import SafetyTips from "@/components/SafetyTips";
import { RealtimeIncidentUpdates } from "@/components/RealtimeIncidentUpdates";
import { Bell, BellOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/contexts/NotificationsContext";
import { toast } from "sonner";

export default function ReportIncident() {
  const { isPushEnabled, requestPushPermission } = useNotifications();

  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Signaler un incident | Incident Signal";
  }, []);

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
          
          {!isPushEnabled && (
            <Button 
              variant="outline" 
              className="mt-3 md:mt-0 flex items-center gap-2"
              onClick={handleEnablePushNotifications}
            >
              <Bell className="h-4 w-4" />
              <span>Activer les notifications</span>
            </Button>
          )}
          
          {isPushEnabled && (
            <div className="mt-3 md:mt-0 flex items-center gap-2 text-green-600 text-sm bg-green-50 px-3 py-1.5 rounded-md">
              <Bell className="h-4 w-4" />
              <span>Notifications activées</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <IncidentForm />
          </div>
          <div className="space-y-6">
            <RealtimeIncidentUpdates />
            <SafetyTips />
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
