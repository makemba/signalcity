import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertCircle, TrendingUp, TrendingDown, Clock } from "lucide-react";
import { Location, Incident } from "@/types/incident";

const formatLocation = (location: Location) => {
  return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
};

const calculatePriorityScore = (incident: Incident) => {
  let score = 0;

  // Time factor (more weight for older incidents)
  const daysOld = Math.floor(
    (new Date().getTime() - new Date(incident.date).getTime()) /
    (1000 * 60 * 60 * 24)
  );
  score += Math.min(daysOld * 2, 50);

  // Category weights
  const categoryWeights: Record<string, number> = {
    pothole: 35,
    lighting: 30,
    garbage: 25,
    graffiti: 20,
    other: 15
  };
  score += categoryWeights[incident.categoryId] || 15;

  // Status weight
  const statusWeights: Record<string, number> = {
    PENDING: 25,
    IN_PROGRESS: 15,
    RESOLVED: 0,
    REJECTED: -10
  };
  score += statusWeights[incident.status];

  // Priority modifier if explicitly set
  const priorityWeights: Record<string, number> = {
    high: 20,
    medium: 10,
    low: 5
  };
  if (incident.priority) {
    score += priorityWeights[incident.priority];
  }

  // Location factor (example: certain areas might be more critical)
  const isInCriticalArea = incident.location.lat > 45 && incident.location.lng < 5;
  if (isInCriticalArea) {
    score += 15;
  }

  return Math.min(score, 100); // Cap at 100
};

const PriorityCalculator = ({ incidents }: { incidents: Incident[] }) => {
  const prioritizedIncidents = useMemo(() => {
    return incidents
      .map((incident) => ({
        ...incident,
        priorityScore: calculatePriorityScore(incident),
        daysOld: Math.floor(
          (new Date().getTime() - new Date(incident.date).getTime()) /
          (1000 * 60 * 60 * 24)
        )
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
      <div className="space-y-4">
        {prioritizedIncidents.map((incident) => (
          <div 
            key={incident.id} 
            className="space-y-2"
          >
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                {incident.priorityScore > 70 ? (
                  <TrendingUp className="text-red-500 h-4 w-4" />
                ) : (
                  <TrendingDown className="text-orange-500 h-4 w-4" />
                )}
                <span className="font-medium">{incident.categoryId}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Score: {incident.priorityScore}
                </span>
              </div>
            </div>
            <div className="pl-4 space-y-1 text-sm text-gray-600">
              <p>Localisation: {formatLocation(incident.location)}</p>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{incident.daysOld} jours</span>
              </div>
              {incident.description && (
                <p className="text-gray-500 truncate">
                  {incident.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default PriorityCalculator;