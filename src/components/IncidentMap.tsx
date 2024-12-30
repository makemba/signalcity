import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { INCIDENT_CATEGORIES } from "@/lib/constants";

// Remplacez par votre token Mapbox
const MAPBOX_TOKEN = "pk.votre_token_mapbox";

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

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [2.3488, 48.8534], // Paris
      zoom: 12,
    });

    // Nettoyage
    return () => {
      map.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (!map.current) return;

    // Supprimer les marqueurs existants
    const markers = document.getElementsByClassName("mapboxgl-marker");
    while (markers[0]) {
      markers[0].remove();
    }

    // Ajouter les nouveaux marqueurs
    incidents.forEach((incident) => {
      const category = INCIDENT_CATEGORIES.find((cat) => cat.id === incident.category);
      
      if (!category) return;

      const el = document.createElement("div");
      el.className = "marker";
      el.style.backgroundColor = category.color;
      el.style.width = "20px";
      el.style.height = "20px";
      el.style.borderRadius = "50%";
      el.style.cursor = "pointer";

      new mapboxgl.Marker(el)
        .setLngLat([incident.longitude, incident.latitude])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<h3>${category.label}</h3><p>${incident.description}</p>`
          )
        )
        .addTo(map.current);
    });
  }, [incidents]);

  return (
    <div>
      <div ref={mapContainer} style={{ height: "400px", width: "100%" }} />
    </div>
  );
};

export default IncidentMap;