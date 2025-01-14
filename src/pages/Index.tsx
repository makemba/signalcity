import Header from "@/components/Header";
import IncidentForm from "@/components/IncidentForm";
import IncidentList from "@/components/IncidentList";
import IncidentMap from "@/components/IncidentMap";
import StatsSummary from "@/components/StatsSummary";
import CategoryFilter from "@/components/CategoryFilter";
import StatusBadges from "@/components/StatusBadges";
import ExportButton from "@/components/ExportButton";
import TrendAnalysis from "@/components/TrendAnalysis";
import HotspotPredictor from "@/components/HotspotPredictor";
import ResolutionTimeAnalyzer from "@/components/ResolutionTimeAnalyzer";
import PriorityCalculator from "@/components/PriorityCalculator";
import SatisfactionAnalyzer from "@/components/SatisfactionAnalyzer";
import AdvancedFilters from "@/components/AdvancedFilters";
import IncidentTrends from "@/components/IncidentTrends";
import { useToast } from "@/hooks/use-toast";
import { Incident } from "@/types/incident";

// Mock data for demonstration
const mockIncidents: Incident[] = [
  {
    id: 1,
    categoryId: "pothole",
    location: { lat: 48.8566, lng: 2.3522 },
    date: "2024-02-20",
    status: "PENDING",
  },
  {
    id: 2,
    categoryId: "lighting",
    location: { lat: 48.8566, lng: 2.3522 },
    date: "2024-02-19",
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    categoryId: "garbage",
    location: { lat: 48.8566, lng: 2.3522 },
    date: "2024-02-18",
    status: "RESOLVED",
    resolvedDate: "2024-02-19",
  },
];

const mockFeedback = [
  { incidentId: 1, rating: 4, date: "2024-02-20" },
  { incidentId: 2, rating: 5, date: "2024-02-19" },
  { incidentId: 3, rating: 2, date: "2024-02-18" },
];

export default function Index() {
  const { toast } = useToast();

  const handleDataUpdate = () => {
    console.log("Données mises à jour");
    toast({
      title: "Mise à jour réussie",
      description: "Les données ont été actualisées avec succès.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <StatsSummary />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            <IncidentTrends />
            <HotspotPredictor incidents={mockIncidents} />
          </div>
          <div className="space-y-6">
            <ResolutionTimeAnalyzer incidents={mockIncidents} />
            <SatisfactionAnalyzer feedback={mockFeedback} />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Carte des signalements</h2>
                <ExportButton />
              </div>
              <IncidentMap />
            </div>
            <div className="space-y-6">
              <AdvancedFilters />
              <CategoryFilter />
              <StatusBadges />
              <IncidentList />
            </div>
          </div>
          <div className="space-y-8">
            <PriorityCalculator incidents={mockIncidents} />
            <TrendAnalysis incidents={mockIncidents} />
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Nouveau signalement</h3>
              <IncidentForm onSubmit={handleDataUpdate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}