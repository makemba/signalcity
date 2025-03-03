import { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { 
  BarChart3, 
  Calendar, 
  Download, 
  Filter, 
  PieChart,
  TrendingDown,
  TrendingUp,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import IncidentTrends from "@/components/IncidentTrends";
import TrendAnalysis from "@/components/TrendAnalysis";
import SatisfactionAnalyzer from "@/components/SatisfactionAnalyzer";
import ResolutionTimeAnalyzer from "@/components/ResolutionTimeAnalyzer";
import { Incident } from "@/types/incident";

// Mock data for incidents
const mockIncidents: Incident[] = [
  {
    id: "1",
    title: "Tapage nocturne",
    description: "Musique forte après 22h",
    location: { lat: 48.8566, lng: 2.3522 },
    category: "NOISE",
    status: "PENDING",
    reporter_id: "user1",
    created_at: new Date().toISOString(),
    priority: "MEDIUM",
    assigned_to: null,
    resolution_notes: null,
    updated_at: new Date().toISOString(),
  },
  // ... other mock incidents would go here
];

// Mock feedback data
const mockFeedback = [
  { id: "1", rating: 4, comment: "Bonne réactivité", created_at: new Date().toISOString() },
  { id: "2", rating: 5, comment: "Excellente prise en charge", created_at: new Date().toISOString() },
  { id: "3", rating: 3, comment: "Délai de résolution moyen", created_at: new Date().toISOString() },
  // ... other mock feedback would go here
];

export default function ReportAnalytics() {
  const [timeRange, setTimeRange] = useState("month");
  const [category, setCategory] = useState("all");
  const { toast } = useToast();

  // Mise à jour du titre de la page
  useEffect(() => {
    document.title = "Analyse des signalements | Incident Signal";
  }, []);

  const { data: stats } = useQuery({
    queryKey: ["analytics-stats", timeRange, category],
    queryFn: async () => {
      // Données simulées pour la démo
      return {
        total: 342,
        resolved: 287,
        pending: 39,
        in_progress: 16,
        resolution_rate: 84,
        avg_resolution_time: "3.2 jours",
        change: {
          total: 12,
          resolution_rate: 5,
          avg_resolution_time: -8
        }
      };
    }
  });

  const { data: categoryBreakdown } = useQuery({
    queryKey: ["category-breakdown", timeRange],
    queryFn: async () => {
      return [
        { category: "noise", count: 153, percentage: 45 },
        { category: "violence", count: 42, percentage: 12 },
        { category: "public_disorder", count: 68, percentage: 20 },
        { category: "lighting", count: 34, percentage: 10 },
        { category: "garbage", count: 29, percentage: 8 },
        { category: "other", count: 16, percentage: 5 },
      ];
    }
  });

  const { data: timeDistribution } = useQuery({
    queryKey: ["time-distribution", timeRange],
    queryFn: async () => {
      return [
        { time: "00:00 - 04:00", count: 56, percentage: 16 },
        { time: "04:00 - 08:00", count: 23, percentage: 7 },
        { time: "08:00 - 12:00", count: 38, percentage: 11 },
        { time: "12:00 - 16:00", count: 48, percentage: 14 },
        { time: "16:00 - 20:00", count: 67, percentage: 20 },
        { time: "20:00 - 00:00", count: 110, percentage: 32 },
      ];
    }
  });

  const handleExportData = () => {
    toast({
      title: "Export réussi",
      description: "Le rapport a été exporté au format PDF"
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analyse des signalements</h1>
          <p className="text-gray-600 mt-1">
            Statistiques et tendances des incidents signalés
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExportData}
          >
            <Download className="h-4 w-4" />
            Exporter le rapport
          </Button>
          <Button className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Planifier un rapport
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Période</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une période" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">7 derniers jours</SelectItem>
                  <SelectItem value="month">30 derniers jours</SelectItem>
                  <SelectItem value="quarter">3 derniers mois</SelectItem>
                  <SelectItem value="year">12 derniers mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 flex-1">
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
            <div className="space-y-2 flex-1">
              <label className="text-sm font-medium">Zone</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner une zone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les zones</SelectItem>
                  <SelectItem value="center">Centre-ville</SelectItem>
                  <SelectItem value="north">Quartier Nord</SelectItem>
                  <SelectItem value="south">Quartier Sud</SelectItem>
                  <SelectItem value="east">Quartier Est</SelectItem>
                  <SelectItem value="west">Quartier Ouest</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full">
                <Filter className="h-4 w-4 mr-2" />
                Appliquer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Nombre total d'incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{stats?.total}</div>
              <Badge 
                variant="outline" 
                className={stats?.change.total > 0 ? "text-red-600" : "text-green-600"}
              >
                {stats?.change.total > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stats?.change.total}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Taux de résolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{stats?.resolution_rate}%</div>
              <Badge 
                variant="outline" 
                className={stats?.change.resolution_rate > 0 ? "text-green-600" : "text-red-600"}
              >
                {stats?.change.resolution_rate > 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {stats?.change.resolution_rate}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Temps moyen de résolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline justify-between">
              <div className="text-3xl font-bold">{stats?.avg_resolution_time}</div>
              <Badge 
                variant="outline" 
                className={stats?.change.avg_resolution_time < 0 ? "text-green-600" : "text-red-600"}
              >
                {stats?.change.avg_resolution_time < 0 ? (
                  <TrendingDown className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(stats?.change.avg_resolution_time || 0)}%
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Incidents en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats?.in_progress}</div>
            <div className="text-sm text-gray-500 mt-1">
              + {stats?.pending} en attente
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Evolution des signalements</CardTitle>
            <CardDescription>
              Tendance sur les {timeRange === "week" ? "7 derniers jours" : 
                               timeRange === "month" ? "30 derniers jours" : 
                               timeRange === "quarter" ? "3 derniers mois" : "12 derniers mois"}
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <IncidentTrends />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Analyse des tendances</CardTitle>
            <CardDescription>
              Comparaison avec la période précédente
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <TrendAnalysis incidents={mockIncidents} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Répartition par catégorie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-center">
                <div className="relative h-60 w-60">
                  <PieChart className="h-full w-full text-gray-200" />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="text-3xl font-bold">{stats?.total}</div>
                    <div className="text-sm text-gray-500">incidents</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {categoryBreakdown?.map((item) => (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {item.category === "noise" && "Nuisances sonores"}
                        {item.category === "violence" && "Violence/Agression"}
                        {item.category === "public_disorder" && "Trouble à l'ordre public"}
                        {item.category === "lighting" && "Éclairage défectueux"}
                        {item.category === "garbage" && "Dépôt sauvage"}
                        {item.category === "other" && "Autre"}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{item.count}</span>
                        <span className="text-xs text-gray-500">({item.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          item.category === "noise" ? "bg-purple-500" :
                          item.category === "violence" ? "bg-red-500" :
                          item.category === "public_disorder" ? "bg-orange-500" :
                          item.category === "lighting" ? "bg-yellow-500" :
                          item.category === "garbage" ? "bg-green-500" :
                          "bg-gray-500"
                        }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribution horaire</CardTitle>
            <CardDescription>
              Répartition des incidents par tranche horaire
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {timeDistribution?.map((item) => (
                <div key={item.time} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{item.time}</span>
                    </div>
                    <div className="text-sm font-semibold">{item.count}</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="satisfaction">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            <TabsTrigger value="resolution">Temps de résolution</TabsTrigger>
            <TabsTrigger value="correlation">Corrélations</TabsTrigger>
          </TabsList>
          <TabsContent value="satisfaction">
            <Card>
              <CardHeader>
                <CardTitle>Analyse de la satisfaction</CardTitle>
                <CardDescription>
                  Évaluation de la satisfaction des utilisateurs après résolution
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <SatisfactionAnalyzer feedback={mockFeedback} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="resolution">
            <Card>
              <CardHeader>
                <CardTitle>Analyse des temps de résolution</CardTitle>
                <CardDescription>
                  Mesure de l'efficacité de traitement par catégorie
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResolutionTimeAnalyzer incidents={mockIncidents} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="correlation">
            <Card>
              <CardHeader>
                <CardTitle>Analyse de corrélation</CardTitle>
                <CardDescription>
                  Corrélations entre types d'incidents et facteurs externes
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Module de corrélation avancée en cours de développement
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
