import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import { Incident } from "@/types/incident";
import { INCIDENT_CATEGORIES } from "@/lib/constants";

interface PriorityCalculatorProps {
  incidents: Incident[];
}

export default function PriorityCalculator({ incidents }: PriorityCalculatorProps) {
  const calculatePriority = (incident: Incident) => {
    let score = 0;
    
    // Facteur temps
    const age = Date.now() - new Date(incident.date).getTime();
    const ageInDays = age / (1000 * 60 * 60 * 24);
    score += Math.min(ageInDays * 2, 10); // Max 10 points pour l'âge
    
    // Facteur catégorie
    const categoryWeights: { [key: string]: number } = {
      pothole: 5,
      lighting: 3,
      garbage: 4,
      equipment: 3,
      other: 2
    };
    score += categoryWeights[incident.categoryId] || 0;
    
    // Facteur proximité (si disponible)
    if (incident.location) {
      const cityCenter = { lat: 48.8566, lng: 2.3522 }; // Paris
      const distance = calculateDistance(
        incident.location.lat,
        incident.location.lng,
        cityCenter.lat,
        cityCenter.lng
      );
      score += Math.max(5 - distance / 1000, 0); // Points inversement proportionnels à la distance
    }
    
    return score;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Rayon de la Terre en km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
  };

  const prioritizedIncidents = [...incidents]
    .filter(incident => incident.status === "PENDING")
    .map(incident => ({
      ...incident,
      priority: calculatePriority(incident)
    }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 5);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold">Incidents prioritaires</h3>
      </div>

      {prioritizedIncidents.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Pas d'incidents en attente</span>
        </div>
      ) : (
        <div className="space-y-4">
          {prioritizedIncidents.map(incident => {
            const category = INCIDENT_CATEGORIES.find(
              cat => cat.id === incident.categoryId
            );

            return (
              <div
                key={incident.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {category && (
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                  )}
                  <div>
                    <p className="font-medium">{category?.label}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(incident.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    Score: {incident.priority.toFixed(1)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}