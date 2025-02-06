import { NOISE_THRESHOLDS } from '@/lib/constants';
import { AlertTriangle } from 'lucide-react';

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

  console.log("Displaying noise level:", decibels, "dB");

  return (
    <div className="text-center space-y-4">
      <div className="relative inline-block">
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

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all duration-300 ${getNoiseColor()}`}
          style={{ width: `${Math.min(100, (decibels / 120) * 100)}%` }}
        />
      </div>
    </div>
  );
}