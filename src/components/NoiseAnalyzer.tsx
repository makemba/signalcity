import { useState, useEffect, useCallback, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { NOISE_THRESHOLDS } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const { toast } = useToast();
  
  // Utiliser useRef pour garder une référence stable aux ressources audio
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  const cleanupAudioResources = useCallback(() => {
    console.log("Cleaning up audio resources...");
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = undefined;
    }

    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log("Audio track stopped");
      });
      streamRef.current = null;
    }

    analyzerRef.current = null;
  }, []);

  useEffect(() => {
    const initializeAudio = async () => {
      if (!isRecording) return;

      try {
        console.log("Initializing audio analysis...");
        
        // Demander l'accès au microphone avec des paramètres optimisés
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: false, // Désactiver pour une meilleure précision
            noiseSuppression: false,
            autoGainControl: false,
            channelCount: 1
          }
        });
        
        streamRef.current = stream;
        console.log("Microphone access granted");

        // Créer et configurer le contexte audio
        const audioContext = new AudioContext({
          latencyHint: 'interactive',
          sampleRate: 48000
        });
        audioContextRef.current = audioContext;

        // Configurer l'analyseur
        const analyzer = audioContext.createAnalyser();
        analyzer.fftSize = 4096; // Augmenter pour plus de précision
        analyzer.smoothingTimeConstant = 0.5; // Réduire pour une réponse plus rapide
        analyzerRef.current = analyzer;

        // Connecter le microphone à l'analyseur
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyzer);

        console.log("Audio setup complete", {
          sampleRate: audioContext.sampleRate,
          fftSize: analyzer.fftSize,
          frequencyBinCount: analyzer.frequencyBinCount
        });

        // Fonction de calibration pour convertir en dB SPL
        const calculateDBFS = (buffer: Uint8Array): number => {
          let sum = 0;
          for (let i = 0; i < buffer.length; i++) {
            // Normaliser entre -1 et 1
            const amplitude = (buffer[i] - 128) / 128;
            sum += amplitude * amplitude;
          }
          const rms = Math.sqrt(sum / buffer.length);
          // Conversion en dB avec référence à -94 dB SPL
          return 20 * Math.log10(rms) + 94;
        };

        const analyzeSound = () => {
          if (!isRecording || !analyzerRef.current) {
            console.log("Analysis stopped");
            return;
          }

          const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
          analyzerRef.current.getByteTimeDomainData(dataArray);

          const db = calculateDBFS(dataArray);
          const roundedDb = Math.max(0, Math.round(db));
          
          console.log("Current noise level:", roundedDb, "dB SPL");
          setDecibels(roundedDb);
          onNoiseLevel(roundedDb);

          animationFrameRef.current = requestAnimationFrame(analyzeSound);
        };

        analyzeSound();
        
        toast({
          title: "Analyse sonore activée",
          description: "L'analyse du niveau sonore a démarré avec succès.",
        });

      } catch (err) {
        console.error("Erreur d'accès au microphone:", err);
        setError("Impossible d'accéder au microphone. Veuillez vérifier les permissions dans votre navigateur.");
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible d'accéder au microphone. Veuillez vérifier les permissions.",
        });
        cleanupAudioResources();
      }
    };

    initializeAudio();

    return () => {
      cleanupAudioResources();
    };
  }, [isRecording, onNoiseLevel, toast, cleanupAudioResources]);

  const getNoiseLevel = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) return "Très élevé";
    if (decibels >= NOISE_THRESHOLDS.HIGH) return "Élevé";
    if (decibels >= NOISE_THRESHOLDS.MODERATE) return "Modéré";
    return "Acceptable";
  };

  const getNoiseColor = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) return "text-red-600";
    if (decibels >= NOISE_THRESHOLDS.HIGH) return "text-orange-500";
    if (decibels >= NOISE_THRESHOLDS.MODERATE) return "text-yellow-500";
    return "text-green-500";
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      console.log("Stopping noise analysis...");
      setIsRecording(false);
      toast({
        description: "L'analyse sonore a été arrêtée.",
      });
    } else {
      console.log("Starting noise analysis...");
      setIsRecording(true);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg">
        <button
          onClick={handleToggleRecording}
          className={`px-4 py-2 rounded-full transition-colors ${
            isRecording 
              ? "bg-red-500 hover:bg-red-600 text-white"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {isRecording ? "Arrêter la mesure" : "Mesurer le niveau sonore"}
        </button>

        {isRecording && (
          <div className="mt-4 text-center">
            <p className="text-2xl font-bold">
              <span className={getNoiseColor()}>{decibels}</span> dB
            </p>
            <p className={`text-sm ${getNoiseColor()}`}>
              Niveau: {getNoiseLevel()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}