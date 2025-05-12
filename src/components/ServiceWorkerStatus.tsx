
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { CustomAlert, CustomAlertTitle, CustomAlertDescription } from "@/components/ui/custom-alert";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Wifi, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";

export default function ServiceWorkerStatus() {
  const { status, update } = useServiceWorker();
  const isOnline = useOnlineStatus();

  if (!status || status === 'pending' || status === 'registered') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full shadow-lg">
      {status === 'update-available' && (
        <CustomAlert variant="info" className="flex flex-col items-start">
          <RefreshCcw className="h-4 w-4 mr-2" />
          <div className="space-y-2 w-full">
            <CustomAlertTitle>Nouvelle version disponible</CustomAlertTitle>
            <CustomAlertDescription>
              Une mise à jour de l'application est disponible. Voulez-vous l'installer maintenant ?
            </CustomAlertDescription>
            <div className="flex justify-end w-full mt-2">
              <Button onClick={update} size="sm">
                Mettre à jour
              </Button>
            </div>
          </div>
        </CustomAlert>
      )}

      {status === 'offline-ready' && (
        <CustomAlert variant="success" className="animate-in fade-in slide-in-from-bottom-5">
          <WifiOff className="h-4 w-4 mr-2" />
          <div>
            <CustomAlertTitle>Application disponible hors-ligne</CustomAlertTitle>
            <CustomAlertDescription>
              L'application est maintenant disponible en mode hors-ligne.
            </CustomAlertDescription>
          </div>
        </CustomAlert>
      )}

      {!isOnline && (
        <CustomAlert variant="warning" className="animate-in fade-in slide-in-from-bottom-5 mt-2">
          <WifiOff className="h-4 w-4 mr-2" />
          <div>
            <CustomAlertTitle>Mode hors-ligne</CustomAlertTitle>
            <CustomAlertDescription>
              Vous êtes actuellement en mode hors-ligne. Certaines fonctionnalités peuvent être limitées.
            </CustomAlertDescription>
          </div>
        </CustomAlert>
      )}
    </div>
  );
}
