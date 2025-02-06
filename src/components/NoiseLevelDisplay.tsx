import { NOISE_THRESHOLDS } from '@/lib/constants';

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

  return (
    <div className="text-center">
      <p className="text-2xl font-bold">
        <span className={getNoiseColor()}>{decibels}</span> dB
      </p>
      <p className={`text-sm ${getNoiseColor()}`}>
        Niveau: {getNoiseLevel()}
      </p>
    </div>
  );
}