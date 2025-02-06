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
    // Calcul RMS (Root Mean Square) amélioré avec filtrage dynamique
    let sum = 0;
    let count = 0;
    let maxAbs = 0;
    
    // Première passe pour trouver la valeur maximale
    for (let i = 0; i < buffer.length; i++) {
      const absValue = Math.abs(buffer[i]);
      maxAbs = Math.max(maxAbs, absValue);
    }

    // Seuil dynamique basé sur la valeur maximale
    const threshold = maxAbs * 0.1; // 10% du maximum
    
    // Deuxième passe pour le calcul RMS avec seuil dynamique
    for (let i = 0; i < buffer.length; i++) {
      if (Math.abs(buffer[i]) > threshold) {
        sum += buffer[i] * buffer[i];
        count++;
      }
    }
    
    if (count === 0) {
      console.log("No significant sound detected");
      return 0;
    }

    const rms = Math.sqrt(sum / count);
    
    // Conversion en dB avec calibration dynamique
    const dbFS = 20 * Math.log10(rms);
    const dbSPL = dbFS + 94 + calibrationRef.current; // Ajout de la calibration
    
    console.log("Audio analysis:", {
      rms,
      dbFS,
      dbSPL,
      maxAmplitude: maxAbs,
      threshold,
      samplesAnalyzed: count,
      totalSamples: buffer.length,
      calibration: calibrationRef.current
    });

    return Math.max(0, Math.min(120, dbSPL)); // Limite à 120 dB pour la sécurité
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
        
        // Sauvegarde des mesures dans Supabase
        if (roundedDb > 0) {
          supabase.from('incidents').insert({
            category_id: 'noise',
            description: `Niveau sonore mesuré: ${roundedDb} dB`,
            location_lat: 0,
            location_lng: 0,
            metadata: {
              noise_level: roundedDb,
              noise_type: 'MEASUREMENT'
            }
          }).then(({ error }) => {
            if (error) console.error("Erreur lors de l'enregistrement de la mesure:", error);
          });
        }
        
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
        description: "Impossible d'accéder au microphone. Veuillez vérifier vos permissions.",
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
    stopRecording,
    calibrate
  };
};