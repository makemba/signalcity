
import { DashboardShell } from "@/components/DashboardShell";
import EmergencyChat from "@/components/EmergencyChat";
import { Button } from "@/components/ui/button";
import { ShieldAlert, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";

export default function EmergencyChatPage() {
  useEffect(() => {
    document.title = "Chat d'urgence | Incident Signal";
  }, []);

  return (
    <DashboardShell>
      <div className="container px-4 py-6 md:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-8 w-8 text-red-600" />
              Chat d'Urgence
            </h1>
            <p className="text-gray-500 mt-1">
              Communiquez en direct avec les services d'urgence
            </p>
          </div>
          
          <Badge 
            variant="outline" 
            className="mt-2 md:mt-0 bg-green-50 text-green-700 border border-green-200 flex items-center gap-1 px-3 py-1"
          >
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            Services d'urgence disponibles
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <EmergencyChat showFullscreen={false} />
          </div>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informations utiles</CardTitle>
                <CardDescription>
                  Comment communiquer efficacement avec les services d'urgence
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">En cas d'urgence grave</h3>
                  <p className="text-sm text-gray-600">
                    Utilisez le bouton "Appel d'urgence" pour une prise en charge immédiate par téléphone.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Soyez précis et concis</h3>
                  <p className="text-sm text-gray-600">
                    Décrivez clairement la nature de l'incident, sa localisation exacte et les personnes impliquées.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Restez en ligne</h3>
                  <p className="text-sm text-gray-600">
                    Même après avoir communiqué les informations essentielles, restez connecté pour recevoir des instructions.
                  </p>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    Ce service ne remplace pas les numéros d'urgence officiels (15, 17, 18 ou 112) en cas de danger immédiat.
                  </AlertDescription>
                </Alert>
                
                <div className="pt-2">
                  <Button variant="outline" className="w-full">
                    Consulter le guide d'urgence complet
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Temps de réponse estimé</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center text-center p-4">
                  <div className="text-4xl font-bold text-green-600">
                    &lt; 5 min
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Nos agents sont disponibles 24/7 pour vous assister
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
