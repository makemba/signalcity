
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { CustomAlert, CustomAlertTitle, CustomAlertDescription } from "@/components/ui/custom-alert";
import { Info, WifiOff } from "lucide-react";
import OfflineIncidentForm from "@/components/OfflineIncidentForm";
import IncidentForm from "@/components/IncidentForm";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function ReportIncident() {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  const handleOnlineSuccess = () => {
    toast.success("Incident signalé avec succès", {
      description: "Votre signalement a été envoyé et sera traité rapidement."
    });
    navigate("/");
  };

  const handleOfflineSuccess = () => {
    toast.success("Incident enregistré hors ligne", {
      description: "Votre signalement sera synchronisé lorsque vous serez connecté à Internet."
    });
    navigate("/");
  };

  return (
    <DashboardShell>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Signaler un incident</h1>
          
          {!isOnline && (
            <CustomAlert variant="warning" className="mb-6">
              <WifiOff className="h-4 w-4" />
              <CustomAlertTitle>Mode hors ligne</CustomAlertTitle>
              <CustomAlertDescription>
                Vous êtes actuellement hors ligne. Votre signalement sera enregistré localement 
                et synchronisé automatiquement lorsque votre connexion internet sera rétablie.
              </CustomAlertDescription>
            </CustomAlert>
          )}
          
          <Tabs defaultValue={isOnline ? "online" : "offline"}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="online" disabled={!isOnline}>En ligne</TabsTrigger>
              <TabsTrigger value="offline">Hors ligne</TabsTrigger>
            </TabsList>
            
            <TabsContent value="online">
              <Card>
                <CardHeader>
                  <CardTitle>Signalement en ligne</CardTitle>
                  <CardDescription>
                    Votre signalement sera immédiatement transmis aux services concernés.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IncidentForm onSubmit={handleOnlineSuccess} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="offline">
              <Card>
                <CardHeader>
                  <CardTitle>Signalement hors ligne</CardTitle>
                  <CardDescription>
                    Votre signalement sera enregistré localement et synchronisé ultérieurement.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <OfflineIncidentForm onSuccess={handleOfflineSuccess} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <Card className="mt-6 bg-blue-50 border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Info className="text-blue-500 mt-1 h-5 w-5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-700 mb-1">Comment ça fonctionne ?</h3>
                  <p className="text-sm text-blue-600">
                    Les signalements effectués hors ligne sont stockés dans la mémoire de votre appareil. 
                    Ils seront automatiquement synchronisés avec notre serveur lorsque vous serez connecté à Internet. 
                    Vous pouvez suivre l'état de la synchronisation via la bannière qui apparaît en haut de l'écran.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
