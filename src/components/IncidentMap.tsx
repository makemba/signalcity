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
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapToken, setMapToken] = useState('pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM2Y2F1NWowMGRqMmtvNWR2NWJ2Y2JrIn0.FhM1bHqMCXR1yUvuqBAIxg');
  const [mapError, setMapError] = useState<string | null>(null);
  const { toast } = useToast();
  const isInitialized = useRef(false);

  // Function to safely clear markers
  const clearMarkers = () => {
    if (markersRef.current) {
      markersRef.current.forEach(marker => {
        try {
          marker.remove();
        } catch (error) {
          console.error('Error removing marker:', error);
        }
      });
      markersRef.current = [];
    }
  };

  // Function to safely add markers
  const addMarkers = () => {
    if (!mapInstance.current) {
      console.log('Map instance not available');
      return;
    }

    try {
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
          );

        // Only add marker if map instance exists
        if (mapInstance.current) {
          marker.addTo(mapInstance.current);
          markersRef.current.push(marker);
        }
      });
    } catch (error) {
      console.error('Error adding markers:', error);
      setMapError('Error adding markers to the map');
    }
  };

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || !mapToken || isInitialized.current) {
      return;
    }

    try {
      console.log('Initializing Mapbox map...');
      mapboxgl.accessToken = mapToken;
      
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [2.3488, 48.8534],
        zoom: 12,
      });

      map.on('load', () => {
        console.log('Map loaded successfully');
        isInitialized.current = true;
        mapInstance.current = map;
        addMarkers();
      });

      map.on('error', (e) => {
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
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
        isInitialized.current = false;
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Erreur lors de l\'initialisation de la carte');
    }
  }, [mapToken, toast]);

  // Update markers when incidents change
  useEffect(() => {
    if (mapInstance.current && isInitialized.current) {
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