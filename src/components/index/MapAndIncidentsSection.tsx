
import { Card } from "@/components/ui/card";
import IncidentMap from "@/components/IncidentMap";
import SearchBar from "@/components/SearchBar";
import CategoryFilter from "@/components/CategoryFilter";
import StatusBadges from "@/components/StatusBadges";
import IncidentList from "@/components/IncidentList";

export const MapAndIncidentsSection = () => {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Carte des signalements</h2>
        </div>
        <Card className="p-4">
          <IncidentMap />
        </Card>
      </div>
      
      <div className="space-y-6">
        <SearchBar />
        <CategoryFilter />
        <StatusBadges />
        <IncidentList />
      </div>
    </div>
  );
};
