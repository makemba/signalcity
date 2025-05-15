
import { useState, useEffect, useCallback } from 'react';
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
    setIsRecording,
    setError
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
  } = useAudioCalibration({ calculateDBFS, initializeAudio, releaseAudio });
  
  const {
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
  }, [deviceError, setError]);

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
