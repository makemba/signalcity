import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { INCIDENT_CATEGORIES } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface IncidentMapProps {
  incidents?: any[];
}

const IncidentMap: React.FC<IncidentMapProps> = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const tokenInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const { data: incidents } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const initializeMap = (token: string) => {
    if (!mapContainer.current) return;
    
    try {
      console.log('Initializing map with token...');
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [2.3488, 48.8534],
        zoom: 12,
      });

      map.current.on('load', () => {
        console.log('Map loaded successfully');
        if (incidents) {
          updateMarkers();
        }
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          title: "Map Error",
          description: "An error occurred while loading the map",
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      toast({
        title: "Initialization Error",
        description: "Failed to initialize the map",
        variant: "destructive",
      });
    }
  };

  const clearMarkers = () => {
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
  };

  const updateMarkers = () => {
    if (!map.current || !incidents) return;

    try {
      clearMarkers();
      
      incidents.forEach((incident) => {
        const category = INCIDENT_CATEGORIES.find(cat => cat.id === incident.category_id);
        if (!category) return;

        const el = document.createElement("div");
        el.className = "marker";
        el.style.backgroundColor = category.color;
        el.style.width = "20px";
        el.style.height = "20px";
        el.style.borderRadius = "50%";
        el.style.cursor = "pointer";

        const marker = new mapboxgl.Marker(el)
          .setLngLat([incident.location_lng, incident.location_lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML(
              `<h3>${category.label}</h3><p>${incident.description || ""}</p>`
            )
          )
          .addTo(map.current);

        markers.current.push(marker);
      });
    } catch (error) {
      console.error('Error updating markers:', error);
    }
  };

  const handleTokenChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newToken = event.target.value;
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    clearMarkers();
    if (newToken) {
      initializeMap(newToken);
    }
  };

  useEffect(() => {
    if (incidents) {
      updateMarkers();
    }
  }, [incidents]);

  useEffect(() => {
    return () => {
      clearMarkers();
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <label className="text-sm font-medium">Mapbox Token</label>
        <Input
          ref={tokenInputRef}
          type="text"
          onChange={handleTokenChange}
          placeholder="Enter your Mapbox token"
          className="font-mono text-sm"
        />
      </div>
      <div ref={mapContainer} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default IncidentMap;