import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import { Location, Incident } from "@/types/incident";

const formatLocation = (location: Location) => {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
};

const calculatePriorityScore = (incident: Incident) => {
  let score = 0;

  // Facteur temps (plus ancien = plus prioritaire)
  const daysOld = Math.floor(
    (new Date().getTime() - new Date(incident.date).getTime()) /
    (1000 * 60 * 60 * 24)
  );
  score += Math.min(daysOld * 2, 50); // Plafonné à 50 points

  // Facteur catégorie
  switch (incident.categoryId) {
    case "pothole":
      score += 30;
      break;
    case "lighting":
      score += 25;
      break;
    case "garbage":
      score += 20;
      break;
    default:
      score += 15;
  }

  // Facteur statut
  if (incident.status === "PENDING") score += 20;
  
  return score;
};

const PriorityCalculator = ({ incidents }: { incidents: Incident[] }) => {
  const prioritizedIncidents = useMemo(() => {
    return incidents
      .filter((incident) => incident.status === "PENDING")
      .map((incident) => ({
        ...incident,
        priorityScore: calculatePriorityScore(incident),
      }))
      .sort((a, b) => b.priorityScore - a.priorityScore)
      .slice(0, 5);
  }, [incidents]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-red-500" />
        Incidents prioritaires
      </h3>
      <div className="space-y-3">
        {prioritizedIncidents.map((incident) => (
          <div 
            key={incident.id} 
            className="flex items-center justify-between p-2 bg-red-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              {incident.priorityScore > 70 ? (
                <TrendingUp className="text-red-500 h-4 w-4" />
              ) : (
                <TrendingDown className="text-orange-500 h-4 w-4" />
              )}
              <span>{formatLocation(incident.location)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Score: {incident.priorityScore}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PriorityCalculator;