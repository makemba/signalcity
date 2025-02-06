import { NOISE_THRESHOLDS } from '@/lib/constants';
import { AlertTriangle, Volume2, Gauge } from 'lucide-react';
import { Card } from "@/components/ui/card";

interface NoiseLevelDisplayProps {
  decibels: number;
}

export default function NoiseLevelDisplay({ decibels }: NoiseLevelDisplayProps) {
  const getNoiseLevel = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) return "Très élevé";
    if (decibels >= NOISE_THRESHOLDS.HIGH) return "Élevé";
    if (decibels >= NOISE_THRESHOLDS.MODERATE) return "Modéré";
    return "Acceptable";
  };

  const getNoiseColor = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) return "text-red-600";
    if (decibels >= NOISE_THRESHOLDS.HIGH) return "text-orange-500";
    if (decibels >= NOISE_THRESHOLDS.MODERATE) return "text-yellow-500";
    return "text-green-500";
  };

  const getHealthImpact = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) {
      return "Dangereux pour l'audition";
    }
    if (decibels >= NOISE_THRESHOLDS.HIGH) {
      return "Risque pour l'audition";
    }
    if (decibels >= NOISE_THRESHOLDS.MODERATE) {
      return "Inconfortable";
    }
    return "Sans danger";
  };

  const getProgressColor = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) return "bg-red-600";
    if (decibels >= NOISE_THRESHOLDS.HIGH) return "bg-orange-500";
    if (decibels >= NOISE_THRESHOLDS.MODERATE) return "bg-yellow-500";
    return "bg-green-500";
  };

  console.log("Affichage du niveau sonore:", decibels, "dB");

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <Gauge className="h-16 w-16 mb-2 mx-auto text-blue-500" />
          <div className={`text-4xl font-bold ${getNoiseColor()}`}>
            {decibels}
            <span className="text-2xl ml-1">dB</span>
          </div>
          {decibels >= NOISE_THRESHOLDS.HIGH && (
            <AlertTriangle className="absolute -right-8 top-0 h-6 w-6 text-red-500 animate-pulse" />
          )}
        </div>
        
        <div className="space-y-2">
          <p className={`text-lg font-medium ${getNoiseColor()}`}>
            Niveau: {getNoiseLevel()}
          </p>
          <p className={`text-sm ${getNoiseColor()}`}>
            {getHealthImpact()}
          </p>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Intensité
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {Math.min(100, Math.round((decibels / 120) * 100))}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(100, (decibels / 120) * 100)}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <Volume2 className="h-4 w-4 inline-block mr-1" />
          Mesure en temps réel
        </div>
      </div>
    </Card>
  );
}