
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Incident } from "@/types/incident";

interface PriorityCalculatorProps {
  incidents: Incident[];
}

export default function PriorityCalculator({ incidents }: PriorityCalculatorProps) {
  const calculatePriority = (incident: Incident) => {
    let score = 0;
    
    // Time factor - newer incidents get higher priority
    const age = Date.now() - new Date(incident.createdAt).getTime();
    score += Math.max(0, 100 - Math.floor(age / (1000 * 60 * 60 * 24))); // Decrease score with age
    
    // Category factor
    if (incident.category === "pothole") score += 30;
    if (incident.category === "lighting") score += 20;
    
    return score;
  };

  const prioritizedIncidents = [...incidents]
    .sort((a, b) => calculatePriority(b) - calculatePriority(a))
    .slice(0, 5);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-yellow-500" />
        Incidents prioritaires
      </h3>
      <div className="space-y-4">
        {prioritizedIncidents.map((incident, index) => (
          <div
            key={incident.id}
            className="p-3 bg-gray-50 rounded-lg flex justify-between items-center"
          >
            <div>
              <span className="font-medium">#{index + 1}</span>
              <p className="text-sm text-gray-600">
                {incident.category} - Score: {calculatePriority(incident)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
