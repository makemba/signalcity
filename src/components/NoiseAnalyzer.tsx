import { useState } from 'react';
import { AlertTriangle, Volume2, VolumeX, Settings } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import NoiseLevelDisplay from './NoiseLevelDisplay';
import SafetyTips from './SafetyTips';
import NoiseHistory from './NoiseHistory';

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [decibels, setDecibels] = useState<number>(0);
  const { isRecording, error, startRecording, stopRecording, calibrate } = useAudioAnalyzer((level) => {
    console.log("Niveau sonore reçu:", level);
    setDecibels(level);
    onNoiseLevel(level);
  });

  const handleToggleRecording = () => {
    console.log("Bouton d'enregistrement cliqué, état actuel:", isRecording);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <div className="flex flex-col items-center p-6 bg-card rounded-lg shadow-lg space-y-6">
            <div className="flex gap-4">
              <Button
                onClick={handleToggleRecording}
                variant={isRecording ? "destructive" : "default"}
                size="lg"
                className="min-w-[200px]"
              >
                {isRecording ? (
                  <>
                    <VolumeX className="mr-2 h-5 w-5" />
                    Arrêter la mesure
                  </>
                ) : (
                  <>
                    <Volume2 className="mr-2 h-5 w-5" />
                    Mesurer le niveau sonore
                  </>
                )}
              </Button>

              <Button
                onClick={calibrate}
                variant="outline"
                size="lg"
                title="Calibrer le microphone dans un environnement calme"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>

            {isRecording && (
              <div className="w-full">
                <NoiseLevelDisplay decibels={decibels} />
              </div>
            )}

            <div className="text-sm text-muted-foreground text-center">
              <p>Pour des mesures plus précises, calibrez le microphone dans un environnement calme.</p>
              <p className="mt-2">Les niveaux sont enregistrés automatiquement pour le suivi des nuisances sonores.</p>
            </div>
          </div>
          
          <SafetyTips />
        </div>

        <div className="space-y-6">
          <NoiseHistory />
        </div>
      </div>
    </div>
  );
}