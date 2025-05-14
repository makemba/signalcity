import { useState, useEffect, useCallback } from 'react';
import { AlertTriangle, Volume2, VolumeX, Settings, Download, Share2, FileText, HelpCircle, Camera, HelpCircle, AlertCircle, FileText } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import NoiseLevelDisplay from './NoiseLevelDisplay';
import SafetyTips from './SafetyTips';
import NoiseHistory from './NoiseHistory';
import AudioRecorder from './AudioRecorder';
import NoiseReport from './NoiseReport';
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { supabase } from '@/lib/supabase';
import AnalyzerControls from './noise-analyzer/AnalyzerControls';
import ActiveMeasurement from './noise-analyzer/ActiveMeasurement';
import AnalyzerDialogs from './noise-analyzer/AnalyzerDialogs';

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [decibels, setDecibels] = useState<number>(0);
  const [isCompatible, setIsCompatible] = useState<boolean>(true);
  const [showCalibrationDialog, setShowCalibrationDialog] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  const [measurementStatus, setMeasurementStatus] = useState<'idle' | 'starting' | 'active' | 'error'>('idle');
  const [measurementDuration, setMeasurementDuration] = useState<number>(0);
  const [measurementStartTime, setMeasurementStartTime] = useState<Date | null>(null);
  const [autoCalibrated, setAutoCalibrated] = useState<boolean>(false);
  
  // Sample noise history data
  const [noiseHistoryData, setNoiseHistoryData] = useState([
    { date: "Lun", level: 45 },
    { date: "Mar", level: 52 },
    { date: "Mer", level: 49 },
    { date: "Jeu", level: 63 },
    { date: "Ven", level: 58 },
    { date: "Sam", level: 72 },
    { date: "Dim", level: 47 },
  ]);
  
  const handleNoiseLevel = useCallback((level: number) => {
    if (level > 0) {
      console.log("Noise level received:", level, "dB");
      setDecibels(level);
      onNoiseLevel(level);
      
      if (measurementStatus !== 'active') {
        setMeasurementStatus('active');
        setMeasurementStartTime(new Date());
      }
    }
  }, [measurementStatus, onNoiseLevel]);

  // Update measurement duration
  useEffect(() => {
    let intervalId: number | null = null;
    
    if (measurementStatus === 'active' && measurementStartTime) {
      intervalId = window.setInterval(() => {
        const now = new Date();
        const durationInSeconds = Math.floor((now.getTime() - measurementStartTime.getTime()) / 1000);
        setMeasurementDuration(durationInSeconds);
      }, 1000);
    }
    
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [measurementStatus, measurementStartTime]);

  const saveMeasurement = async (level: number) => {
    try {
      const { error } = await supabase
        .from('noise_measurements')
        .insert({
          noise_level: level,
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
  
  const saveReport = async (report: any) => {
    try {
      const { error } = await supabase
        .from('noise_measurements')
        .insert({
          noise_level: report.measurements.decibels,
          duration: report.measurements.duration,
          type: 'analyzed',
          metadata: report,
          notes: report.conclusion
        });

      if (error) {
        console.error("Erreur lors de l'enregistrement du rapport:", error);
        toast("Impossible d'enregistrer le rapport");
      } else {
        toast("Rapport enregistré avec succès");
      }
    } catch (err) {
      console.error("Exception lors de la sauvegarde du rapport:", err);
      toast("Erreur lors de la sauvegarde du rapport");
    }
  };

  const { 
    isRecording, 
    error, 
    startRecording, 
    stopRecording, 
    calibrate,
    reset,
    autoCalibrate 
  } = useAudioAnalyzer(handleNoiseLevel);

  // Automatically handle reset when stopping recording
  useEffect(() => {
    if (!isRecording && measurementStatus === 'active') {
      // Auto-generate a report if the measurement was long enough
      if (decibels > 0 && measurementDuration > 3) {
        setShowReportDialog(true);
      }
      
      // Reset measurement status
      setMeasurementStatus('idle');
    }
  }, [isRecording, measurementStatus, decibels, measurementDuration]);

  // Check device compatibility on component mount
  useEffect(() => {
    checkDeviceCompatibility();
  }, []);

  // Show help dialog on first visit
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('noise-analyzer-help-seen');
    if (!hasSeenHelp) {
      setTimeout(() => {
        setShowHelpDialog(true);
        localStorage.setItem('noise-analyzer-help-seen', 'true');
      }, 1000);
    }
  }, []);

  // Auto-calibrate on component mount if not done already
  useEffect(() => {
    if (isCompatible && !autoCalibrated) {
      setTimeout(async () => {
        try {
          setIsCalibrating(true);
          const success = await autoCalibrate();
          setAutoCalibrated(success);
        } finally {
          setIsCalibrating(false);
        }
      }, 2000);
    }
  }, [isCompatible, autoCalibrated, autoCalibrate]);

  // Update measurement status based on recording state
  useEffect(() => {
    if (isRecording && decibels === 0) {
      setMeasurementStatus('starting');
    } else if (!isRecording) {
      setMeasurementStatus('idle');
    }
  }, [isRecording, decibels]);

  const checkDeviceCompatibility = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ audio: true });
      result.getTracks().forEach(track => track.stop());
      setIsCompatible(true);
      console.log("Device compatible with audio analysis");
    } catch (err) {
      console.error("Compatibility error:", err);
      setIsCompatible(false);
      toast("L'analyse sonore n'est pas disponible sur cet appareil");
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      toast("Mesure du niveau sonore arrêtée");
    } else {
      if (!showCalibrationDialog && decibels === 0 && !autoCalibrated) {
        setShowCalibrationDialog(true);
      } else {
        startMeasurement();
      }
    }
  };

  const startMeasurement = async () => {
    setShowCalibrationDialog(false);
    setMeasurementStatus('starting');
    setMeasurementDuration(0);
    setMeasurementStartTime(null);
    
    const success = await startRecording();
    
    if (!success) {
      setMeasurementStatus('error');
    } else {
      toast("Démarrage de la mesure du niveau sonore...");
    }
  };

  const handleCalibrate = async () => {
    setIsCalibrating(true);
    setShowCalibrationDialog(false);
    
    try {
      const success = await calibrate();
      
      if (success) {
        setAutoCalibrated(true);
        setTimeout(() => {
          startMeasurement();
        }, 1000);
      } else {
        toast("Échec de la calibration. Veuillez réessayer dans un environnement plus calme");
      }
    } catch (error) {
      console.error("Calibration failed:", error);
      toast("Échec de la calibration. Veuillez réessayer");
    } finally {
      setIsCalibrating(false);
    }
  };

  const handleSkipCalibration = () => {
    setShowCalibrationDialog(false);
    startMeasurement();
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

    toast("Les données ont été exportées avec succès");
  };

  const handleOpenReport = () => {
    if (decibels > 0) {
      setShowReportDialog(true);
    } else {
      toast("Veuillez d'abord effectuer une mesure");
    }
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

  const handleSaveMeasurement = () => {
    saveMeasurement(decibels);
  };

  if (!isCompatible) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Appareil non compatible</AlertTitle>
          <AlertDescription>
            L'analyse sonore n'est pas disponible sur cet appareil. 
            Voici quelques solutions alternatives :
          </AlertDescription>
        </Alert>

        <Card className="p-6 bg-white shadow-lg space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 border rounded-lg">
              <Camera className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-2">Utiliser la vidéo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous pouvez filmer la source du bruit pour documenter la nuisance
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/video-analysis'}>
                Passer à l'analyse vidéo
              </Button>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Consultez notre guide de dépannage ou contactez le support
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Guide de dépannage</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guide de dépannage</DialogTitle>
                    <DialogDescription>
                      <ul className="list-disc pl-4 space-y-2 mt-4">
                        <li>Vérifiez que votre navigateur est à jour</li>
                        <li>Autorisez l'accès au microphone dans les paramètres</li>
                        <li>Essayez avec un autre navigateur (Chrome recommandé)</li>
                        <li>Redémarrez votre appareil</li>
                        <li>Vérifiez que votre microphone fonctionne dans d'autres applications</li>
                      </ul>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        <SafetyTips />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <AnalyzerDialogs 
        showCalibrationDialog={showCalibrationDialog}
        setShowCalibrationDialog={setShowCalibrationDialog}
        showHelpDialog={showHelpDialog}
        setShowHelpDialog={setShowHelpDialog}
        showReportDialog={showReportDialog}
        setShowReportDialog={setShowReportDialog}
        isCalibrating={isCalibrating}
        decibels={decibels}
        measurementDuration={measurementDuration}
        onCalibrate={handleCalibrate}
        onSkipCalibration={handleSkipCalibration}
        onSaveReport={saveReport}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6 bg-white shadow-lg space-y-6">
            <AnalyzerControls 
              isRecording={isRecording}
              decibels={decibels}
              onToggleRecording={handleToggleRecording}
              onCalibrate={handleCalibrate}
              onOpenReport={handleOpenReport}
              onExportData={handleExportData}
              onShare={handleShare}
              onShowHelp={() => setShowHelpDialog(true)}
              isCalibrating={isCalibrating}
            />

            <ActiveMeasurement 
              decibels={decibels}
              measurementDuration={measurementDuration}
              measurementStatus={measurementStatus}
              onSaveMeasurement={handleSaveMeasurement}
            />

            <AudioRecorder />

            <div className="text-sm text-muted-foreground text-center mt-2 border-t border-gray-100 pt-4">
              <p>Pour des mesures plus précises, calibrez le microphone dans un environnement calme.</p>
              <p className="mt-1">Les niveaux sont enregistrés automatiquement pour le suivi des nuisances sonores.</p>
            </div>
          </Card>
          
          <SafetyTips />
        </div>

        <div className="space-y-6">
          {decibels > 0 && (
            <NoiseReport 
              decibels={decibels} 
              duration={measurementDuration || 5} 
              onSave={saveReport}
            />
          )}
          <NoiseHistory data={noiseHistoryData} />
        </div>
      </div>
    </div>
  );
}
