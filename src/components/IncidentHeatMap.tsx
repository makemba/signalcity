
import { Card } from "@/components/ui/card";
import { Loader2, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = "pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJja3Z3eHNyOGUwZGprMm9ta3UzZnU0MGM5In0.example";

const IncidentHeatMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['heatmap-data'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('location_lat, location_lng, category_id, status')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null);

      if (error) throw error;

      return data.map(incident => ({
        lat: incident.location_lat,
        lng: incident.location_lng,
        category: incident.category_id,
        status: incident.status
      }));
    },
    meta: {
      onError: () => {
        toast("Erreur", {
          description: "Impossible de charger les données pour la carte",
        });
      }
    }
  });

  useEffect(() => {
    // If map already initialized or missing container, skip
    if (map.current || !mapContainer.current || !incidents || incidents.length === 0) return;

    // Congo-Brazzaville coordinates
    const centerLat = -4.2634;
    const centerLng = 15.2429;

    mapboxgl.accessToken = MAPBOX_TOKEN;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [centerLng, centerLat],
        zoom: 10
      });

      map.current.on('load', () => {
        if (!map.current) return;

        // Add markers for each incident
        incidents.forEach(incident => {
          const color = incident.status === 'RESOLVED' ? '#10b981' : incident.status === 'IN_PROGRESS' ? '#f59e0b' : '#ef4444';
          
          const markerEl = document.createElement('div');
          markerEl.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
          
          new mapboxgl.Marker(markerEl)
            .setLngLat([incident.lng, incident.lat])
            .addTo(map.current!);
        });
      });
    } catch (error) {
      console.error("Error initializing map:", error);
      toast("Erreur de carte", {
        description: "Impossible d'initialiser la carte. Veuillez réessayer.",
      });
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [incidents]);

  if (isLoading) {
    return (
      <Card className="p-6 flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Carte des incidents</h3>
      </div>
      
      {!incidents || incidents.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500 min-h-[400px]">
          <p>Aucune donnée géographique disponible</p>
        </div>
      ) : (
        <div 
          ref={mapContainer} 
          className="h-[400px] w-full rounded-md overflow-hidden border border-gray-200"
        />
      )}
      
      <div className="flex gap-4 mt-4 text-sm text-gray-500 justify-center">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
          En attente
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-amber-500 rounded-full mr-1"></span>
          En cours
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
          Résolu
        </div>
      </div>
    </Card>
  );
};

export default IncidentHeatMap;
