
import { useState } from 'react';

export const useAudioAnalyzerState = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  
  return {
    isRecording,
    error,
    setIsRecording,
    setError
  };
};
