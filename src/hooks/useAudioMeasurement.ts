
import { useState, useEffect, useCallback, useRef } from 'react';

interface AudioMeasurementProps {
  onNoiseLevel: (level: number) => void;
  calculateDBFS: (buffer: Float32Array) => number;
  smoothMeasurement: (value: number) => number;
  initializeAudio: (options: any) => Promise<any>;
  releaseAudio: () => void;
  setIsRecording: (recording: boolean) => void;
  setError: (error: string) => void;
  setMeasurementDuration: (duration: number) => void; // Add this property
  setDecibels: (decibels: number) => void; // Add this property
}

export const useAudioMeasurement = ({
  onNoiseLevel,
  calculateDBFS,
  smoothMeasurement,
  initializeAudio,
  releaseAudio,
  setIsRecording,
  setError,
  setMeasurementDuration,
  setDecibels
}: AudioMeasurementProps) => {
  // Audio processing references
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Analysis flags
  const processingRef = useRef<boolean>(false);
  const analysisActiveRef = useRef<boolean>(false);

  // Cleanup all audio resources
  const cleanupAudioResources = useCallback(() => {
    console.log("Cleaning up audio resources");
    
    analysisActiveRef.current = false;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (sourceRef.current) {
      try {
        sourceRef.current.disconnect();
      } catch (e) {
        console.log("Error disconnecting source:", e);
      }
      sourceRef.current = null;
    }

    if (analyzerRef.current) {
      try {
        analyzerRef.current.disconnect();
      } catch (e) {
        console.log("Error disconnecting analyzer:", e);
      }
      analyzerRef.current = null;
    }

    releaseAudio();
    setIsRecording(false);
    processingRef.current = false;
  }, [releaseAudio, setIsRecording]);

  // Core sound analysis loop
  const analyzeSound = useCallback(() => {
    if (!analysisActiveRef.current || !analyzerRef.current) {
      processingRef.current = false;
      return;
    }
    
    if (processingRef.current) return;
    processingRef.current = true;
    
    const analyze = () => {
      if (!analysisActiveRef.current || !analyzerRef.current) {
        processingRef.current = false;
        return;
      }

      try {
        const dataArray = new Float32Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getFloatTimeDomainData(dataArray);

        const rawDb = calculateDBFS(dataArray);
        if (rawDb > 0) {
          const smoothedDb = smoothMeasurement(rawDb);
          onNoiseLevel(smoothedDb);
          setDecibels(smoothedDb);
        }

        // Continue analysis loop
        animationFrameRef.current = requestAnimationFrame(analyze);
      } catch (err) {
        console.error("Error in sound analysis:", err);
        processingRef.current = false;
      }
    };

    // Start the analysis loop
    animationFrameRef.current = requestAnimationFrame(analyze);
  }, [calculateDBFS, onNoiseLevel, setDecibels, smoothMeasurement]);

  // Start recording and analyzing
  const startRecording = useCallback(async () => {
    try {
      // Clean up any existing audio resources first
      cleanupAudioResources();
      
      console.log("Starting audio recording...");
      setError("");
      setMeasurementDuration(0);
      
      const audioResources = await initializeAudio({
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      });
      
      if (!audioResources) {
        throw new Error("Failed to initialize audio resources");
      }
      
      const { stream, audioContext } = audioResources;
      
      // Configure analyzer for optimal sound level measurement
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096; // Higher for better frequency resolution
      analyzer.smoothingTimeConstant = 0.5; // Moderate smoothing
      analyzerRef.current = analyzer;

      // Connect the microphone to the analyzer
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyzer);

      // Set recording state
      setIsRecording(true);
      analysisActiveRef.current = true;
      
      // Start analysis loop with a small delay to ensure connections are established
      setTimeout(() => {
        analyzeSound();
      }, 100);

      return true;
    } catch (err) {
      console.error("Error starting recording:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError("Erreur d'accès au microphone: " + errorMessage);
      cleanupAudioResources();
      return false;
    }
  }, [analyzeSound, cleanupAudioResources, initializeAudio, setError, setIsRecording, setMeasurementDuration]);

  // Reset function - stop recording and reset states
  const reset = useCallback(() => {
    cleanupAudioResources();
    console.log("Audio analyzer reset");
  }, [cleanupAudioResources]);

  return {
    cleanupAudioResources,
    analyzeSound,
    startRecording,
    reset
  };
};
