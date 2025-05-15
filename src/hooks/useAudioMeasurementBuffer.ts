
import { useRef } from 'react';

export const useAudioMeasurementBuffer = () => {
  // Measurement buffer state
  const measurementsRef = useRef<number[]>([]);
  const lastMeasurementRef = useRef<number>(0);
  
  const resetMeasurements = () => {
    measurementsRef.current = [];
    lastMeasurementRef.current = 0;
  };
  
  return {
    measurementsRef,
    lastMeasurementRef,
    resetMeasurements
  };
};
