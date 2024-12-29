import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";

export default function IncidentMap() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 h-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Carte des incidents</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="h-4 w-4" />
          <span>Cliquez sur la carte pour signaler un incident</span>
        </div>
      </div>
      <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Carte interactive à implémenter</p>
      </div>
    </div>
  );
}