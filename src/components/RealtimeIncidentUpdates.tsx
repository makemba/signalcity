
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Check, Clock, AlertCircle, Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface IncidentUpdate {
  id: number;
  status: string;
  category_id: string;
  created_at: string;
  description: string | null;
  location_lat: number;
  location_lng: number;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "IN_PROGRESS":
      return <AlertCircle className="h-4 w-4 text-blue-500" />;
    case "RESOLVED":
      return <Check className="h-4 w-4 text-green-500" />;
    case "REJECTED":
      return <AlertTriangle className="h-4 w-4 text-red-500" />;
    default:
      return <AlertTriangle className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "En attente";
    case "IN_PROGRESS":
      return "En cours";
    case "RESOLVED":
      return "Résolu";
    case "REJECTED":
      return "Rejeté";
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function RealtimeIncidentUpdates() {
  const [updates, setUpdates] = useState<IncidentUpdate[]>([]);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    // Charger les 5 incidents les plus récents au démarrage
    const fetchRecentIncidents = async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("id, status, category_id, created_at, description, location_lat, location_lng")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Erreur lors du chargement des incidents récents:", error);
        return;
      }

      if (data) {
        setUpdates(data);
      }
    };

    fetchRecentIncidents();

    // S'abonner aux changements en temps réel
    const channel = supabase
      .channel("public:incidents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents",
        },
        (payload) => {
          console.log("Changement d'incident détecté:", payload);
          
          // Notification pour les nouveaux incidents ou mises à jour
          if (payload.eventType === "INSERT") {
            toast.info("Nouveau signalement reçu", {
              description: "Un nouvel incident a été signalé."
            });
            
            setShowNotification(true);
            setTimeout(() => setShowNotification(false), 3000);
            
            // Ajouter le nouvel incident à la liste
            if (payload.new) {
              setUpdates((prev) => [payload.new as IncidentUpdate, ...prev.slice(0, 4)]);
            }
          } else if (payload.eventType === "UPDATE") {
            toast.info("Mise à jour d'un signalement", {
              description: "Le statut d'un incident a été mis à jour."
            });
            
            // Mettre à jour l'incident modifié
            if (payload.new) {
              setUpdates((prev) => 
                prev.map((update) => 
                  update.id === payload.new.id ? payload.new as IncidentUpdate : update
                )
              );
            }
          }
        }
      )
      .subscribe();

    // Nettoyer l'abonnement
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="relative">
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 right-0 bg-blue-100 text-blue-700 px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
          >
            <Bell className="h-4 w-4" />
            <span>Nouveau signalement reçu</span>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          Mises à jour en temps réel
        </h3>
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {updates.map((update) => (
              <motion.div
                key={`${update.id}-${update.status}`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-100 rounded-md p-3 bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-2">
                    {getStatusIcon(update.status)}
                    <div>
                      <p className="text-sm font-medium">{`Incident #${update.id}`}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {update.description 
                          ? update.description.substring(0, 50) + (update.description.length > 50 ? "..." : "") 
                          : "Aucune description"
                        }
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(update.created_at).toLocaleString("fr-FR", { 
                          day: "numeric", 
                          month: "short", 
                          hour: "2-digit", 
                          minute: "2-digit" 
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(update.status)} text-xs`}
                  >
                    {getStatusText(update.status)}
                  </Badge>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {updates.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              Aucune mise à jour d'incident disponible
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
