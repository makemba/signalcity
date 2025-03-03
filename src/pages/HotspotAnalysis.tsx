
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  AlertTriangle,
  BarChart3,
  Calendar,
  Clock,
  Download,
  Filter,
  MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import HotspotPredictor from "@/components/HotspotPredictor";
import IncidentMap from "@/components/IncidentMap";
import { Incident } from "@/types/incident";

const mockIncidents: Incident[] = [
  {
    id: 1,
    title: "Tapage nocturne",
    description: "Musique forte après 22h",
    location: { lat: 48.8566, lng: 2.3522 },
    category: "NOISE",
    status: "PENDING",
    reporter_id: "user1",
    created_at: new Date().toISOString(),
    priority: "medium",
    assigned_to: null,
    resolution_notes: null,
    updated_at: new Date().toISOString(),
    date: new Date().toISOString(),
    categoryId: "noise"
  },
  {
    id: 2,
    title: "Dégradation",
    description: "Graffiti sur mur public",
    location: { lat: 48.8584, lng: 2.3488 },
    category: "VANDALISM",
    status: "PENDING",
    reporter_id: "user2",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    priority: "low",
    assigned_to: null,
    resolution_notes: null,
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    date: new Date(Date.now() - 86400000).toISOString(),
    categoryId: "vandalism"
  },
  {
    id: 3,
    title: "Altercation",
    description: "Dispute sur voie publique",
    location: { lat: 48.8606, lng: 2.3376 },
    category: "VIOLENCE",
    status: "IN_PROGRESS",
    reporter_id: "user3",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    priority: "high",
    assigned_to: "agent1",
    resolution_notes: null,
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    date: new Date(Date.now() - 172800000).toISOString(),
    categoryId: "violence"
  }
];

export default function HotspotAnalysis() {
  const [timeRange, setTimeRange] = useState("week");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Analyse des points chauds | Incident Signal";
  }, []);

  const { data: hotspots } = useQuery({
    queryKey: ["hotspots", timeRange, category],
    queryFn: async () => {
      return [
        { id: 1, location: "Centre commercial Saint-Jacques", incident_count: 28, risk_level: "high", lat: 48.8534, lng: 2.3488 },
        { id: 2, location: "Gare centrale", incident_count: 21, risk_level: "high", lat: 48.8809, lng: 2.3553 },
        { id: 3, location: "Parc des Buttes-Chaumont", incident_count: 16, risk_level: "medium", lat: 48.8787, lng: 2.3858 },
        { id: 4, location: "Zone piétonne Montorgueil", incident_count: 14, risk_level: "medium", lat: 48.8661, lng: 2.3522 },
        { id: 5, location: "Place de la Nation", incident_count: 11, risk_level: "medium", lat: 48.8484, lng: 2.3965 },
      ];
    }
  });

  const { data: categoryStats } = useQuery({
    queryKey: ["category-stats", timeRange],
    queryFn: async () => {
      return [
        { category: "noise", count: 86, change: 12 },
        { category: "public_disorder", count: 43, change: -5 },
        { category: "violence", count: 27, change: 8 },
        { category: "lighting", count: 19, change: -2 },
        { category: "garbage", count: 15, change: 3 },
      ];
    }
  });

  const { data: timeStats } = useQuery({
    queryKey: ["time-stats"],
    queryFn: async () => {
      return [
        { time: "22:00 - 02:00", count: 43, risk: "high" },
        { time: "18:00 - 22:00", count: 36, risk: "medium" },
        { time: "14:00 - 18:00", count: 21, risk: "low" },
        { time: "10:00 - 14:00", count: 14, risk: "low" },
        { time: "06:00 - 10:00", count: 9, risk: "low" },
        { time: "02:00 - 06:00", count: 17, risk: "medium" },
      ];
    }
  });

  const handleExportData = () => {
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées au format CSV",
    });
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "high":
        return <Badge className="bg-red-500">Élevé</Badge>;
      case "medium":
        return <Badge className="bg-orange-500">Moyen</Badge>;
      case "low":
        return <Badge className="bg-green-500">Faible</Badge>;
      default:
        return <Badge>{risk}</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analyse des points chauds</h1>
          <p className="text-gray-600 mt-1">
            Identification et prévision des zones à risque élevé d'incidents
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4" />
            Exporter
          </Button>
          <Button className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Alerter les équipes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-red-500" />
              Points chauds actifs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">5</div>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge variant="destructive">2 haut risque</Badge>
              <Badge variant="outline" className="text-orange-600">3 risque moyen</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              Incidents totaux
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">90</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-blue-600">
                +12% vs période précédente
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Pic d'incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">22h - 02h</div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-purple-600">
                43 incidents
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filtres</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Période</label>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Aujourd'hui</SelectItem>
                    <SelectItem value="week">7 derniers jours</SelectItem>
                    <SelectItem value="month">30 derniers jours</SelectItem>
                    <SelectItem value="quarter">3 derniers mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Catégorie</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les catégories</SelectItem>
                    <SelectItem value="noise">Nuisances sonores</SelectItem>
                    <SelectItem value="violence">Violence/Agression</SelectItem>
                    <SelectItem value="public_disorder">Trouble à l'ordre public</SelectItem>
                    <SelectItem value="lighting">Éclairage défectueux</SelectItem>
                    <SelectItem value="garbage">Dépôt sauvage</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button className="w-full" variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Appliquer les filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plages horaires à risque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeStats?.map((stat) => (
                  <div key={stat.time} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="text-sm">{stat.time}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{stat.count}</span>
                      {getRiskBadge(stat.risk)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Carte des points chauds</CardTitle>
              <CardDescription>
                Visualisation géographique des zones à forte concentration d'incidents
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[500px]">
              <IncidentMap />
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Points chauds identifiés</CardTitle>
            <CardDescription>
              Zones avec une concentration élevée d'incidents
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hotspots?.map((hotspot) => (
                <div key={hotspot.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <div className="font-medium">{hotspot.location}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="h-3 w-3 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {hotspot.lat.toFixed(4)}, {hotspot.lng.toFixed(4)}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-semibold">{hotspot.incident_count}</span>
                      <span className="text-sm text-gray-500">incidents</span>
                    </div>
                    <div className="mt-1">
                      {getRiskBadge(hotspot.risk_level)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
            <CardDescription>
              Distribution des incidents par type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats?.map((stat) => (
                <div key={stat.category} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-medium capitalize">
                      {stat.category === "noise" && "Nuisances sonores"}
                      {stat.category === "public_disorder" && "Trouble à l'ordre public"}
                      {stat.category === "violence" && "Violence/Agression"}
                      {stat.category === "lighting" && "Éclairage défectueux"}
                      {stat.category === "garbage" && "Dépôt sauvage"}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{stat.count}</span>
                      <Badge 
                        variant="outline" 
                        className={stat.change > 0 ? "text-red-600" : "text-green-600"}
                      >
                        {stat.change > 0 ? `+${stat.change}%` : `${stat.change}%`}
                      </Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${
                        stat.category === "noise" ? "bg-purple-500" :
                        stat.category === "public_disorder" ? "bg-orange-500" :
                        stat.category === "violence" ? "bg-red-500" :
                        stat.category === "lighting" ? "bg-yellow-500" :
                        "bg-green-500"
                      }`}
                      style={{ width: `${(stat.count / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Prédiction de points chauds</CardTitle>
            <CardDescription>
              Prévision des zones à risque pour les prochaines 24-72 heures
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HotspotPredictor incidents={mockIncidents} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
