
import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from "sonner";
import { useAudioDevice } from './useAudioDevice';
import { useAudioProcessor } from './useAudioProcessor';

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  
  // Audio processing references
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Analysis flags
  const processingRef = useRef<boolean>(false);
  const analysisActiveRef = useRef<boolean>(false);

  // Use the extracted hooks
  const { 
    isAvailable, 
    error: deviceError, 
    initializeAudio, 
    releaseAudio 
  } = useAudioDevice();

  const { 
    calculateDBFS, 
    smoothMeasurement, 
    setCalibration, 
    getCalibration 
  } = useAudioProcessor();

  // Update error state when device error changes
  useEffect(() => {
    if (deviceError) setError(deviceError);
  }, [deviceError]);

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
  }, [releaseAudio]);

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
          console.log("Raw dB:", rawDb, "Smoothed dB:", smoothedDb);
          onNoiseLevel(smoothedDb);
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
  }, [calculateDBFS, onNoiseLevel, smoothMeasurement]);

  // Start recording and analyzing
  const startRecording = useCallback(async () => {
    try {
      // Clean up any existing audio resources first
      cleanupAudioResources();
      
      console.log("Starting audio recording...");
      setError("");
      
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
  }, [analyzeSound, cleanupAudioResources, initializeAudio]);

  // Calibrate the microphone
  const calibrate = useCallback(async () => {
    try {
      cleanupAudioResources();
      
      const audioResources = await initializeAudio({
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false
      });
      
      if (!audioResources) {
        throw new Error("Failed to initialize audio resources");
      }
      
      const { stream, audioContext } = audioResources;
      
      // Create analyzer for calibration
      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096;
      
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);
      
      // Wait for the audio system to stabilize
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let totalMeasurement = 0;
      const buffer = new Float32Array(analyzer.frequencyBinCount);
      const samples = 5;
      
      // Take multiple samples for better accuracy
      for (let i = 0; i < samples; i++) {
        analyzer.getFloatTimeDomainData(buffer);
        const measurement = calculateDBFS(buffer);
        totalMeasurement += measurement;
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      // Target a background noise level of ~40dB
      const avgMeasurement = totalMeasurement / samples;
      const newCalibration = Math.round(40 - avgMeasurement);
      setCalibration(newCalibration);
      
      console.log("Calibration complete. Offset:", newCalibration);
      
      // Clean up calibration resources
      source.disconnect();
      
      // Clean up the audio resources created for calibration
      releaseAudio();
      
      return true;
    } catch (err) {
      console.error("Calibration error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError("Erreur de calibration: " + errorMessage);
      return false;
    }
  }, [calculateDBFS, cleanupAudioResources, initializeAudio, releaseAudio, setCalibration]);

  // Reset function - stop recording and reset states
  const reset = useCallback(() => {
    cleanupAudioResources();
    console.log("Audio analyzer reset");
  }, [cleanupAudioResources]);

  // Auto-calibrate function
  const autoCalibrate = useCallback(async () => {
    console.log("Auto-calibrating microphone...");
    const success = await calibrate();
    if (success) {
      toast("Calibration automatique terminée");
    } else {
      toast("Échec de la calibration automatique");
    }
    return success;
  }, [calibrate]);

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
