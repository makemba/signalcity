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
import { Incident } from "@/types/incident";

const mockIncidents: Incident[] = [
  {
    id: 1,
    categoryId: "pothole",
    date: "2024-02-20",
    status: "RESOLVED",
    resolvedDate: "2024-02-22",
    location: { lat: 48.8566, lng: 2.3522 }
  },
  {
    id: 2,
    categoryId: "lighting",
    date: "2024-02-19",
    status: "IN_PROGRESS",
    location: { lat: 48.8576, lng: 2.3532 }
  },
  {
    id: 3,
    categoryId: "garbage",
    date: "2024-02-18",
    status: "PENDING",
    location: { lat: 48.8586, lng: 2.3542 }
  }
];

const mockFeedback = [
  { incidentId: 1, rating: 4, date: "2024-02-20" },
  { incidentId: 2, rating: 5, date: "2024-02-19" },
  { incidentId: 3, rating: 3, date: "2024-02-18" }
];

export default function Statistics() {
  console.log("Statistics page rendered");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold">Statistiques et Analyses</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <StatsSummary />
          <IncidentTrends />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="p-4">
            <CategoryFilter />
            <AdvancedFilters />
          </Card>
          <Card className="p-4 lg:col-span-2">
            <TrendAnalysis incidents={mockIncidents} />
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HotspotPredictor incidents={mockIncidents} />
          <ResolutionTimeAnalyzer incidents={mockIncidents} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PriorityCalculator incidents={mockIncidents} />
          <SatisfactionAnalyzer feedback={mockFeedback} />
        </div>
      </div>
    </div>
  );
}