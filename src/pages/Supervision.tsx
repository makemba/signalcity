
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users, 
  MapPin, 
  Activity,
  PhoneCall,
  MessageSquare 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Supervision = () => {
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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supervision des opérations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Incidents actifs</h3>
              <p className="text-3xl font-bold mt-2">{stats?.activeIncidents}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
          <Progress value={65} className="mt-4" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">En cours de traitement</h3>
              <p className="text-3xl font-bold mt-2">{stats?.inProgress}</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
          <Progress value={45} className="mt-4" />
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Résolus aujourd'hui</h3>
              <p className="text-3xl font-bold mt-2">{stats?.resolvedToday}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <Progress value={80} className="mt-4" />
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
          </div>
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
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Équipes sur le terrain
        </h2>
        <div className="space-y-4">
          {activeTeams?.map((team) => (
            <div 
              key={team.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <h3 className="font-semibold">{team.name}</h3>
                <p className="text-sm text-gray-600">{team.currentTask}</p>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{team.location}</span>
                </div>
              </div>
              <div className="text-right">
                <Badge
                  variant={
                    team.status === 'active' ? 'default' :
                    team.status === 'en_route' ? 'secondary' :
                    'outline'
                  }
                >
                  {team.status === 'active' ? 'En intervention' :
                   team.status === 'en_route' ? 'En route' :
                   'En pause'}
                </Badge>
                <div className="flex items-center gap-1 mt-2 justify-end">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-500">{team.members}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Supervision;
