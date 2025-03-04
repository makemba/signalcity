
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { useEffect, useState } from "react";
import { Wifi, WifiOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { countPendingIncidents } from "@/services/offlineStorage";

const OfflineBanner = () => {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const count = countPendingIncidents();
    setPendingCount(count);

    // Update count every 5 seconds in case new offline incidents are added
    const interval = setInterval(() => {
      const newCount = countPendingIncidents();
      setPendingCount(newCount);
    }, 5000);

    return () => clearInterval(interval);
  }, [isOnline]);

  if (isOnline && pendingCount === 0) {
    return null;
  }

  return (
    <div className={`p-2 text-sm ${isOnline ? "bg-green-100" : "bg-yellow-100"} flex justify-between items-center`}>
      <div className="flex items-center space-x-2">
        {isOnline ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <WifiOff className="h-4 w-4 text-yellow-600" />
        )}
        <span className={isOnline ? "text-green-700" : "text-yellow-700"}>
          {isOnline
            ? `Connexion rétablie. ${pendingCount} signalement${
                pendingCount > 1 ? "s" : ""
              } en attente de synchronisation.`
            : "Vous êtes actuellement hors ligne. Les signalements seront enregistrés localement."}
        </span>
      </div>
      {isOnline && pendingCount > 0 && (
        <Button
          size="sm"
          variant="outline"
          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 hover:text-green-800"
          onClick={() => navigate("/sync")}
        >
          <Wifi className="h-3 w-3 mr-1" />
          Synchroniser
        </Button>
      )}
    </div>
  );
};

export default OfflineBanner;
