
import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import { Card } from "@/components/ui/card";
import AnalyzerControls from './AnalyzerControls';
import ActiveMeasurement from './ActiveMeasurement';
import AudioRecorder from '../AudioRecorder';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';
import MeasurementActions from './MeasurementActions';

/**
 * @deprecated Ce composant est remplacé par MeasurementControlPanel.
 * Il reste disponible pour assurer la rétrocompatibilité mais sera supprimé dans une future version.
 */
export default function MeasurementContainer() {
  const {
    isRecording,
    decibels,
    measurementDuration,
    measurementStatus,
    error,
    isCalibrating,
    toggleRecording,
    calibrate,
    openReport,
    setShowHelpDialog
  } = useNoiseAnalyzerContext();

  const handleExportData = () => {
    const exportData = {
      date: new Date().toISOString(),
      decibels: decibels,
      duration: measurementDuration,
      device: navigator.userAgent,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesure-sonore-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast("Les données ont été exportées avec succès");
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mesure de niveau sonore',
          text: `Niveau sonore mesuré: ${decibels} dB`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`Niveau sonore mesuré: ${decibels} dB - ${window.location.href}`);
        toast("Le lien a été copié dans le presse-papier");
      }
    } catch (err) {
      console.error('Sharing error:', err);
      toast("Impossible de partager les données");
    }
  };

  const handleSaveMeasurement = async () => {
    try {
      const { error } = await supabase
        .from('noise_measurements')
        .insert({
          noise_level: decibels,
          duration: measurementDuration || 5,
          type: 'ambient',
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement de la mesure:", error);
        toast("Impossible d'enregistrer la mesure");
      } else {
        toast("Mesure enregistrée avec succès");
      }
    } catch (err) {
      console.error("Exception lors de la sauvegarde:", err);
      toast("Erreur lors de la sauvegarde");
    }
  };

  return (
    <Card className="p-6 bg-white shadow-lg space-y-6">
      <AnalyzerControls />

      <ActiveMeasurement />

      <MeasurementActions
        decibels={decibels}
        measurementDuration={measurementDuration}
        onSaveMeasurement={handleSaveMeasurement}
        onExportData={handleExportData}
        onShare={handleShare}
      />

      <AudioRecorder />

      <div className="text-sm text-muted-foreground text-center mt-2 border-t border-gray-100 pt-4">
        <p>Pour des mesures plus précises, calibrez le microphone dans un environnement calme.</p>
        <p className="mt-1">Les niveaux sont enregistrés automatiquement pour le suivi des nuisances sonores.</p>
      </div>
    </Card>
  );
}
