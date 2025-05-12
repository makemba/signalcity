
import { BarChart3 } from "lucide-react";
import CategoryDistribution from "@/components/CategoryDistribution";
import IncidentTrends from "@/components/IncidentTrends";

export const DataVisualizationSection = () => {
  return (
    <div className="mb-12 bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-2xl font-semibold mb-6 text-center flex items-center justify-center">
        <BarChart3 className="h-6 w-6 mr-2 text-blue-500" />
        Visualisation des données en temps réel
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <CategoryDistribution />
        <IncidentTrends />
      </div>
    </div>
  );
};
