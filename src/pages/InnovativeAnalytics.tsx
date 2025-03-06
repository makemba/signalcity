
import { DashboardShell } from "@/components/DashboardShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, ArrowLeft, BarChart3, Map, TrendingUp, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import IncidentHotspotMap from "@/components/IncidentHotspotMap";
import PredictiveIncidentAnalysis from "@/components/PredictiveIncidentAnalysis";
import CategoryDistribution from "@/components/CategoryDistribution";
import IncidentTrends from "@/components/IncidentTrends";

const InnovativeAnalytics = () => {
  return (
    <DashboardShell>
      <div className="container mx-auto py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Analyse avancée</h1>
                <Badge variant="outline" className="text-blue-600 bg-blue-50">Beta</Badge>
              </div>
              <p className="text-muted-foreground mt-1">
                Visualisez les tendances, prédictions et points chauds des incidents
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <DateRangePicker />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="noise">Nuisance sonore</SelectItem>
                  <SelectItem value="environment">Environnement</SelectItem>
                  <SelectItem value="security">Sécurité</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Exporter
              </Button>
            </div>
          </div>

          <Tabs defaultValue="hotspots" className="space-y-4">
            <TabsList className="w-full justify-start border-b pb-0">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="hotspots" className="flex items-center gap-2">
                <Map className="h-4 w-4" />
                <span>Points chauds</span>
              </TabsTrigger>
              <TabsTrigger value="predictive" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Prédictions</span>
              </TabsTrigger>
              <TabsTrigger value="ai-insights" className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                <span>IA Insights</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CategoryDistribution />
                <IncidentTrends />
              </div>
            </TabsContent>

            <TabsContent value="hotspots" className="space-y-4">
              <IncidentHotspotMap />
            </TabsContent>

            <TabsContent value="predictive" className="space-y-4">
              <PredictiveIncidentAnalysis />
            </TabsContent>

            <TabsContent value="ai-insights" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-500" />
                    Analyse intelligente des incidents
                  </CardTitle>
                  <CardDescription>
                    Notre modèle d'IA analyse les données pour dégager des tendances cachées et des corrélations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 border border-purple-100 rounded-md p-4">
                    <p className="text-purple-800 text-sm">
                      Cette fonctionnalité est en cours de développement et sera bientôt disponible. 
                      Elle permettra d'analyser les corrélations entre différents types d'incidents, 
                      d'identifier des modèles temporels et spatiaux, et de générer des recommandations automatisées.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardShell>
  );
};

export default InnovativeAnalytics;
