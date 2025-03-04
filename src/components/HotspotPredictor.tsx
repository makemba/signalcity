
import { useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AlertTriangle, TrendingUp, MapPin } from "lucide-react";
import { Location, Incident } from "@/types/incident";
import { Badge } from "@/components/ui/badge";

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
    const timeWeight = Math.exp(-((now - new Date(incident.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)));
    
    // Category weight
    const categoryWeight = incident.category === "pothole" ? 1.5 : 1;
    
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
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3)
      }))
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 3);
  }, [incidents]);

  const getRiskColor = (score: number) => {
    if (score > 0.7) return "text-red-500 bg-red-50";
    if (score > 0.4) return "text-orange-500 bg-orange-50";
    return "text-yellow-500 bg-yellow-50";
  };

  return (
    <Card className="shadow-md border-t-4 border-t-orange-500 transition-all hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Zones à risque prédites
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hotspots.length > 0 ? (
            hotspots.map((hotspot, index) => (
              <div key={index} className="space-y-2 animate-in fade-in duration-300" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2">
                    <div className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <span className="font-medium">Zone à risque</span>
                      <p className="text-xs text-gray-500">{formatCoords(hotspot.coords)}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className={`${getRiskColor(hotspot.riskScore)} flex items-center gap-1`}>
                    <TrendingUp className="h-3 w-3" />
                    <span>{hotspot.riskScore.toFixed(2)}</span>
                  </Badge>
                </div>
                <div className="pl-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">{hotspot.incidentCount}</span> incidents recensés
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    <p className="font-medium text-xs uppercase tracking-wider text-gray-500 mt-2 mb-1">Incidents récents:</p>
                    <div className="space-y-1">
                      {hotspot.recentIncidents.map((incident, i) => (
                        <div key={i} className="flex items-start gap-2 py-1 px-2 rounded bg-gray-50">
                          <span className="text-xs text-gray-400 mt-0.5">{new Date(incident.createdAt).toLocaleDateString()}</span>
                          <span className="text-xs font-medium capitalize">{incident.category}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <AlertTriangle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Pas suffisamment de données pour générer des prédictions</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HotspotPredictor;
