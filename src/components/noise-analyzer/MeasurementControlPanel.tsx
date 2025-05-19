
import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import ActiveMeasurement from './ActiveMeasurement';
import AnalyzerControls from './AnalyzerControls';
import { Card, CardContent } from "@/components/ui/card";
import MeasurementActions from './MeasurementActions';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

export default function MeasurementControlPanel() {
  const { 
    decibels,
    measurementDuration,
    measurementStatus,
    isRecording,
    toggleRecording,
    calibrate,
    openReport,
    isCalibrating,
    setShowHelpDialog
  } = useNoiseAnalyzerContext();
  
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
        toast.error("Impossible d'enregistrer la mesure");
      } else {
        toast.success("Mesure enregistrée avec succès");
      }
    } catch (err) {
      console.error("Exception lors de la sauvegarde:", err);
      toast.error("Erreur lors de la sauvegarde");
    }
  };
  
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

    toast.success("Les données ont été exportées avec succès");
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
        toast.success("Le lien a été copié dans le presse-papier");
      }
    } catch (err) {
      console.error('Sharing error:', err);
      toast.error("Impossible de partager les données");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-6">
        <AnalyzerControls />
        
        <ActiveMeasurement />
        
        <MeasurementActions
          decibels={decibels}
          measurementDuration={measurementDuration}
          onSaveMeasurement={handleSaveMeasurement}
          onExportData={handleExportData}
          onShare={handleShare}
        />
      </CardContent>
    </Card>
  );
}
