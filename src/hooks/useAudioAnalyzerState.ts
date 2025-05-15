
import { useState } from 'react';

export type AudioAnalyzerState = {
  isRecording: boolean;
  error: string;
  calibrationFactor: number;
  measurementDuration: number;
  decibels: number;
}

export const useAudioAnalyzerState = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [calibrationFactor, setCalibrationFactor] = useState<number>(0);
  const [measurementDuration, setMeasurementDuration] = useState<number>(0);
  const [decibels, setDecibels] = useState<number>(0);
  
  const resetState = () => {
    setIsRecording(false);
    setError("");
    setMeasurementDuration(0);
    setDecibels(0);
  };
  
  return {
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
  };
};
