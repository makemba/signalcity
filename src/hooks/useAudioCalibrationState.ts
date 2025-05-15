
import { useRef } from 'react';

export const useAudioCalibrationState = () => {
  // Audio calibration state
  const calibrationRef = useRef<number>(15);
  
  const setCalibration = (value: number) => {
    calibrationRef.current = value;
  };
  
  const getCalibration = () => calibrationRef.current;
  
  return {
    calibrationRef,
    setCalibration,
    getCalibration
  };
};
