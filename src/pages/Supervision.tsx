
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  MapPin, 
  Activity,
  PhoneCall,
  MessageSquare,
  BarChart3,
  Calendar
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import IncidentList from "@/components/IncidentList";
import { DashboardShell } from "@/components/DashboardShell";

const Supervision = () => {
  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Supervision | Incident Signal";
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["supervision-stats"],
    queryFn: async () => {
      // Simuler des statistiques pour la démo
      return {
        activeIncidents: 24,
        inProgress: 12,
        resolvedToday: 8,
        teamEfficiency: 87,
        responseTime: "8min",
        customerSatisfaction: 92
      };
    }
  });

  const { data: activeTeams } = useQuery({
    queryKey: ["active-teams"],
    queryFn: async () => {
      // Simuler des équipes pour la démo
      return [
        {
          id: 1,
          name: "Équipe Alpha",
          location: "Centre-ville",
          status: "active",
          members: 4,
          currentTask: "Intervention nuisances sonores"
        },
        {
          id: 2,
          name: "Équipe Beta",
          location: "Quartier Nord",
          status: "en_route",
          members: 3,
          currentTask: "Maintenance éclairage"
        },
        {
          id: 3,
          name: "Équipe Gamma",
          location: "Quartier Sud",
          status: "pause",
          members: 5,
          currentTask: "Retour de pause dans 15min"
        }
      ];
    }
  });

  const { data: recentAlerts } = useQuery({
    queryKey: ["recent-alerts"],
    queryFn: async () => {
      return [
        {
          id: 1,
          type: "high",
          message: "Plusieurs signalements de nuisances sonores dans le quartier St-Michel",
          time: "Il y a 12 minutes"
        },
        {
          id: 2,
          type: "medium",
          message: "Éclairage défectueux signalé sur l'avenue principale",
          time: "Il y a 45 minutes"
        },
        {
          id: 3,
          type: "low",
          message: "Dépôt sauvage près de l'école primaire",
          time: "Il y a 2 heures"
        },
      ];
    }
  });

  return (
    <DashboardShell>
      <div className="container mx-auto p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <p className="text-gray-600">
              Vue d'ensemble de l'activité et des opérations en cours
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Aujourd'hui</span>
            </Button>
            <Button className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span className="hidden sm:inline">Signaler</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Incidents actifs</h3>
                <p className="text-3xl font-bold mt-2">{stats?.activeIncidents}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
              </div>
            </div>
            <Progress value={65} className="mt-4" />
            <p className="text-sm text-gray-500 mt-2">+12% par rapport à hier</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">En cours de traitement</h3>
                <p className="text-3xl font-bold mt-2">{stats?.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <Progress value={45} className="mt-4" />
            <p className="text-sm text-gray-500 mt-2">3 incidents critiques</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Résolus aujourd'hui</h3>
                <p className="text-3xl font-bold mt-2">{stats?.resolvedToday}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <Progress value={80} className="mt-4" />
            <p className="text-sm text-gray-500 mt-2">Temps moyen: 42 minutes</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Performance des équipes
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Efficacité globale</span>
                <Badge variant="secondary">{stats?.teamEfficiency}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Temps de réponse moyen</span>
                <Badge variant="secondary">{stats?.responseTime}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Satisfaction client</span>
                <Badge variant="secondary">{stats?.customerSatisfaction}%</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Taux de résolution</span>
                <Badge variant="secondary">94%</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <BarChart3 className="h-4 w-4 mr-2" />
              Voir les statistiques détaillées
            </Button>
          </Card>

          <Card className="p-4">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Support & Communication
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-green-600" />
                  <span>Appels en attente</span>
                </div>
                <Badge>3</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-600" />
                  <span>Chats actifs</span>
                </div>
                <Badge>7</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-orange-50 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <span>Alertes non traitées</span>
                </div>
                <Badge>4</Badge>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              <Activity className="h-4 w-4 mr-2" />
              Voir le tableau de bord du support
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-2">
            <IncidentList />
          </div>

          <div className="space-y-6">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Alertes récentes
              </h2>
              <div className="space-y-4">
                {recentAlerts?.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <Badge
                      variant={
                        alert.type === "high" ? "destructive" :
                        alert.type === "medium" ? "secondary" :
                        "outline"
                      }
                    >
                      {alert.type === "high" ? "Urgent" :
                       alert.type === "medium" ? "Important" :
                       "Normal"}
                    </Badge>
                    <div>
                      <p className="text-sm">{alert.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Zones actives
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Centre-ville</span>
                  <Badge>8 incidents</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Quartier Nord</span>
                  <Badge>5 incidents</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>Zone commerciale</span>
                  <Badge>3 incidents</Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
};

export default Supervision;
