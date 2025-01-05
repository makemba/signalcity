import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Incident } from "@/types/incident";

const TrendAnalysis = ({ incidents }: { incidents: Incident[] }) => {
  const trends = useMemo(() => {
    // Algorithme pour calculer les tendances sur les 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentIncidents = incidents.filter(
      (incident) => new Date(incident.date) >= thirtyDaysAgo
    );

    const categoryCount: Record<string, number> = {};
    recentIncidents.forEach((incident) => {
      categoryCount[incident.categoryId] = (categoryCount[incident.categoryId] || 0) + 1;
    });

    // Trier les catégories par nombre d'incidents
    return Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [incidents]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Tendances sur 30 jours</h3>
      <div className="space-y-3">
        {trends.map(([category, count]) => (
          <div key={category} className="flex items-center justify-between">
            <span>{category}</span>
            <div className="flex items-center gap-2">
              <span>{count} incidents</span>
              {count > 10 ? (
                <TrendingUp className="text-red-500 h-4 w-4" />
              ) : (
                <TrendingDown className="text-green-500 h-4 w-4" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default TrendAnalysis;