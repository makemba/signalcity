import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();
  const calibrationRef = useRef<number>(0);
  const measurementsRef = useRef<number[]>([]);

  const cleanupAudioResources = useCallback(() => {
    console.log("Cleaning up audio resources");
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current?.state !== 'closed') {
      audioContextRef.current?.close();
      audioContextRef.current = null;
    }

    analyzerRef.current = null;
  }, []);

  const calculateDBFS = useCallback((buffer: Float32Array): number => {
    if (!buffer || buffer.length === 0) {
      console.log("Empty buffer received");
      return 40;
    }
    
    const validSamples = buffer.filter(value => 
      !isNaN(value) && isFinite(value) && Math.abs(value) <= 1
    );
    
    if (validSamples.length === 0) {
      console.log("No valid audio samples found");
      return 40;
    }

    let sumSquares = 0;
    for (const sample of validSamples) {
      sumSquares += sample * sample;
    }
    
    const rms = Math.sqrt(sumSquares / validSamples.length);
    
    if (rms < 0.0001) {
      return 40;
    }
    
    const dbFS = 20 * Math.log10(rms);
    
    const dbSPL = dbFS + 96 + calibrationRef.current;
    
    const finalDb = Math.max(30, Math.min(120, Math.round(dbSPL)));
    
    console.log("Audio analysis:", {
      rms: rms,
      dbFS: dbFS,
      dbSPL: dbSPL,
      finalDb: finalDb,
      samples: validSamples.length,
      calibration: calibrationRef.current
    });
    
    return finalDb;
  }, []);

  const smoothMeasurement = useCallback((newValue: number): number => {
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
    
    return Math.round(weightedSum / weightSum);
  }, []);

  const calibrate = useCallback(async () => {
    try {
      console.log("Starting calibration process...");
      toast({
        description: "Calibration en cours...",
      });
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      const context = new AudioContext({ sampleRate: 48000 });
      const analyzer = context.createAnalyser();
      const source = context.createMediaStreamSource(stream);
      
      analyzer.fftSize = 4096; 
      analyzer.smoothingTimeConstant = 0.5;
      source.connect(analyzer);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const samples = 5;
      let totalMeasurement = 0;
      
      const buffer = new Float32Array(analyzer.frequencyBinCount);
      
      for (let i = 0; i < samples; i++) {
        analyzer.getFloatTimeDomainData(buffer);
        const measurement = calculateDBFS(buffer);
        totalMeasurement += measurement;
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const avgMeasurement = totalMeasurement / samples;
      
      calibrationRef.current = 45 - avgMeasurement;
      
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
    } catch (err) {
      console.error("Calibration error:", err);
      setError("Erreur de calibration: " + String(err));
      toast({
        variant: "destructive",
        title: "Erreur de calibration",
        description: "Impossible de calibrer le microphone.",
      });
    }
  }, [calculateDBFS, toast]);

  const startRecording = useCallback(async () => {
    try {
      console.log("Starting audio recording and analysis...");
      measurementsRef.current = [];
      
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
          sampleRate: 48000
        }
      });
      
      console.log("Audio stream obtained successfully");
      streamRef.current = stream;
      
      const audioContext = new AudioContext({ sampleRate: 48000 });
      audioContextRef.current = audioContext;

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096;
      analyzer.smoothingTimeConstant = 0.5;
      analyzerRef.current = analyzer;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);

      const analyzeSound = () => {
        if (!isRecording || !analyzerRef.current) return;

        const dataArray = new Float32Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getFloatTimeDomainData(dataArray);

        const rawDb = calculateDBFS(dataArray);
        const smoothedDb = smoothMeasurement(rawDb);
        
        console.log("Calculated noise level:", smoothedDb, "dB");
        
        onNoiseLevel(smoothedDb);
        
        animationFrameRef.current = requestAnimationFrame(analyzeSound);
      };

      setIsRecording(true);
      analyzeSound();
      
      toast({
        title: "Analyse sonore activée",
        description: "La mesure du niveau sonore est en cours.",
      });
    } catch (err) {
      console.error("Microphone access error:", err);
      setError("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez vérifier vos permissions.",
      });
    }
  }, [isRecording, onNoiseLevel, calculateDBFS, smoothMeasurement, toast]);

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
