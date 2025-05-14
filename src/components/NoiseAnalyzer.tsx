
import { useState, useEffect, useCallback } from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import SafetyTips from './SafetyTips';
import NoiseHistory from './NoiseHistory';
import NoiseReport from './NoiseReport';
import { supabase } from '@/lib/supabase';
import { toast } from "sonner";
import AnalyzerDialogs from './noise-analyzer/AnalyzerDialogs';
import ErrorDisplay from './noise-analyzer/ErrorDisplay';
import CompatibilityCheck from './noise-analyzer/CompatibilityCheck';
import MeasurementContainer from './noise-analyzer/MeasurementContainer';

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

  const handleOpenReport = () => {
    if (decibels > 0) {
      setShowReportDialog(true);
    } else {
      toast("Veuillez d'abord effectuer une mesure");
    }
  };

  if (!isCompatible) {
    return <CompatibilityCheck isCompatible={isCompatible} />;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      <ErrorDisplay error={error} />

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
          <MeasurementContainer 
            isRecording={isRecording} 
            decibels={decibels}
            measurementDuration={measurementDuration}
            measurementStatus={measurementStatus}
            error={error}
            isCalibrating={isCalibrating}
            onToggleRecording={handleToggleRecording}
            onCalibrate={handleCalibrate}
            onShowHelp={() => setShowHelpDialog(true)}
            onOpenReport={handleOpenReport}
          />
          
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
