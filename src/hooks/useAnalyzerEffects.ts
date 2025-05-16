
import { useEffect } from 'react';

interface AnalyzerEffectsProps {
  isRecording: boolean;
  decibels: number;
  measurementStatus: 'idle' | 'starting' | 'active' | 'error';
  measurementDuration: number;
  isCompatible: boolean;
  autoCalibrated: boolean;
  setMeasurementStatus: (status: 'idle' | 'starting' | 'active' | 'error') => void;
  setShowReportDialog: (show: boolean) => void;
  setShowHelpDialog: (show: boolean) => void;
  setIsCalibrating: (isCalibrating: boolean) => void;
  setAutoCalibrated: (calibrated: boolean) => void;
  setIsCompatible: (compatible: boolean) => void;
  autoCalibrate: () => Promise<boolean>;
}

export const useAnalyzerEffects = ({
  isRecording,
  decibels,
  measurementStatus,
  measurementDuration,
  isCompatible,
  autoCalibrated,
  setMeasurementStatus,
  setShowReportDialog,
  setShowHelpDialog,
  setIsCalibrating,
  setAutoCalibrated,
  setIsCompatible,
  autoCalibrate
}: AnalyzerEffectsProps) => {
  // Update measurement status based on recording state
  useEffect(() => {
    if (isRecording && decibels === 0) {
      setMeasurementStatus('starting');
    } else if (!isRecording) {
      setMeasurementStatus('idle');
    }
  }, [isRecording, decibels, setMeasurementStatus]);

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
  }, [isRecording, measurementStatus, decibels, measurementDuration, setMeasurementStatus, setShowReportDialog]);

  // Check device compatibility on component mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        // Check if browser supports audio API
        if (typeof navigator.mediaDevices === 'undefined' || 
            typeof navigator.mediaDevices.getUserMedia === 'undefined') {
          console.error("L'API audio n'est pas supportée par ce navigateur");
          setIsCompatible(false);
          return;
        }

        // Request permissions to verify they are available
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setIsCompatible(true);
      } catch (err) {
        console.error("Erreur lors de la vérification des permissions du microphone:", err);
        setIsCompatible(false);
      }
    };
    
    checkMicrophonePermission();
  }, [setIsCompatible]);

  // Show help dialog on first visit
  useEffect(() => {
    const hasSeenHelp = localStorage.getItem('noise-analyzer-help-seen');
    if (!hasSeenHelp) {
      setTimeout(() => {
        setShowHelpDialog(true);
        localStorage.setItem('noise-analyzer-help-seen', 'true');
      }, 1000);
    }
  }, [setShowHelpDialog]);

  // Auto-calibrate on component mount if not done already
  useEffect(() => {
    if (isCompatible && !autoCalibrated) {
      setTimeout(async () => {
        try {
          setIsCalibrating(true);
          const success = await autoCalibrate();
          setAutoCalibrated(!!success);
        } finally {
          setIsCalibrating(false);
        }
      }, 2000);
    }
  }, [isCompatible, autoCalibrated, autoCalibrate, setAutoCalibrated, setIsCalibrating]);
  
  return {};
};
