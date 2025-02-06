import { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useAudioAnalyzer = (onNoiseLevel: (level: number) => void) => {
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

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
    // Calcul RMS (Root Mean Square) amélioré
    let sum = 0;
    let count = 0;
    
    for (let i = 0; i < buffer.length; i++) {
      // Ignore les valeurs trop faibles (réduction du bruit)
      if (Math.abs(buffer[i]) > 0.001) {
        sum += buffer[i] * buffer[i];
        count++;
      }
    }
    
    // Si aucun son significatif n'est détecté
    if (count === 0) {
      console.log("No significant sound detected");
      return 0;
    }

    const rms = Math.sqrt(sum / count);
    
    // Conversion en dB avec une meilleure calibration
    // Reference: -20 dBFS = 74 dB SPL (calibration typique pour un micro)
    const dbFS = 20 * Math.log10(rms);
    const dbSPL = dbFS + 94; // 94 dB SPL @ 0 dBFS
    
    console.log("Audio analysis:", {
      rms,
      dbFS,
      dbSPL,
      samplesAnalyzed: count,
      totalSamples: buffer.length
    });

    return Math.max(0, dbSPL);
  }, []);

  const startRecording = useCallback(async () => {
    try {
      console.log("Starting audio recording...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1
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

        const db = calculateDBFS(dataArray);
        const roundedDb = Math.max(0, Math.round(db));
        console.log("Calculated decibel level:", roundedDb);
        
        onNoiseLevel(roundedDb);
        animationFrameRef.current = requestAnimationFrame(analyzeSound);
      };

      analyzeSound();
      setIsRecording(true);
      
      toast({
        title: "Analyse sonore activée",
        description: "L'analyse du niveau sonore a démarré avec succès.",
      });
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      setError("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez vérifier les permissions.",
      });
    }
  }, [isRecording, onNoiseLevel, calculateDBFS, toast]);

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
    stopRecording
  };
};