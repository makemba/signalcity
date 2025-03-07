
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
      console.warn("Buffer vide ou non défini");
      return 0;
    }
    
    // Filtre les valeurs aberrantes
    const validSamples = buffer.filter(value => 
      !isNaN(value) && isFinite(value) && Math.abs(value) <= 1
    );
    
    if (validSamples.length === 0) {
      console.warn("Aucun échantillon audio valide");
      return 0;
    }

    // Calcul RMS (Root Mean Square)
    let sumSquares = 0;
    for (const sample of validSamples) {
      sumSquares += sample * sample;
    }
    
    const rms = Math.sqrt(sumSquares / validSamples.length);
    
    // Protection contre les valeurs trop faibles (log de 0)
    if (rms < 0.0001) {
      return 30; // Niveau minimal de bruit ambiant
    }
    
    // Conversion en dB
    const dbFS = 20 * Math.log10(rms);
    
    // Conversion en dB SPL (avec calibration)
    // Référence: 0 dBFS ≈ 96 dB SPL pour un micro standard
    const dbSPL = dbFS + 96 + calibrationRef.current;
    
    // Limites raisonnables (30-120 dB)
    const finalDb = Math.max(30, Math.min(120, Math.round(dbSPL)));
    
    console.log("Analyse audio:", {
      rms,
      dbFS,
      dbSPL,
      finalDb,
      samplesAnalyzed: validSamples.length,
      totalSamples: buffer.length,
      calibration: calibrationRef.current
    });
    
    return finalDb;
  }, []);

  const smoothMeasurement = useCallback((newValue: number): number => {
    // Garde les 5 dernières mesures pour lissage
    measurementsRef.current.push(newValue);
    if (measurementsRef.current.length > 5) {
      measurementsRef.current.shift();
    }
    
    // Calcule la moyenne pondérée (plus de poids aux mesures récentes)
    let weightedSum = 0;
    let weightSum = 0;
    
    measurementsRef.current.forEach((value, index) => {
      const weight = index + 1; // Plus de poids aux valeurs récentes
      weightedSum += value * weight;
      weightSum += weight;
    });
    
    return Math.round(weightedSum / weightSum);
  }, []);

  const calibrate = useCallback(async () => {
    try {
      console.log("Démarrage de la calibration...");
      toast({
        description: "Calibration en cours...",
      });
      
      // Initialise l'accès au micro avec des paramètres optimaux
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
      
      // Attendre un moment pour stabiliser
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Prendre plusieurs mesures et les moyenner
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
      
      // Calibrer pour qu'un environnement calme soit à environ 40-45 dB
      calibrationRef.current = 45 - avgMeasurement;
      
      console.log("Calibration terminée:", {
        avgMeasurement,
        newCalibration: calibrationRef.current
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
      console.log("Démarrage de l'enregistrement audio...");
      // Réinitialise les mesures précédentes
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
      
      console.log("Flux audio obtenu avec succès");
      streamRef.current = stream;
      const audioContext = new AudioContext({ sampleRate: 48000 });
      audioContextRef.current = audioContext;

      const analyzer = audioContext.createAnalyser();
      analyzer.fftSize = 4096; // Meilleure résolution fréquentielle
      analyzer.smoothingTimeConstant = 0.5; // Équilibre entre réactivité et stabilité
      analyzerRef.current = analyzer;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyzer);

      // Fonction d'analyse mise à jour avec meilleur lissage
      const analyzeSound = () => {
        if (!isRecording || !analyzerRef.current) return;

        const dataArray = new Float32Array(analyzerRef.current.frequencyBinCount);
        analyzerRef.current.getFloatTimeDomainData(dataArray);

        const rawDb = calculateDBFS(dataArray);
        const smoothedDb = smoothMeasurement(rawDb);
        
        console.log("Niveau sonore calculé:", smoothedDb, "dB");
        
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
      console.error("Erreur d'accès au microphone:", err);
      setError("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez vérifier vos permissions.",
      });
    }
  }, [isRecording, onNoiseLevel, calculateDBFS, smoothMeasurement, toast]);

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
