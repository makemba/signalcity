
import { useState, useEffect, useCallback, useRef } from 'react';

export const useAudioDevice = () => {
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Audio resources
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Check if the device has microphone access
  const checkAvailability = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach(track => track.stop());
      setIsAvailable(true);
      return true;
    } catch (err) {
      console.error("Audio device not available:", err);
      setIsAvailable(false);
      setError("Microphone not available");
      return false;
    }
  }, []);
  
  // Initialize the audio context and get the microphone stream
  const initializeAudio = useCallback(async (options = {
    echoCancellation: false,
    noiseSuppression: false,
    autoGainControl: false
  }) => {
    try {
      // Clean up existing resources first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        await audioContextRef.current.close();
      }
      
      // Get new audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: options
      });
      
      streamRef.current = stream;
      
      // Create new audio context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();
      
      setIsInitialized(true);
      setError("");
      
      return {
        stream,
        audioContext: audioContextRef.current
      };
    } catch (err) {
      console.error("Failed to initialize audio:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Error initializing audio: ${errorMessage}`);
      setIsInitialized(false);
      return null;
    }
  }, []);
  
  // Release all audio resources
  const releaseAudio = useCallback(async () => {
    setIsInitialized(false);
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (audioContextRef.current) {
      try {
        await audioContextRef.current.close();
      } catch (e) {
        console.log("Error closing AudioContext:", e);
      }
      audioContextRef.current = null;
    }
  }, []);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      releaseAudio();
    };
  }, [releaseAudio]);
  
  return {
    isAvailable,
    isInitialized,
    error,
    checkAvailability,
    initializeAudio,
    releaseAudio
  };
};
