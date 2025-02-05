import { useState, useEffect } from 'react';
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

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyzer: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;
    let stream: MediaStream | null = null;

    const analyzeAudio = async () => {
      try {
        console.log("Requesting microphone access...");
        stream = await navigator.mediaDevices.getUserMedia({ 
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        console.log("Microphone access granted");

        audioContext = new AudioContext();
        analyzer = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyzer.fftSize = 2048;
        analyzer.smoothingTimeConstant = 0.8;
        microphone.connect(analyzer);

        console.log("Audio context setup complete");

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateLevel = () => {
          if (!isRecording || !analyzer) return;

          analyzer.getByteFrequencyData(dataArray);
          
          // Calculer la moyenne RMS des fréquences
          let sum = 0;
          for (let i = 0; i < bufferLength; i++) {
            sum += Math.pow(dataArray[i], 2);
          }
          const rms = Math.sqrt(sum / bufferLength);
          
          // Conversion plus précise en dB
          // Référence: 20 * log10(amplitude/référence)
          const decibelValue = Math.round(20 * Math.log10(rms / 255) + 100);
          
          console.log("Current noise level:", decibelValue, "dB");
          setDecibels(decibelValue);
          onNoiseLevel(decibelValue);

          if (isRecording) {
            requestAnimationFrame(updateLevel);
          }
        };

        updateLevel();
        
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
      }
    };

    if (isRecording) {
      analyzeAudio();
    }

    return () => {
      if (audioContext) {
        console.log("Cleaning up audio resources...");
        audioContext.close();
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
    };
  }, [isRecording, onNoiseLevel, toast]);

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