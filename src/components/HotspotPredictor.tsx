import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, MapPin } from "lucide-react";
import { Location, Incident } from "@/types/incident";

const formatCoords = (coords: number[]) => {
  return `${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}`;
};

const calculateRiskScore = (incidents: Incident[], location: Location) => {
  const now = new Date().getTime();
  
  return incidents.reduce((score, incident) => {
    // Distance calculation using Haversine formula
    const R = 6371; // Earth's radius in km
    const dLat = (incident.location.lat - location.lat) * Math.PI / 180;
    const dLon = (incident.location.lng - location.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(location.lat * Math.PI / 180) * Math.cos(incident.location.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;

    // Time weight calculation (more recent incidents have higher weight)
    const timeWeight = Math.exp(-((now - new Date(incident.date).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    // Category weight
    const categoryWeight = incident.categoryId === "pothole" ? 1.5 : 1;
    
    return score + (1 / (distance + 1)) * timeWeight * categoryWeight;
  }, 0);
};

const HotspotPredictor = ({ incidents }: { incidents: Incident[] }) => {
  const hotspots = useMemo(() => {
    // DBSCAN-inspired clustering algorithm
    const eps = 0.01; // Maximum distance between points in a cluster
    const minPts = 2; // Minimum points to form a cluster
    const clusters: Array<{ coords: number[]; incidents: Incident[] }> = [];
    const visited = new Set<number>();

    const getNeighbors = (incident: Incident) => {
      return incidents.filter(inc => {
        const distance = Math.sqrt(
          Math.pow(inc.location.lat - incident.location.lat, 2) +
          Math.pow(inc.location.lng - incident.location.lng, 2)
        );
        return distance < eps;
      });
    };

    incidents.forEach((incident, index) => {
      if (visited.has(index)) return;
      visited.add(index);

      const neighbors = getNeighbors(incident);
      if (neighbors.length >= minPts) {
        const cluster = {
          coords: [incident.location.lat, incident.location.lng],
          incidents: [incident, ...neighbors]
        };
        clusters.push(cluster);
      }
    });

    return clusters
      .map(cluster => ({
        coords: cluster.coords,
        riskScore: calculateRiskScore(cluster.incidents, {
          lat: cluster.coords[0],
          lng: cluster.coords[1]
        }),
        incidentCount: cluster.incidents.length,
        recentIncidents: cluster.incidents
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)
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
      <div className="space-y-4">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="font-medium">Zone {index + 1}</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${
                  hotspot.riskScore > 0.5 ? "text-red-500" : "text-orange-500"
                }`} />
                <span className="text-sm font-medium">
                  Score: {hotspot.riskScore.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="pl-4 space-y-1">
              <p className="text-sm text-gray-600">
                Coordonnées: {formatCoords(hotspot.coords)}
              </p>
              <p className="text-sm text-gray-600">
                {hotspot.incidentCount} incidents au total
              </p>
              <div className="text-sm text-gray-500">
                <p className="font-medium">Incidents récents:</p>
                <ul className="list-disc pl-4">
                  {hotspot.recentIncidents.map((incident, i) => (
                    <li key={i}>
                      {new Date(incident.date).toLocaleDateString()} - {incident.categoryId}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HotspotPredictor;