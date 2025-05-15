
import { useCallback, useEffect } from 'react';
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
  useEffect(() => {
    if (deviceError) setError(deviceError);
  }, [deviceError, setError]);

  const start = useCallback(async () => {
    try {
      const success = await startAudioRecording();
      if (success) {
        toast.info("Enregistrement démarré");
        return true;
      } else {
        toast.error("Impossible de démarrer l'enregistrement");
        return false;
      }
    } catch (err) {
      toast.error("Impossible de démarrer l'enregistrement");
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      return false;
    }
  }, [startAudioRecording, setError]);

  const stop = useCallback(async () => {
    try {
      await cleanupAudioResources();
      toast.success("Enregistrement terminé");
      return true;
    } catch (err) {
      toast.error("Erreur lors de l'arrêt de l'enregistrement");
      return false;
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
