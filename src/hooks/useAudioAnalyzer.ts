
import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  
  const calibrationRef = useRef<number>(15);
  const measurementsRef = useRef<number[]>([]);
  const lastMeasurementRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);

  const cleanupAudioResources = useCallback(() => {
    console.log("Cleaning up audio resources");
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
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

    if (audioContextRef.current) {
      try {
        if (audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
        }
      } catch (e) {
        console.log("Error closing AudioContext:", e);
      }
      audioContextRef.current = null;
    }
    
    setIsRecording(false);
    processingRef.current = false;
  }, []);

  const calculateDBFS = useCallback((buffer: Float32Array): number => {
    if (!buffer || buffer.length === 0) return -100;
    
    // Filter out invalid values
    const validSamples = buffer.filter(value => 
      !isNaN(value) && isFinite(value) && Math.abs(value) <= 1
    );
    
    if (validSamples.length === 0) return -100;

    // Calculate RMS (Root Mean Square)
    let sumSquares = 0;
    for (const sample of validSamples) {
      sumSquares += sample * sample;
    }
    
    const rms = Math.sqrt(sumSquares / validSamples.length);
    if (rms <= 0.00001) return -100;
    
    // Convert to dB
    const dbFS = 20 * Math.log10(rms);
    
    // Apply calibration and convert to SPL (Sound Pressure Level)
    const dbSPL = dbFS + 94 + calibrationRef.current;
    
    // Clamp to reasonable range
    const finalDb = Math.max(30, Math.min(120, Math.round(dbSPL)));
    
    return finalDb;
  }, []);

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
      const weight = index + 1;
      weightedSum += value * weight;
      weightSum += weight;
    });
    
    const smoothedValue = Math.round(weightedSum / weightSum);
    lastMeasurementRef.current = smoothedValue;
    return smoothedValue;
  }, []);

  const analyzeSound = useCallback(() => {
    if (!isRecording || !analyzerRef.current || processingRef.current) return;
    
    processingRef.current = true;
    
    const analyze = () => {
      if (!isRecording || !analyzerRef.current) {
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

    analyze();
  }, [calculateDBFS, isRecording, onNoiseLevel, smoothMeasurement]);

  const startRecording = useCallback(async () => {
    try {
      cleanupAudioResources();
      
      console.log("Starting audio recording...");
      
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      streamRef.current = stream;
      
      // Create audio context and analyzer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = audioContext;

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096; // Higher for better frequency resolution
      analyzer.smoothingTimeConstant = 0.5;
      analyzerRef.current = analyzer;

      // Connect the microphone to the analyzer
      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyzer);

      setIsRecording(true);
      
      // Start analysis loop
      setTimeout(() => {
        analyzeSound();
      }, 100);

      return true;
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Erreur d'accès au microphone: " + String(err));
      return false;
    }
  }, [analyzeSound, cleanupAudioResources]);

  const calibrate = useCallback(async () => {
    try {
      cleanupAudioResources();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
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
      stream.getTracks().forEach(track => track.stop());
      context.close();
      
      return true;
    } catch (err) {
      console.error("Calibration error:", err);
      setError("Erreur de calibration: " + String(err));
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
