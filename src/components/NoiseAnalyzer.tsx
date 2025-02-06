import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import NoiseLevelDisplay from './NoiseLevelDisplay';

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [decibels, setDecibels] = useState<number>(0);
  const { isRecording, error, startRecording, stopRecording } = useAudioAnalyzer((level) => {
    setDecibels(level);
    onNoiseLevel(level);
  });

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
        <button
          onClick={handleToggleRecording}
          className={`px-4 py-2 rounded-full transition-colors ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isRecording ? "Arrêter la mesure" : "Mesurer le niveau sonore"}
        </button>

        {isRecording && <NoiseLevelDisplay decibels={decibels} />}
      </div>
    </div>
  );
}