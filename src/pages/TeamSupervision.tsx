
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  BarChart3, 
  Clock, 
  MapPin, 
  Users,
  Calendar,
  MessageSquare
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import TeamManager from "@/components/TeamManager";
import IncidentMap from "@/components/IncidentMap";

export default function TeamSupervision() {
  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Gestion des équipes | Incident Signal";
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Supervision des équipes</h1>
          <p className="text-gray-600 mt-1">
            Gestion, coordination et suivi des équipes sur le terrain
          </p>
        </div>
        <div className="flex gap-2">
          <Button className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerte générale
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planning
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                Équipes actives
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">3/4</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default">7 agents</Badge>
              <Badge variant="outline">2 véhicules</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Interventions aujourd'hui
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="default" className="bg-green-600">8 complétées</Badge>
              <Badge variant="outline" className="text-orange-600">4 en cours</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                Temps de réponse moyen
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">13 min</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-indigo-600">
                -2 min vs. semaine dernière
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Localisation des équipes et incidents</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <IncidentMap />
          </CardContent>
        </Card>
      </div>

      <TeamManager />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Statistiques hebdomadaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Temps moyen de résolution</div>
                <div className="text-xl font-semibold">47 minutes</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Efficacité des équipes</div>
                <div className="text-xl font-semibold">93%</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Incidents résolus</div>
                <div className="text-xl font-semibold">68</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Zones d'intervention fréquentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Centre-ville</span>
                <Badge>42%</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Quartier Nord</span>
                <Badge>28%</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Quartier Sud</span>
                <Badge>18%</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span>Zone périphérique</span>
                <Badge>12%</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              Communications récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3 py-1">
                <div className="text-sm font-medium">Équipe Alpha</div>
                <div className="text-xs text-gray-500">Il y a 10 minutes</div>
                <div className="text-sm mt-1">Intervention terminée au 12 rue du Commerce</div>
              </div>
              <div className="border-l-4 border-orange-500 pl-3 py-1">
                <div className="text-sm font-medium">Équipe Beta</div>
                <div className="text-xs text-gray-500">Il y a 25 minutes</div>
                <div className="text-sm mt-1">Demande de renfort pour tapage nocturne</div>
              </div>
              <div className="border-l-4 border-gray-500 pl-3 py-1">
                <div className="text-sm font-medium">Centre de contrôle</div>
                <div className="text-xs text-gray-500">Il y a 45 minutes</div>
                <div className="text-sm mt-1">Briefing quotidien envoyé à toutes les équipes</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
