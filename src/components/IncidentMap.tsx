import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { INCIDENT_CATEGORIES } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";

interface Incident {
  id: string;
  latitude: number;
  longitude: number;
  category: string;
  description: string;
}

interface IncidentMapProps {
  incidents?: Incident[];
}

const IncidentMap: React.FC<IncidentMapProps> = ({ incidents = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapToken, setMapToken] = useState('pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM2Y2F1NWowMGRqMmtvNWR2NWJ2Y2JrIn0.FhM1bHqMCXR1yUvuqBAIxg');
  const [mapError, setMapError] = useState<string | null>(null);
  const { toast } = useToast();

  // Function to clear markers
  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  // Function to add markers
  const addMarkers = () => {
    if (!map.current) return;

    clearMarkers();
    
    incidents.forEach((incident) => {
      const category = INCIDENT_CATEGORIES.find(cat => cat.id === incident.category);
      if (!category) {
        console.log(`Category not found for incident: ${incident.id}`);
        return;
      }

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = category.color;
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";

      const marker = new mapboxgl.Marker(el)
        .setLngLat([incident.longitude, incident.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${category.label}</h3><p>${incident.description}</p>`
          )
        )
        .addTo(map.current);

      markers.current.push(marker);
    });
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapToken) {
      console.log('Map container or token not available');
      return;
    }

    try {
      console.log('Initializing Mapbox map...');
      mapboxgl.accessToken = mapToken;
      
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [2.3488, 48.8534],
        zoom: 12,
      });

      map.current = newMap;

      newMap.on('load', () => {
        console.log('Map loaded successfully');
        addMarkers();
      });

      newMap.on('error', (e) => {
        console.error('Mapbox error:', e);
        setMapError('Erreur lors du chargement de la carte');
        toast({
          title: "Erreur de carte",
          description: "Un problème est survenu lors du chargement de la carte",
          variant: "destructive",
        });
      });

      // Cleanup function
      return () => {
        clearMarkers();
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Erreur lors de l\'initialisation de la carte');
    }
  }, [mapToken, toast]);

  // Update markers when incidents change
  useEffect(() => {
    if (map.current) {
      addMarkers();
    }
  }, [incidents]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Mapbox Token</label>
        <Input
          type="text"
          value={mapToken}
          onChange={(e) => setMapToken(e.target.value)}
          placeholder="Enter your Mapbox token"
          className="font-mono text-sm"
        />
      </div>
      
      {mapError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {mapError}
        </div>
      )}
      <div ref={mapContainer} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default IncidentMap;