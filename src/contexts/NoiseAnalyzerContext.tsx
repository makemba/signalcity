
import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import { useNoiseState } from '@/hooks/useNoiseState';
import { useNoiseReporting } from '@/hooks/useNoiseReporting';
import { toast } from "sonner";

// Define the context type
interface NoiseAnalyzerContextType {
  // State
  decibels: number;
  measurementStatus: 'idle' | 'starting' | 'active' | 'error';
  measurementDuration: number;
  isRecording: boolean;
  error: string;
  isCalibrating: boolean;
  showCalibrationDialog: boolean;
  showHelpDialog: boolean;
  showReportDialog: boolean;
  
  // Actions
  handleNoiseLevel: (level: number) => void;
  toggleRecording: () => void;
  calibrate: () => Promise<void>;
  skipCalibration: () => void;
  saveReport: (report: any) => void;
  setShowCalibrationDialog: (show: boolean) => void;
  setShowHelpDialog: (show: boolean) => void;
  setShowReportDialog: (show: boolean) => void;
  openReport: () => void;
}

// Create context with default values
const NoiseAnalyzerContext = createContext<NoiseAnalyzerContextType | null>(null);

// Provider component
export const NoiseAnalyzerProvider = ({ children, onNoiseLevel }: { children: ReactNode, onNoiseLevel: (level: number) => void }) => {
  // Use our custom hooks
  const { 
    decibels, 
    measurementStatus, 
    measurementDuration, 
    isCompatible,
    autoCalibrated,
    setDecibels,
    setMeasurementStatus,
    setMeasurementStartTime,
    setAutoCalibrated
  } = useNoiseState();
  
  // UI state
  const [showCalibrationDialog, setShowCalibrationDialog] = useState<boolean>(false);
  const [isCalibrating, setIsCalibrating] = useState<boolean>(false);
  const [showHelpDialog, setShowHelpDialog] = useState<boolean>(false);
  const [showReportDialog, setShowReportDialog] = useState<boolean>(false);
  
  const { saveReport } = useNoiseReporting();
  
  // Handle noise level updates
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
  }, [measurementStatus, onNoiseLevel, setDecibels, setMeasurementStatus, setMeasurementStartTime]);

  // Initialize audio analyzer
  const { 
    isRecording, 
    error, 
    startRecording, 
    stopRecording, 
    calibrate: calibrateAudio,
    autoCalibrate 
  } = useAudioAnalyzer(handleNoiseLevel);

  // Toggle recording
  const toggleRecording = useCallback(() => {
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
  }, [isRecording, showCalibrationDialog, decibels, autoCalibrated, stopRecording]);

  const startMeasurement = useCallback(async () => {
    setShowCalibrationDialog(false);
    setMeasurementStatus('starting');
    
    await startRecording();
    toast("Démarrage de la mesure du niveau sonore...");
  }, [setMeasurementStatus, startRecording]);

  // Calibration functions
  const calibrate = useCallback(async () => {
    setIsCalibrating(true);
    setShowCalibrationDialog(false);
    
    try {
      const success = await calibrateAudio();
      
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
  }, [calibrateAudio, setAutoCalibrated, startMeasurement]);

  const skipCalibration = useCallback(() => {
    setShowCalibrationDialog(false);
    startMeasurement();
  }, [startMeasurement]);

  // Report functions
  const openReport = useCallback(() => {
    if (decibels > 0) {
      setShowReportDialog(true);
    } else {
      toast("Veuillez d'abord effectuer une mesure");
    }
  }, [decibels]);

  const contextValue: NoiseAnalyzerContextType = {
    // State
    decibels,
    measurementStatus,
    measurementDuration,
    isRecording,
    error,
    isCalibrating,
    showCalibrationDialog,
    showHelpDialog,
    showReportDialog,
    
    // Actions
    handleNoiseLevel,
    toggleRecording,
    calibrate,
    skipCalibration,
    saveReport,
    setShowCalibrationDialog,
    setShowHelpDialog,
    setShowReportDialog,
    openReport
  };

  return (
    <NoiseAnalyzerContext.Provider value={contextValue}>
      {children}
    </NoiseAnalyzerContext.Provider>
  );
};

// Custom hook to use the context
export const useNoiseAnalyzerContext = () => {
  const context = useContext(NoiseAnalyzerContext);
  if (!context) {
    throw new Error('useNoiseAnalyzerContext must be used within a NoiseAnalyzerProvider');
  }
  return context;
};
