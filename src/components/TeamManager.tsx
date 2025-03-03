
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, MapPin, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useQuery } from "@tanstack/react-query";

interface Team {
  id: number;
  name: string;
  status: "active" | "en_route" | "pause" | "off_duty";
  members: number;
  location: string;
  currentTask?: string;
  leader?: string;
  contact?: string;
}

export default function TeamManager() {
  const { toast } = useToast();
  const [showHistory, setShowHistory] = useState(false);
  
  const { data: teams, isLoading, error } = useQuery({
    queryKey: ["teams"],
    queryFn: async () => {
      // Pour une démo, on utilise des données statiques
      // Dans une implémentation réelle, on utiliserait Supabase
      return [
        {
          id: 1,
          name: "Équipe Alpha",
          status: "active",
          members: 4,
          location: "Centre-ville",
          currentTask: "Intervention nuisances sonores",
          leader: "Jean Dupont",
          contact: "+33 6 12 34 56 78"
        },
        {
          id: 2,
          name: "Équipe Beta",
          status: "en_route",
          members: 3,
          location: "Quartier Nord",
          currentTask: "Maintenance éclairage",
          leader: "Marie Martin",
          contact: "+33 6 23 45 67 89"
        },
        {
          id: 3,
          name: "Équipe Gamma",
          status: "pause",
          members: 5,
          location: "Quartier Sud",
          currentTask: "Retour de pause dans 15min",
          leader: "Lucas Bernard",
          contact: "+33 6 34 56 78 90"
        },
        {
          id: 4,
          name: "Équipe Delta",
          status: "off_duty",
          members: 3,
          location: "Hors service",
          leader: "Sophie Petit",
          contact: "+33 6 45 67 89 01"
        }
      ] as Team[];
    }
  });

  const { data: teamHistory } = useQuery({
    queryKey: ["team-history"],
    queryFn: async () => {
      // Simulation d'historique d'interventions
      return [
        { id: 1, teamId: 1, date: "2025-03-02", task: "Surveillance parc municipal", duration: "3h", status: "completed" },
        { id: 2, teamId: 1, date: "2025-03-02", task: "Intervention tapage nocturne", duration: "1h", status: "completed" },
        { id: 3, teamId: 2, date: "2025-03-02", task: "Sécurisation marché", duration: "4h", status: "completed" },
        { id: 4, teamId: 3, date: "2025-03-02", task: "Patrouille quartier sud", duration: "2h", status: "completed" }
      ];
    },
    enabled: showHistory
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">En intervention</Badge>;
      case "en_route":
        return <Badge variant="secondary">En route</Badge>;
      case "pause":
        return <Badge variant="outline">En pause</Badge>;
      case "off_duty":
        return <Badge variant="destructive">Hors service</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDispatch = (teamId: number) => {
    toast({
      title: "Équipe mobilisée",
      description: `L'équipe ${teams?.find(t => t.id === teamId)?.name} a été assignée à l'intervention`,
    });
  };

  const handleContact = (team: Team) => {
    toast({
      title: "Contact établi",
      description: `Appel vers le responsable d'équipe ${team.leader} initié`,
    });
  };

  if (isLoading) {
    return <div className="p-4">Chargement des équipes...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Erreur lors du chargement des équipes: {(error as Error).message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des équipes</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Masquer l'historique" : "Afficher l'historique"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teams?.map((team) => (
          <Card key={team.id} className={`${team.status === 'off_duty' ? 'opacity-60' : ''}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{team.name}</CardTitle>
                {getStatusBadge(team.status)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={16} />
                  <span>{team.members} membres</span>
                  <span className="text-xs">• Chef: {team.leader}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin size={16} />
                  <span>{team.location}</span>
                </div>
                
                {team.currentTask && (
                  <div className="mt-2 text-sm font-medium">
                    Tâche actuelle: {team.currentTask}
                  </div>
                )}
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    size="sm" 
                    disabled={team.status === 'off_duty'}
                    onClick={() => handleDispatch(team.id)}
                  >
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    Mobiliser
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleContact(team)}
                  >
                    Contacter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {showHistory && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Historique des interventions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamHistory?.map((entry) => {
                const team = teams?.find(t => t.id === entry.teamId);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-2 border-b last:border-0">
                    <div>
                      <div className="font-medium">{team?.name}</div>
                      <div className="text-sm text-gray-600">{entry.task}</div>
                      <div className="text-xs text-gray-500">{entry.date} • {entry.duration}</div>
                    </div>
                    <div>
                      <Badge variant="outline" className="bg-green-50 text-green-800">
                        <Check className="mr-1 h-3 w-3" /> {entry.status}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
