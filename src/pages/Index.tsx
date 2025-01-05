import Header from "@/components/Header";
import IncidentForm from "@/components/IncidentForm";
import IncidentList from "@/components/IncidentList";
import IncidentMap from "@/components/IncidentMap";
import StatsSummary from "@/components/StatsSummary";
import CategoryFilter from "@/components/CategoryFilter";
import StatusBadges from "@/components/StatusBadges";
import SearchBar from "@/components/SearchBar";
import ExportButton from "@/components/ExportButton";

export default function Index() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto py-8 px-4">
        <StatsSummary />
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