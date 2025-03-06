
import { Card } from "@/components/ui/card";
import StatsSummary from "@/components/StatsSummary";
import IncidentTrends from "@/components/IncidentTrends";
import CategoryFilter from "@/components/CategoryFilter";
import AdvancedFilters from "@/components/AdvancedFilters";
import TrendAnalysis from "@/components/TrendAnalysis";
import HotspotPredictor from "@/components/HotspotPredictor";
import ResolutionTimeAnalyzer from "@/components/ResolutionTimeAnalyzer";
import PriorityCalculator from "@/components/PriorityCalculator";
import SatisfactionAnalyzer from "@/components/SatisfactionAnalyzer";
import CategoryDistribution from "@/components/CategoryDistribution";
import IncidentHeatMap from "@/components/IncidentHeatMap";
import { DashboardShell } from "@/components/DashboardShell";
import { Incident, Feedback } from "@/types/incident";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart, Filter, Map } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Partners from "@/components/Partners";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Statistics() {
  const { data: incidents = [], isLoading: isLoadingIncidents } = useQuery({
    queryKey: ["incidents-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match the Incident type
      return data.map(incident => ({
        id: String(incident.id),
        title: incident.description?.split(' ').slice(0, 3).join(' ') || "Untitled incident",
        description: incident.description || "",
        category: incident.category_id || "other",
        categoryId: incident.category_id,
        location: {
          lat: incident.location_lat,
          lng: incident.location_lng
        },
        date: incident.created_at,
        createdAt: incident.created_at,
        status: incident.status,
        resolvedDate: incident.resolved_at || undefined,
        priority: incident.priority as "high" | "medium" | "low" | undefined,
        assignedTo: incident.assigned_to,
        lastUpdated: incident.created_at, // Using created_at instead of updated_at
        severity: typeof incident.metadata === 'object' ? (incident.metadata as any)?.severity : undefined,
        estimatedResolutionTime: typeof incident.metadata === 'object' ? (incident.metadata as any)?.estimatedResolutionTime : undefined
      })) as Incident[];
    },
  });

  const { data: feedbackData = [], isLoading: isLoadingFeedback } = useQuery({
    queryKey: ["feedback-stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform the data to match the Feedback type
      return data.map(feedback => ({
        incidentId: String(feedback.incident_id),
        rating: feedback.rating,
        comment: feedback.comment,
        date: feedback.created_at,
        userId: feedback.created_by
      })) as Feedback[];
    },
  });

  const handleExportData = () => {
    if (!incidents.length) return;
    
    const csvContent = [
      // CSV header
      ["ID", "Titre", "Catégorie", "Statut", "Priorité", "Date de création", "Date de résolution"].join(","),
      // CSV data rows
      ...incidents.map(incident => [
        incident.id,
        `"${incident.title.replace(/"/g, '""')}"`,
        incident.category,
        incident.status,
        incident.priority || "non définie",
        new Date(incident.createdAt).toLocaleDateString(),
        incident.resolvedDate ? new Date(incident.resolvedDate).toLocaleDateString() : "non résolu"
      ].join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `incidents-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoadingIncidents || isLoadingFeedback) {
    return (
      <DashboardShell>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="animate-pulse space-y-6">
              <div className="h-8 w-64 bg-gray-200 rounded"></div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-64 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
        <motion.div 
          className="max-w-7xl mx-auto space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <div className="flex justify-between items-center">
            <motion.h1 
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800"
              variants={itemVariants}
            >
              Statistiques et Analyses
            </motion.h1>
            
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download size={16} />
              Exporter les données
            </Button>
          </div>
          
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <FileBarChart size={16} />
                Tableau de bord
              </TabsTrigger>
              <TabsTrigger value="map" className="flex items-center gap-2">
                <Map size={16} />
                Carte
              </TabsTrigger>
              <TabsTrigger value="filters" className="flex items-center gap-2">
                <Filter size={16} />
                Filtres avancés
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="dashboard" className="space-y-6">
              <motion.div variants={itemVariants}>
                <StatsSummary />
              </motion.div>
              
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={itemVariants}
              >
                <IncidentTrends />
                <CategoryDistribution />
              </motion.div>
            
              <motion.div 
                className="grid grid-cols-1 gap-6"
                variants={itemVariants}
              >
                <Card className="p-4 lg:col-span-2">
                  <TrendAnalysis incidents={incidents} />
                </Card>
              </motion.div>
            
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={itemVariants}
              >
                <HotspotPredictor incidents={incidents} />
                <ResolutionTimeAnalyzer incidents={incidents} />
              </motion.div>
            
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                variants={itemVariants}
              >
                <PriorityCalculator incidents={incidents} />
                <SatisfactionAnalyzer feedback={feedbackData} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="map">
              <div className="space-y-6">
                <Card className="p-4">
                  <IncidentHeatMap />
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="filters">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-4 lg:col-span-1">
                  <h3 className="text-lg font-semibold mb-4">Filtres</h3>
                  <div className="space-y-4">
                    <CategoryFilter />
                    <Separator className="my-4" />
                    <AdvancedFilters />
                  </div>
                </Card>
                
                <Card className="p-4 lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Résultats</h3>
                  <p className="text-sm text-gray-500">
                    Sélectionnez des filtres pour afficher les résultats correspondants
                  </p>
                  <div className="h-64 flex items-center justify-center border rounded-md mt-4 bg-gray-50">
                    <p className="text-gray-400">Les résultats filtrés apparaîtront ici</p>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
          
          <Separator className="my-8" />
          
          <motion.div variants={itemVariants}>
            <h2 className="text-2xl font-bold mb-6">Nos partenaires dans la collecte de données</h2>
            <Partners />
          </motion.div>
        </motion.div>
      </div>
    </DashboardShell>
  );
}
