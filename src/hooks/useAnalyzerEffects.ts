
import { useEffect, useState } from 'react';
import { useNoiseAnalyzerContext } from '@/contexts/NoiseAnalyzerContext';
import { useAudioAnalyzer } from './useAudioAnalyzer';

export const useAnalyzerEffects = () => {
  const [isCompatible, setIsCompatible] = useState<boolean>(true);
  
  const {
    isRecording,
    decibels,
    measurementStatus,
    measurementDuration,
    setShowReportDialog,
    setShowHelpDialog
  } = useNoiseAnalyzerContext();
  
  const { autoCalibrate } = useAudioAnalyzer(() => {}); // Empty callback as we use context

  // Update measurement status based on recording state
  useEffect(() => {
    // This is now handled in the context
  }, [isRecording, decibels]);

  // Automatically handle reset when stopping recording
  useEffect(() => {
    if (!isRecording && measurementStatus === 'active') {
      // Auto-generate a report if the measurement was long enough
      if (decibels > 0 && measurementDuration > 3) {
        setShowReportDialog(true);
      }
    }
  }, [isRecording, measurementStatus, decibels, measurementDuration, setShowReportDialog]);

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
  }, [setShowHelpDialog]);

  // Auto-calibrate on component mount if not done already
  useEffect(() => {
    if (isCompatible) {
      setTimeout(async () => {
        try {
          await autoCalibrate();
        } catch (error) {
          console.error("Auto-calibration failed:", error);
        }
      }, 2000);
    }
  }, [isCompatible, autoCalibrate]);
  
  return { isCompatible };
};
