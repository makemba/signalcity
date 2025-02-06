import { AlertTriangle, Volume2, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function SafetyTips() {
  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Shield className="h-5 w-5 mr-2 text-blue-500" />
        Conseils de sécurité
      </h3>
      <ul className="space-y-3">
        <li className="flex items-center text-gray-700">
          <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
          <span>Évitez l'exposition prolongée aux bruits forts (+85 dB)</span>
        </li>
        <li className="flex items-center text-gray-700">
          <Volume2 className="h-4 w-4 mr-2 text-blue-500" />
          <span>Faites des pauses régulières dans un environnement calme</span>
        </li>
        <li className="flex items-center text-gray-700">
          <Shield className="h-4 w-4 mr-2 text-green-500" />
          <span>Utilisez une protection auditive si nécessaire</span>
        </li>
      </ul>
    </Card>
  );
}