
import { BarChart3 } from "lucide-react";
import CategoryDistribution from "@/components/CategoryDistribution";
import IncidentTrends from "@/components/IncidentTrends";

export const DataVisualizationSection = () => {
  return (
    <section 
      className="mb-12 bg-white p-6 rounded-lg shadow-sm" 
      role="region" 
      aria-labelledby="data-visualization-title"
    >
      <h2 
        id="data-visualization-title" 
        className="text-2xl font-semibold mb-6 text-center flex items-center justify-center"
        tabIndex={0}
      >
        <BarChart3 className="h-6 w-6 mr-2 text-blue-500" aria-hidden="true" />
        <span>Visualisation des données en temps réel</span>
      </h2>
      <div 
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        role="presentation"
      >
        <div aria-label="Distribution par catégorie">
          <CategoryDistribution />
        </div>
        <div aria-label="Tendances des incidents">
          <IncidentTrends />
        </div>
      </div>
    </section>
  );
};
