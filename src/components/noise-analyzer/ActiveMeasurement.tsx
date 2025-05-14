
import { NoiseLevelDisplay } from '@/components/NoiseLevelDisplay';
import { Button } from "@/components/ui/button";

interface ActiveMeasurementProps {
  decibels: number;
  measurementDuration: number;
  measurementStatus: 'idle' | 'starting' | 'active' | 'error';
  onSaveMeasurement: () => void;
}

export default function ActiveMeasurement({
  decibels,
  measurementDuration,
  measurementStatus,
  onSaveMeasurement
}: ActiveMeasurementProps) {
  if (measurementStatus === 'starting') {
    return (
      <div className="w-full">
        <div className="flex justify-center items-center gap-2 text-amber-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-amber-500 border-t-transparent"></div>
          <p>Initialisation de la mesure en cours...</p>
        </div>
        <div className="mt-4">
          <NoiseLevelDisplay decibels={0} />
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3">
          Veuillez patienter quelques secondes pendant l'initialisation
        </p>
      </div>
    );
  }

  if (measurementStatus === 'active') {
    return (
      <div className="w-full">
        <NoiseLevelDisplay decibels={decibels} />
        <p className="text-center text-sm font-medium text-green-600 mt-2">
          Mesure en cours... {measurementDuration > 0 ? `(${measurementDuration}s)` : ''}
        </p>
        {measurementDuration > 3 && decibels > 0 && (
          <div className="mt-4 text-center">
            <Button 
              variant="outline" 
              size="sm"
              onClick={onSaveMeasurement}
            >
              Enregistrer la mesure
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (measurementStatus === 'idle' && decibels > 0) {
    return (
      <div className="w-full">
        <NoiseLevelDisplay decibels={decibels} />
        <p className="text-center text-sm text-muted-foreground mt-2">
          Mesure terminée. Vous pouvez démarrer une nouvelle mesure.
        </p>
      </div>
    );
  }

  if (measurementStatus === 'error') {
    return (
      <div className="text-center py-8 text-red-500">
        <div className="h-12 w-12 mx-auto mb-2">⚠️</div>
        <p className="font-medium">Problème de mesure détecté</p>
        <p className="text-sm text-gray-600 mt-2">
          Vérifiez les permissions du microphone et essayez de calibrer à nouveau
        </p>
      </div>
    );
  }

  // Default idle state with no measurement
  return (
    <div className="text-center py-8 text-muted-foreground">
      <div className="h-12 w-12 mx-auto mb-4 opacity-30">🔊</div>
      <p>Appuyez sur le bouton pour commencer la mesure du niveau sonore</p>
      <p className="text-sm mt-2 text-blue-600">
        Utilisez de préférence Chrome ou Firefox pour de meilleurs résultats
      </p>
    </div>
  );
}
