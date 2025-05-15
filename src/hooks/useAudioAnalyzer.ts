
import { useCallback } from 'react';
import { toast } from "sonner";
import { useAudioDevice } from './useAudioDevice';
import { useAudioProcessor } from './useAudioProcessor';
import { useAudioCalibration } from './useAudioCalibration';
import { useAudioMeasurement } from './useAudioMeasurement';
import { useAudioAnalyzerState } from './useAudioAnalyzerState';

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  // Use the extracted hooks
  const { 
    isRecording,
    error,
    calibrationFactor,
    measurementDuration,
    decibels,
    setIsRecording,
    setError,
    setCalibrationFactor,
    setMeasurementDuration,
    setDecibels,
    resetState
  } = useAudioAnalyzerState();
  
  const { 
    isAvailable, 
    error: deviceError, 
    initializeAudio, 
    releaseAudio 
  } = useAudioDevice();

  const { 
    calculateDBFS, 
    smoothMeasurement
  } = useAudioProcessor();
  
  const {
    calibrate,
    autoCalibrate
  } = useAudioCalibration({ 
    calculateDBFS, 
    initializeAudio, 
    releaseAudio, 
    setCalibrationFactor 
  });
  
  const {
    cleanupAudioResources,
    analyzeSound,
    startRecording: startAudioRecording,
  } = useAudioMeasurement({
    onNoiseLevel,
    calculateDBFS,
    smoothMeasurement,
    initializeAudio,
    releaseAudio,
    setIsRecording,
    setError,
    setMeasurementDuration,
    setDecibels
  });

  // Update error state when device error changes
  useCallback(() => {
    if (deviceError) setError(deviceError);
  }, [deviceError, setError]);

  const start = useCallback(async () => {
    try {
      await startAudioRecording();
      toast.info("Enregistrement démarré");
    } catch (err) {
      toast.error("Impossible de démarrer l'enregistrement");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }, [startAudioRecording, setError]);

  const stop = useCallback(async () => {
    try {
      await cleanupAudioResources();
      toast.success("Enregistrement terminé");
    } catch (err) {
      toast.error("Erreur lors de l'arrêt de l'enregistrement");
    }
  }, [cleanupAudioResources]);

  return {
    isRecording,
    error,
    calibrationFactor,
    measurementDuration,
    decibels,
    startRecording: start,
    stopRecording: stop,
    calibrate,
    reset: resetState,
    autoCalibrate,
    isAvailable
  };
};
