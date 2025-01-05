import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface Location {
  lat: number;
  lng: number;
}

interface Incident {
  location: Location;
  date: string;
}

const HotspotPredictor = ({ incidents }: { incidents: Incident[] }) => {
  const hotspots = useMemo(() => {
    // Algorithme de clustering pour identifier les zones à risque
    const clusters: Record<string, number> = {};
    
    incidents.forEach((incident) => {
      // Arrondir les coordonnées pour créer des zones
      const gridKey = `${Math.round(incident.location.lat)},${Math.round(
        incident.location.lng
      )}`;
      clusters[gridKey] = (clusters[gridKey] || 0) + 1;
    });

    // Identifier les zones avec le plus d'incidents
    return Object.entries(clusters)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([coords, count]) => ({
        coords: coords.split(",").map(Number),
        count,
      }));
  }, [incidents]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Zones à risque prédites</h3>
      <div className="space-y-3">
        {hotspots.map((hotspot, index) => (
          <div key={index} className="flex items-center gap-2">
            <AlertTriangle className="text-orange-500 h-4 w-4" />
            <span>
              Zone {index + 1}: {hotspot.count} incidents ({hotspot.coords[0]}, {hotspot.coords[1]})
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default HotspotPredictor;