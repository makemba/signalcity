
import { useCallback, useRef } from 'react';
import { useAudioCalibrationState } from './useAudioCalibrationState';
import { useAudioMeasurementBuffer } from './useAudioMeasurementBuffer';

export const useAudioProcessor = () => {
  // Use the extracted audio state hooks
  const { calibrationRef } = useAudioCalibrationState();
  const { measurementsRef, lastMeasurementRef } = useAudioMeasurementBuffer();
  
  // Calculate decibel level from audio buffer
  const calculateDBFS = useCallback((buffer: Float32Array): number => {
    if (!buffer || buffer.length === 0) return -100;
    
    // Calculate RMS (Root Mean Square)
    let sumSquares = 0;
    let validSamples = 0;
    
    for (let i = 0; i < buffer.length; i++) {
      const sample = buffer[i];
      if (!isNaN(sample) && isFinite(sample) && Math.abs(sample) <= 1) {
        sumSquares += sample * sample;
        validSamples++;
      }
    }
    
    if (validSamples === 0) return -100;
    
    const rms = Math.sqrt(sumSquares / validSamples);
    if (rms <= 0.00001) return -100;
    
    // Convert to dB
    const dbFS = 20 * Math.log10(rms);
    
    // Apply calibration and convert to SPL (Sound Pressure Level)
    // 94 dB is the reference level for 1 Pascal
    const dbSPL = dbFS + 94 + calibrationRef.current;
    
    // Clamp to reasonable range (30-120 dB)
    return Math.max(30, Math.min(120, Math.round(dbSPL)));
  }, [calibrationRef]);

  // Smooth measurement for more stable readings
  const smoothMeasurement = useCallback((newValue: number): number => {
    if (newValue <= 0) return lastMeasurementRef.current;
    
    // Add new measurement to rolling window
    measurementsRef.current.push(newValue);
    if (measurementsRef.current.length > 5) {
      measurementsRef.current.shift();
    }
    
    // Calculate weighted average (more weight to newer values)
    let weightedSum = 0;
    let weightSum = 0;
    
    measurementsRef.current.forEach((value, index) => {
      const weight = index + 1; // Higher weight for more recent values
      weightedSum += value * weight;
      weightSum += weight;
    });
    
    const smoothedValue = weightSum > 0 ? Math.round(weightedSum / weightSum) : newValue;
    lastMeasurementRef.current = smoothedValue;
    return smoothedValue;
  }, [measurementsRef, lastMeasurementRef]);

  // Update calibration
  const setCalibration = useCallback((value: number) => {
    calibrationRef.current = value;
  }, [calibrationRef]);

  return {
    calculateDBFS,
    smoothMeasurement,
    setCalibration,
    getCalibration: () => calibrationRef.current
  };
};
