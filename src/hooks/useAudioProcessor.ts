import { useCallback, useRef } from 'react';
import { useAudioCalibrationState } from './useAudioCalibrationState';
import { useAudioMeasurementBuffer } from './useAudioMeasurementBuffer';

export const useAudioProcessor = () => {
  // Use our calibration and measurement buffer hooks
  const { calibrationRef, getCalibration } = useAudioCalibrationState();
  const { measurementsRef, lastMeasurementRef, resetMeasurements } = useAudioMeasurementBuffer();
  
  // Calculate decibel level from audio buffer
  const calculateDBFS = useCallback((buffer: Float32Array): number => {
    if (!buffer || buffer.length === 0) return 0;
    
    // Calculate Root Mean Square (RMS)
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / buffer.length);
    
    // Convert to dB and apply calibration offset
    // Reference: 0dB = 1.0 in normalized audio
    if (rms === 0) return 0;
    
    // Calculate dBFS (dB Full Scale)
    // 20 * log10(rms) gives dBFS value
    let dbfs = 20 * Math.log10(rms);
    
    // Apply calibration and convert to typical dB SPL scale
    // Adding 94 is a common reference to convert from dBFS to dB SPL
    // (94 dB SPL is approximately 1 Pascal)
    const calibrationValue = getCalibration();
    const dbSpl = dbfs + 94 + calibrationValue;
    
    return Math.round(dbSpl);
  }, [getCalibration]);
  
  // Apply smoothing to measurements for a more stable reading
  const smoothMeasurement = useCallback((value: number): number => {
    if (value <= 0) return 0;
    
    // Add to measurement buffer
    measurementsRef.current.push(value);
    
    // Keep buffer at reasonable size
    if (measurementsRef.current.length > 10) {
      measurementsRef.current.shift();
    }
    
    // Apply exponential smoothing
    if (lastMeasurementRef.current === 0) {
      lastMeasurementRef.current = value;
      return value;
    }
    
    // Calculate smoothed value
    const alpha = 0.3; // Smoothing factor: lower = smoother, higher = more responsive
    const smoothed = alpha * value + (1 - alpha) * lastMeasurementRef.current;
    lastMeasurementRef.current = smoothed;
    
    return Math.round(smoothed);
  }, []);
  
  return {
    calculateDBFS,
    smoothMeasurement,
    resetMeasurements
  };
};
