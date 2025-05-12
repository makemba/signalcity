
import { useEffect, useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, MapPin, AlertTriangle, Info } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { INCIDENT_CATEGORIES } from "@/lib/constants";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface HotspotOptions {
  radius: number;
  intensity: number;
  threshold: number;
  category: string | null;
}

const IncidentHotspotMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapToken, setMapToken] = useState<string>("");
  const [options, setOptions] = useState<HotspotOptions>({
    radius: 25,
    intensity: 0.6,
    threshold: 0.1,
    category: null
  });

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['hotspot-map-data', options.category],
    queryFn: async () => {
      let query = supabase
        .from('incidents')
        .select('location_lat, location_lng, category_id, status')
        .not('location_lat', 'is', null)
        .not('location_lng', 'is', null);
      
      if (options.category) {
        query = query.eq('category_id', options.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(incident => ({
        lat: incident.location_lat,
        lng: incident.location_lng,
        category: incident.category_id,
        status: incident.status
      }));
    }
  });

  useEffect(() => {
    if (!mapContainer.current || !mapToken || !incidents || incidents.length === 0 || !map.current) return;
    
    try {
      if (map.current.getSource('incidents')) {
        (map.current.getSource('incidents') as mapboxgl.GeoJSONSource).setData({
          type: 'FeatureCollection',
          features: incidents.map(incident => ({
            type: 'Feature',
            properties: {
              category: incident.category,
              status: incident.status
            },
            geometry: {
              type: 'Point',
              coordinates: [incident.lng, incident.lat]
            }
          }))
        });
      } else if (map.current.loaded()) {
        map.current.addSource('incidents', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: incidents.map(incident => ({
              type: 'Feature',
              properties: {
                category: incident.category,
                status: incident.status
              },
              geometry: {
                type: 'Point',
                coordinates: [incident.lng, incident.lat]
              }
            }))
          }
        });

        map.current.addLayer({
          id: 'incidents-heat',
          type: 'heatmap',
          source: 'incidents',
          paint: {
            'heatmap-weight': 1,
            'heatmap-intensity': options.intensity,
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 255, 0)',
              0.2, 'rgba(0, 0, 255, 0.5)',
              0.4, 'rgba(0, 255, 255, 0.7)',
              0.6, 'rgba(255, 255, 0, 0.8)',
              0.8, 'rgba(255, 0, 0, 0.9)',
              1, 'rgba(255, 0, 0, 1)'
            ],
            'heatmap-radius': options.radius,
            'heatmap-opacity': 0.8
          }
        });

        map.current.addLayer({
          id: 'incidents-point',
          type: 'circle',
          source: 'incidents',
          paint: {
            'circle-radius': 6,
            'circle-color': [
              'match',
              ['get', 'status'],
              'RESOLVED', '#10b981',
              'IN_PROGRESS', '#f59e0b',
              '#ef4444'
            ],
            'circle-opacity': 0.7,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#ffffff'
          }
        });
      }
    } catch (error) {
      console.error("Error updating heatmap:", error);
    }
  }, [incidents, options.intensity, options.radius]);

  const handleTokenChange = (value: string) => {
    setMapToken(value);
    
    // Re-initialize map with new token
    if (map.current) {
      map.current.remove();
      map.current = null;
    }
    
    if (value && mapContainer.current) {
      try {
        // Congo-Brazzaville coordinates
        const centerLat = -4.2634;
        const centerLng = 15.2429;
        
        mapboxgl.accessToken = value;
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v10',
          center: [centerLng, centerLat],
          zoom: 12
        });
        
        map.current.on('load', () => {
          if (incidents) {
            map.current?.resize();
          }
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        toast("Erreur", {
          description: "Impossible d'initialiser la carte avec ce token"
        });
      }
    }
  };

  // Handle setting changes
  const handleRadiusChange = (value: string) => {
    const radius = parseInt(value);
    setOptions(prev => ({ ...prev, radius }));
    
    if (map.current && map.current.getLayer('incidents-heat')) {
      map.current.setPaintProperty('incidents-heat', 'heatmap-radius', radius);
    }
  };

  const handleIntensityChange = (value: string) => {
    const intensity = parseFloat(value);
    setOptions(prev => ({ ...prev, intensity }));
    
    if (map.current && map.current.getLayer('incidents-heat')) {
      map.current.setPaintProperty('incidents-heat', 'heatmap-intensity', intensity);
    }
  };

  const handleCategoryChange = (value: string) => {
    setOptions(prev => ({ ...prev, category: value === 'all' ? null : value }));
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Carte de chaleur des incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <label className="text-sm font-medium">Token Mapbox</label>
            <input
              type="text"
              value={mapToken}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder="Entrez votre token Mapbox"
              className="px-3 py-2 rounded-md border text-sm"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select value={options.category || 'all'} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {INCIDENT_CATEGORIES.map(category => (
                    <SelectItem key={category.id} value={category.id}>{category.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Rayon ({options.radius}px)</label>
              <input
                type="range"
                min="10"
                max="50"
                value={options.radius}
                onChange={(e) => handleRadiusChange(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Intensité ({options.intensity})</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={options.intensity}
                onChange={(e) => handleIntensityChange(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px] bg-gray-50 rounded">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : (
            <>
              <div 
                ref={mapContainer} 
                className="h-[400px] w-full rounded overflow-hidden border border-gray-200"
              />
              
              {!mapToken && (
                <div className="bg-blue-50 text-blue-700 p-3 rounded flex items-start">
                  <Info className="h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                  <p className="text-sm">
                    Pour visualiser la carte de chaleur des incidents, vous devez fournir un token Mapbox.
                    Vous pouvez en obtenir un gratuitement sur <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">mapbox.com</a>
                  </p>
                </div>
              )}
              
              <div className="flex gap-4 text-sm text-gray-500 justify-center">
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentHotspotMap;
