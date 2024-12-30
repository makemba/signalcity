import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type Incident = {
  id: number;
  type: string;
  location: [number, number]; // Spécifie explicitement un tuple de deux nombres
  status: string;
};

const mockIncidents: Incident[] = [
  {
    id: 1,
    type: "Nid de poule",
    location: [2.3522, 48.8566], // Paris coordinates
    status: "En attente",
  },
  {
    id: 2,
    type: "Éclairage défectueux",
    location: [2.3622, 48.8666],
    status: "En cours",
  },
];

export default function IncidentMap() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  const initializeMap = () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [2.3522, 48.8566] as [number, number], // Spécifie le type explicitement
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));

    // Add markers for incidents
    mockIncidents.forEach((incident) => {
      const marker = new mapboxgl.Marker()
        .setLngLat(incident.location)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${incident.type}</h3><p>Status: ${incident.status}</p>`
          )
        )
        .addTo(map.current!);
    });

    setIsMapInitialized(true);
  };

  useEffect(() => {
    if (!isMapInitialized && mapboxToken) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [mapboxToken, isMapInitialized]);

  if (!isMapInitialized) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Carte des incidents</h2>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>Cliquez sur la carte pour signaler un incident</span>
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            Pour utiliser la carte, veuillez entrer votre token public Mapbox.
            Vous pouvez le trouver sur votre tableau de bord Mapbox après avoir créé un compte sur{" "}
            <a
              href="https://www.mapbox.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
              placeholder="Entrez votre token public Mapbox"
              className="flex-1"
            />
            <Button onClick={initializeMap} disabled={!mapboxToken}>
              Initialiser la carte
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Carte des incidents</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>Cliquez sur la carte pour signaler un incident</span>
        </div>
      </div>
      <div className="h-[400px] rounded-lg overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    </div>
  );
}