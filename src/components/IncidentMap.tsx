import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { INCIDENT_CATEGORIES } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";

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

const MAPBOX_TOKEN = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHM2Y2F1NWowMGRqMmtvNWR2NWJ2Y2JrIn0.FhM1bHqMCXR1yUvuqBAIxg';

const IncidentMap: React.FC<IncidentMapProps> = ({ incidents = [] }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      console.log('Initializing Mapbox map...');
      mapboxgl.accessToken = MAPBOX_TOKEN;

      // Create new map instance
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [2.3488, 48.8534],
        zoom: 12,
      });

      // Store map instance in ref
      mapInstance.current = map;

      // Handle map load event
      map.on('load', () => {
        console.log('Map loaded successfully');
      });

      // Handle map errors
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
        console.log('Cleaning up map instance');
        // Remove all markers
        markersRef.current.forEach(marker => {
          marker.remove();
        });
        markersRef.current = [];
        
        // Remove map
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Erreur lors de l\'initialisation de la carte');
      return undefined;
    }
  }, [toast]);

  // Handle markers separately
  useEffect(() => {
    if (!mapInstance.current || mapError) return;

    try {
      // Clean existing markers
      markersRef.current.forEach(marker => marker.remove());
      markersRef.current = [];

      // Add new markers
      incidents.forEach((incident) => {
        const category = INCIDENT_CATEGORIES.find(
          (cat) => cat.id === incident.category
        );
        
        if (!category) return;

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
          .addTo(mapInstance.current);

        markersRef.current.push(marker);
      });
    } catch (error) {
      console.error('Error updating markers:', error);
      toast({
        title: "Erreur de marqueurs",
        description: "Impossible de mettre à jour les marqueurs sur la carte",
        variant: "destructive",
      });
    }
  }, [incidents, mapError, toast]);

  return (
    <div>
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