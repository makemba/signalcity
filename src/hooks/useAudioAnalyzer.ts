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
    let sum = 0;
    let count = 0;
    
    // Calcul RMS amélioré
    for (let i = 0; i < buffer.length; i++) {
      const value = buffer[i];
      if (!isNaN(value) && isFinite(value)) {
        sum += value * value;
        count++;
      }
    }
    
    if (count === 0) {
      console.log("Aucun échantillon audio valide détecté");
      return 0;
    }

    const rms = Math.sqrt(sum / count);
    
    // Conversion en dB avec meilleure calibration
    const dbFS = 20 * Math.log10(Math.max(rms, 1e-10));
    const dbSPL = dbFS + 130 + calibrationRef.current; // Ajustement de la référence

    console.log("Analyse audio:", {
      rms,
      dbFS,
      dbSPL,
      samplesAnalyzed: count,
      totalSamples: buffer.length,
      calibration: calibrationRef.current
    });

    return Math.max(30, Math.min(120, Math.round(dbSPL))); // Limite minimale à 30dB
  }, []);

  const calibrate = useCallback(async () => {
    try {
      // Supposons un niveau de référence de 60 dB dans un environnement calme
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      
      const context = new AudioContext();
      const analyzer = context.createAnalyser();
      const source = context.createMediaStreamSource(stream);
      
      analyzer.fftSize = 4096;
      source.connect(analyzer);
      
      const buffer = new Float32Array(analyzer.frequencyBinCount);
      analyzer.getFloatTimeDomainData(buffer);
      
      const measuredDB = calculateDBFS(buffer);
      calibrationRef.current = 60 - measuredDB; // Ajuste pour obtenir 60 dB
      
      console.log("Calibration completed:", {
        measuredDB,
        calibrationOffset: calibrationRef.current
      });
      
      // Nettoyage
      stream.getTracks().forEach(track => track.stop());
      context.close();
      
      toast({
        title: "Calibration réussie",
        description: "Le microphone a été calibré avec succès.",
      });
    } catch (err) {
      console.error("Erreur de calibration:", err);
      toast({
        variant: "destructive",
        title: "Erreur de calibration",
        description: "Impossible de calibrer le microphone.",
      });
    }
  }, [calculateDBFS, toast]);

  const startRecording = useCallback(async () => {
    try {
      console.log("Démarrage de l'enregistrement audio...");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
          channelCount: 1,
          sampleRate: 48000
        }
      });
      
      console.log("Flux audio obtenu avec succès");
      streamRef.current = stream;
      const audioContext = new AudioContext({ sampleRate: 48000 });
      audioContextRef.current = audioContext;

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096;
      analyzer.smoothingTimeConstant = 0.8; // Augmentation du lissage
      analyzerRef.current = analyzer;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);

      // Fonction d'analyse mise à jour
      const analyzeSound = () => {
        if (!isRecording || !analyzerRef.current) return;

        const dataArray = new Float32Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getFloatTimeDomainData(dataArray);

        const db = calculateDBFS(dataArray);
        console.log("Niveau sonore calculé:", db, "dB");
        
        onNoiseLevel(db);
        animationFrameRef.current = requestAnimationFrame(analyzeSound);
      };

      setIsRecording(true);
      analyzeSound();
      
      toast({
        title: "Analyse sonore activée",
        description: "La mesure du niveau sonore est en cours.",
      });
    } catch (err) {
      console.error("Erreur d'accès au microphone:", err);
      setError("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez vérifier vos permissions.",
      });
    }
  }, [isRecording, onNoiseLevel, calculateDBFS, toast]);

  const stopRecording = useCallback(() => {
    console.log("Arrêt de l'enregistrement audio");
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
