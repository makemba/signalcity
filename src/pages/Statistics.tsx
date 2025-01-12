import { Card } from "@/components/ui/card";
import IncidentTrends from "@/components/IncidentTrends";
import ResolutionTimeAnalyzer from "@/components/ResolutionTimeAnalyzer";
import SatisfactionAnalyzer from "@/components/SatisfactionAnalyzer";
import TrendAnalysis from "@/components/TrendAnalysis";
import StatsSummary from "@/components/StatsSummary";
import { Incident } from "@/types/incident";

const mockIncidents: Incident[] = [
  {
    id: 1,
    categoryId: "pothole",
    date: "2024-02-20",
    status: "RESOLVED" as const,
    resolvedDate: "2024-02-22",
    location: { lat: 48.8566, lng: 2.3522 },
    priority: "high",
    description: "Large pothole on main street"
  },
  {
    id: 2,
    categoryId: "lighting",
    date: "2024-02-18",
    status: "IN_PROGRESS" as const,
    location: { lat: 48.8584, lng: 2.3536 },
    priority: "medium",
    description: "Street light not working"
  },
  {
    id: 3,
    categoryId: "garbage",
    date: "2024-02-15",
    status: "PENDING" as const,
    location: { lat: 48.8606, lng: 2.3376 },
    priority: "low",
    description: "Overflowing garbage bin"
  }
];

const mockFeedback = [
  { incidentId: 1, rating: 4, date: "2024-02-20", comment: "Quick resolution" },
  { incidentId: 2, rating: 5, date: "2024-02-19", comment: "Very satisfied" },
  { incidentId: 3, rating: 2, date: "2024-02-18", comment: "Too slow" },
  { incidentId: 4, rating: 3, date: "2024-02-17", comment: "Average service" },
  { incidentId: 5, rating: 5, date: "2024-02-16", comment: "Excellent work" }
];

const Statistics = () => {
  console.log("Statistics page rendered");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Statistiques et analyses</h1>
      
      <StatsSummary />

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