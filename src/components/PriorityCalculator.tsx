import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Location, Incident } from "@/types/incident";

const formatLocation = (location: Location) => {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
};

const PriorityCalculator = ({ incidents }: { incidents: Incident[] }) => {
  const prioritizedIncidents = useMemo(() => {
    // Algorithme de priorisation basé sur plusieurs facteurs
    return incidents
      .filter((incident) => incident.status === "PENDING")
      .map((incident) => {
        // Calculer le score de priorité
        let score = 0;

        // Facteur temps
        const daysOld = Math.floor(
          (new Date().getTime() - new Date(incident.date).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        score += daysOld * 2;

        // Facteur catégorie
        if (incident.categoryId === "pothole") score += 5;
        if (incident.categoryId === "lighting") score += 3;

        return {
          ...incident,
          priorityScore: score,
        };
      })
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5);
  }, [incidents]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Incidents prioritaires</h3>
      <div className="space-y-3">
        {prioritizedIncidents.map((incident) => (
          <div key={incident.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle
                className={`h-4 w-4 ${
                  incident.priorityScore > 10 ? "text-red-500" : "text-orange-500"
                }`}
              />
              <span>{formatLocation(incident.location)}</span>
            </div>
            <span>Score: {incident.priorityScore}</span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PriorityCalculator;