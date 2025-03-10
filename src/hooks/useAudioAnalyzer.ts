
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  // Audio processing references
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  // Analysis settings
  const calibrationRef = useRef<number>(15);
  const measurementsRef = useRef<number[]>([]);
  const lastMeasurementRef = useRef<number>(0);
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

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
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

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch (e) {
        console.log("Error closing AudioContext:", e);
      }
      audioContextRef.current = null;
    }
    
    setIsRecording(false);
    processingRef.current = false;
  }, []);

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
  }, []);

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
  }, []);

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
      
      // Request microphone with optimized settings
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      streamRef.current = stream;
      
      // Create audio context and analyzer
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

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
  }, [analyzeSound, cleanupAudioResources]);

  // Calibrate the microphone
  const calibrate = useCallback(async () => {
    try {
      cleanupAudioResources();
      
      // Request audio stream
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      // Create temporary audio context for calibration
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const context = new AudioContext();
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 4096;
      
      const source = context.createMediaStreamSource(stream);
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
      calibrationRef.current = Math.round(40 - avgMeasurement);
      
      console.log("Calibration complete. Offset:", calibrationRef.current);
      
      // Clean up calibration resources
      source.disconnect();
      stream.getTracks().forEach(track => track.stop());
      await context.close();
      
      return true;
    } catch (err) {
      console.error("Calibration error:", err);
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError("Erreur de calibration: " + errorMessage);
      return false;
    }
  }, [calculateDBFS, cleanupAudioResources]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      cleanupAudioResources();
    };
  }, [cleanupAudioResources]);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording: cleanupAudioResources,
    calibrate
  };
};
