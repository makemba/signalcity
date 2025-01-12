import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp } from "lucide-react";
import { Location, Incident } from "@/types/incident";

const formatCoords = (coords: number[]) => {
  return `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
};

const calculateRiskScore = (incidents: Incident[], location: Location) => {
  return incidents.reduce((score, incident) => {
    const distance = Math.sqrt(
      Math.pow(incident.location.lat - location.lat, 2) +
      Math.pow(incident.location.lng - location.lng, 2)
    );
    const timeWeight = new Date().getTime() - new Date(incident.date).getTime();
    return score + (1 / (distance + 1)) * (1 / (timeWeight + 1));
  }, 0);
};

const HotspotPredictor = ({ incidents }: { incidents: Incident[] }) => {
  const hotspots = useMemo(() => {
    // Algorithme amélioré de clustering pour identifier les zones à risque
    const clusters: Record<string, { coords: number[]; incidents: Incident[] }> = {};
    
    incidents.forEach((incident) => {
      const gridKey = `${Math.round(incident.location.lat)},${Math.round(
        incident.location.lng
      )}`;
      
      if (!clusters[gridKey]) {
        clusters[gridKey] = {
          coords: [incident.location.lat, incident.location.lng],
          incidents: []
        };
      }
      clusters[gridKey].incidents.push(incident);
    });

    return Object.entries(clusters)
      .map(([_, data]) => ({
        coords: data.coords,
        riskScore: calculateRiskScore(data.incidents, {
          lat: data.coords[0],
          lng: data.coords[1]
        }),
        incidentCount: data.incidents.length
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 3);
  }, [incidents]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        Zones à risque prédites
      </h3>
      <div className="space-y-3">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded-lg">
            <div className="flex items-center gap-2">
              <TrendingUp className={`h-4 w-4 ${
                hotspot.riskScore > 0.5 ? "text-red-500" : "text-orange-500"
              }`} />
              <span>Zone {index + 1}: {formatCoords(hotspot.coords)}</span>
            </div>
            <div className="text-sm text-gray-600">
              {hotspot.incidentCount} incidents
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HotspotPredictor;