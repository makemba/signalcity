import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { INCIDENT_CATEGORIES } from "@/lib/constants";

type Incident = {
  id: number;
  categoryId: string;
  location: [number, number];
  status: string;
};

const mockIncidents: Incident[] = [
  {
    id: 1,
    categoryId: "pothole",
    location: [2.3522, 48.8566],
    status: "PENDING",
  },
  {
    id: 2,
    categoryId: "lighting",
    location: [2.3622, 48.8666],
    status: "IN_PROGRESS",
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
      center: [2.3522, 48.8566] as [number, number],
      zoom: 12,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    map.current.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
      })
    );

    mockIncidents.forEach((incident) => {
      const category = INCIDENT_CATEGORIES.find(
        (cat) => cat.id === incident.categoryId
      );

      if (category) {
        const el = document.createElement("div");
        el.className = "marker";
        el.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${category.color}">
          ${category.icon({}).props.children}
        </svg>`;

        new mapboxgl.Marker(el)
          .setLngLat(incident.location)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(`
              <div class="p-2">
                <h3 class="font-medium">${category.label}</h3>
                <p class="text-sm text-gray-600">Status: ${incident.status}</p>
              </div>
            `)
          )
          .addTo(map.current!);
      }
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