import React, { useState, useEffect } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Bell, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import IncidentForm from "@/components/IncidentForm";
import SafetyTips from "@/components/SafetyTips";
import PriorityCalculator from "@/components/PriorityCalculator";
import { useNotifications } from "@/contexts/NotificationsContext";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import OfflineIncidentForm from "@/components/OfflineIncidentForm";

export default function ReportIncident() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const { addNotification } = useNotifications();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // Handle push notification permissions - removed requestPushPermission as it doesn't exist
  }, []);

  const handleNotification = () => {
    addNotification({
      title: "Nouvelle fonctionnalité",
      message: "Les signalements hors ligne sont maintenant disponibles!",
      type: "info"
    });
  };

  return (
    <DashboardShell>
      <div className="container mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Signaler un incident</h1>
            <p className="text-gray-500">
              Remplissez le formulaire ci-dessous pour signaler un incident dans votre quartier
            </p>
          </div>
        </div>

        {!isOnline && (
          <Alert variant="warning" className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Mode hors ligne</AlertTitle>
            <AlertDescription>
              Vous êtes actuellement hors ligne. Votre signalement sera enregistré localement et 
              synchronisé dès que vous serez de nouveau connecté.
            </AlertDescription>
          </Alert>
        )}

        {submitted ? (
          <Card className="mb-8">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Signalement envoyé avec succès !</h2>
              <p className="text-gray-600 mb-6">
                Votre signalement a été enregistré et sera traité dans les plus brefs délais.
                {submittedId && <span> Numéro de référence: <strong>#{submittedId}</strong></span>}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button onClick={() => navigate("/")}>
                  Retour à l'accueil
                </Button>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Faire un nouveau signalement
                </Button>
                {submittedId && (
                  <Button variant="secondary" onClick={() => navigate(`/tickets/${submittedId}`)}>
                    Voir les détails du signalement
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Détails de l'incident</CardTitle>
                  <CardDescription>
                    Fournissez autant de détails que possible pour nous aider à traiter votre signalement efficacement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isOnline ? (
                    <IncidentForm 
                      onSuccess={(id) => {
                        setSubmittedId(id);
                        setSubmitted(true);
                        addNotification({
                          title: "Signalement envoyé",
                          message: "Votre signalement a été enregistré avec succès",
                          type: "success"
                        });
                      }} 
                    />
                  ) : (
                    <OfflineIncidentForm />
                  )}
                </CardContent>
              </Card>
            </div>
            
            <div className="space-y-6">
              <SafetyTips />
              <PriorityCalculator />
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
