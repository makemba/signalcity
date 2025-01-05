import Header from "@/components/Header";
import IncidentForm from "@/components/IncidentForm";
import IncidentList from "@/components/IncidentList";
import IncidentMap from "@/components/IncidentMap";
import StatsSummary from "@/components/StatsSummary";
import CategoryFilter from "@/components/CategoryFilter";
import StatusBadges from "@/components/StatusBadges";
import SearchBar from "@/components/SearchBar";
import ExportButton from "@/components/ExportButton";
import TrendAnalysis from "@/components/TrendAnalysis";
import HotspotPredictor from "@/components/HotspotPredictor";
import ResolutionTimeAnalyzer from "@/components/ResolutionTimeAnalyzer";
import PriorityCalculator from "@/components/PriorityCalculator";
import SatisfactionAnalyzer from "@/components/SatisfactionAnalyzer";

interface Location {
  lat: number;
  lng: number;
}

interface Incident {
  id: number;
  categoryId: string;
  location: Location;
  date: string;
  status: string;
  resolvedDate?: string;
}

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
  { incidentId: 1, rating: 4 },
  { incidentId: 2, rating: 5 },
  { incidentId: 3, rating: 2 },
];

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <StatsSummary />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <TrendAnalysis incidents={mockIncidents} />
          <HotspotPredictor incidents={mockIncidents} />
          <ResolutionTimeAnalyzer incidents={mockIncidents} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PriorityCalculator incidents={mockIncidents} />
          <SatisfactionAnalyzer feedback={mockFeedback} />
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
            <div>
              <SearchBar />
              <CategoryFilter />
              <StatusBadges />
              <IncidentList />
            </div>
          </div>
          <div>
            <IncidentForm />
          </div>
        </div>
      </main>
    </div>
  );
}