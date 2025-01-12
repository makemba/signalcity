import { Card } from "@/components/ui/card";
import IncidentTrends from "@/components/IncidentTrends";
import ResolutionTimeAnalyzer from "@/components/ResolutionTimeAnalyzer";
import SatisfactionAnalyzer from "@/components/SatisfactionAnalyzer";
import TrendAnalysis from "@/components/TrendAnalysis";

const mockIncidents = [
  {
    id: 1,
    categoryId: "pothole",
    date: "2024-02-20",
    status: "RESOLVED",
    resolvedDate: "2024-02-22",
    location: { lat: 48.8566, lng: 2.3522 }
  },
  // ... more mock incidents
];

const mockFeedback = [
  { incidentId: 1, rating: 4, date: "2024-02-20" },
  { incidentId: 2, rating: 5, date: "2024-02-19" },
  { incidentId: 3, rating: 2, date: "2024-02-18" },
];

const Statistics = () => {
  console.log("Statistics page rendered");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Statistiques et analyses</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <IncidentTrends />
        <ResolutionTimeAnalyzer incidents={mockIncidents} />
        <SatisfactionAnalyzer feedback={mockFeedback} />
        <TrendAnalysis incidents={mockIncidents} />
      </div>
    </div>
  );
};

export default Statistics;