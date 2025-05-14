
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from "sonner";
import { useAudioDevice } from './useAudioDevice';
import { useAudioProcessor } from './useAudioProcessor';
import { useAudioCalibration } from './useAudioCalibration';
import { useAudioMeasurement } from './useAudioMeasurement';

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  
  // Use the extracted hooks
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
  } = useAudioCalibration({ calculateDBFS, initializeAudio, releaseAudio });
  
  const {
    analyzerRef,
    sourceRef,
    animationFrameRef,
    analysisActiveRef,
    processingRef,
    cleanupAudioResources,
    analyzeSound,
    startRecording,
    reset
  } = useAudioMeasurement({
    onNoiseLevel,
    calculateDBFS,
    smoothMeasurement,
    initializeAudio,
    releaseAudio,
    setIsRecording,
    setError
  });

  // Update error state when device error changes
  useEffect(() => {
    if (deviceError) setError(deviceError);
  }, [deviceError]);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording: cleanupAudioResources,
    calibrate,
    reset,
    autoCalibrate
  };
};
