import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  
  const calibrationRef = useRef<number>(0);
  const measurementsRef = useRef<number[]>([]);
  const lastMeasurementRef = useRef<number>(0);
  const isInitializedRef = useRef<boolean>(false);

  const cleanupAudioResources = useCallback(() => {
    console.log("Cleaning up audio resources");
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Audio track stopped");
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

    if (audioContextRef.current?.state !== 'closed') {
      try {
        audioContextRef.current?.close();
        console.log("AudioContext closed");
      } catch (e) {
        console.log("Error closing AudioContext:", e);
      }
      audioContextRef.current = null;
    }
    
    isInitializedRef.current = false;
  }, []);

  const calculateDBFS = useCallback((buffer: Float32Array): number => {
    if (!buffer || buffer.length === 0) {
      console.log("Empty buffer received");
      return -100;
    }
    
    const validSamples = buffer.filter(value => 
      !isNaN(value) && isFinite(value) && Math.abs(value) <= 1
    );
    
    if (validSamples.length === 0) {
      console.log("No valid audio samples found");
      return -100;
    }

    let sumSquares = 0;
    for (const sample of validSamples) {
      sumSquares += sample * sample;
    }
    
    const rms = Math.sqrt(sumSquares / validSamples.length);
    
    if (rms < 0.00001) {
      return -100;
    }
    
    const dbFS = 20 * Math.log10(rms);
    
    const dbSPL = dbFS + 94 + calibrationRef.current;
    
    const finalDb = Math.max(30, Math.min(120, Math.round(dbSPL)));
    
    console.log("Audio analysis:", {
      rms: rms.toFixed(6),
      dbFS: dbFS.toFixed(2),
      appliedCalibration: calibrationRef.current,
      rawDbSPL: dbSPL.toFixed(2),
      finalDb: finalDb
    });
    
    return finalDb;
  }, []);

  const smoothMeasurement = useCallback((newValue: number): number => {
    if (newValue <= 0) return lastMeasurementRef.current;
    
    measurementsRef.current.push(newValue);
    if (measurementsRef.current.length > 5) {
      measurementsRef.current.shift();
    }
    
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

  const calibrate = useCallback(async () => {
    try {
      console.log("Starting calibration process...");
      toast({
        description: "Calibration en cours...",
      });
      
      cleanupAudioResources();
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      const context = new AudioContext();
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 4096;
      analyzer.smoothingTimeConstant = 0.5;
      
      const source = context.createMediaStreamSource(stream);
      source.connect(analyzer);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const samples = 5;
      let totalMeasurement = 0;
      const buffer = new Float32Array(analyzer.frequencyBinCount);
      
      console.log("Taking calibration measurements...");
      for (let i = 0; i < samples; i++) {
        analyzer.getFloatTimeDomainData(buffer);
        const measurement = calculateDBFS(buffer);
        console.log(`Calibration sample ${i+1}:`, measurement);
        totalMeasurement += measurement;
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      const avgMeasurement = totalMeasurement / samples;
      console.log("Average initial measurement:", avgMeasurement);
      
      calibrationRef.current = Math.round(40 - avgMeasurement);
      
      console.log("Calibration completed:", {
        avgMeasurement: avgMeasurement,
        newCalibration: calibrationRef.current
      });
      
      stream.getTracks().forEach(track => track.stop());
      context.close();
      
      toast({
        title: "Calibration réussie",
        description: "Le microphone a été calibré avec succès.",
      });

      return true;
    } catch (err) {
      console.error("Calibration error:", err);
      setError("Erreur de calibration: " + String(err));
      toast({
        variant: "destructive",
        title: "Erreur de calibration",
        description: "Impossible de calibrer le microphone.",
      });
      return false;
    }
  }, [calculateDBFS, cleanupAudioResources, toast]);

  const startRecording = useCallback(async () => {
    try {
      console.log("Starting audio recording and analysis...");
      setError("");
      
      cleanupAudioResources();
      
      measurementsRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      console.log("Microphone access granted");
      streamRef.current = stream;
      
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      console.log("AudioContext state:", audioContext.state);

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096;
      analyzer.smoothingTimeConstant = 0.5;
      analyzerRef.current = analyzer;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;
      source.connect(analyzer);
      
      console.log("Audio nodes connected");
      
      if (calibrationRef.current === 0) {
        calibrationRef.current = 15;
        console.log("Using default calibration value:", calibrationRef.current);
      }

      const analyzeSound = () => {
        if (!isRecording || !analyzerRef.current) {
          console.log("Analysis stopped");
          return;
        }

        try {
          const dataArray = new Float32Array(analyzerRef.current.frequencyBinCount);
          analyzerRef.current.getFloatTimeDomainData(dataArray);

          const rawDb = calculateDBFS(dataArray);
          
          if (rawDb > 0) {
            const smoothedDb = smoothMeasurement(rawDb);
            onNoiseLevel(smoothedDb);
          }
        } catch (err) {
          console.error("Error in analysis loop:", err);
        }
        
        animationFrameRef.current = requestAnimationFrame(analyzeSound);
      };

      setIsRecording(true);
      isInitializedRef.current = true;
      analyzeSound();
      
      toast({
        title: "Analyse sonore activée",
        description: "La mesure du niveau sonore est en cours.",
      });
      
      return true;
    } catch (err) {
      console.error("Error starting audio recording:", err);
      setError("Impossible d'accéder au microphone: " + String(err));
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez vérifier vos permissions.",
      });
      return false;
    }
  }, [calibrationRef, calculateDBFS, cleanupAudioResources, isRecording, onNoiseLevel, smoothMeasurement, toast]);

  const stopRecording = useCallback(() => {
    console.log("Stopping audio recording");
    setIsRecording(false);
    cleanupAudioResources();
    toast({
      description: "L'analyse sonore a été arrêtée.",
    });
  }, [cleanupAudioResources, toast]);

  useEffect(() => {
    return () => {
      console.log("useAudioAnalyzer unmounting, cleaning up resources");
      cleanupAudioResources();
    };
  }, [cleanupAudioResources]);

  return {
    isRecording,
    error,
    startRecording,
    stopRecording,
    calibrate
  };
};
