
import { useState } from 'react';

export function useNoiseState() {
  const [decibels, setDecibels] = useState<number>(0);
  const [isCompatible, setIsCompatible] = useState<boolean>(true);
  const [measurementStatus, setMeasurementStatus] = useState<'idle' | 'starting' | 'active' | 'error'>('idle');
  const [measurementDuration, setMeasurementDuration] = useState<number>(0);
  const [measurementStartTime, setMeasurementStartTime] = useState<Date | null>(null);
  const [autoCalibrated, setAutoCalibrated] = useState<boolean>(false);
  
  return {
    decibels, 
    setDecibels,
    isCompatible,
    setIsCompatible,
    measurementStatus,
    setMeasurementStatus,
    measurementDuration,
    setMeasurementDuration,
    measurementStartTime,
    setMeasurementStartTime,
    autoCalibrated,
    setAutoCalibrated
  };
}
