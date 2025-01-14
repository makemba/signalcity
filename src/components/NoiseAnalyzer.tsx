import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { NOISE_THRESHOLDS } from '@/lib/constants';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState<number>(0);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let audioContext: AudioContext | null = null;
    let analyzer: AnalyserNode | null = null;
    let microphone: MediaStreamAudioSourceNode | null = null;

    const analyzeAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContext = new AudioContext();
        analyzer = audioContext.createAnalyser();
        microphone = audioContext.createMediaStreamSource(stream);
        
        analyzer.fftSize = 2048;
        microphone.connect(analyzer);

        const bufferLength = analyzer.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const updateLevel = () => {
          if (!isRecording || !analyzer) return;

          analyzer.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((acc, value) => acc + value, 0) / bufferLength;
          const decibelValue = Math.round((average / 255) * 100); // Conversion approximative
          
          setDecibels(decibelValue);
          onNoiseLevel(decibelValue);

          if (isRecording) {
            requestAnimationFrame(updateLevel);
          }
        };

        updateLevel();
      } catch (err) {
        console.error("Erreur d'accès au microphone:", err);
        setError("Impossible d'accéder au microphone. Veuillez vérifier les permissions.");
      }
    };

    if (isRecording) {
      analyzeAudio();
    }

    return () => {
      if (audioContext) {
        audioContext.close();
      }
      setIsRecording(false);
    };
  }, [isRecording, onNoiseLevel]);

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
          onClick={() => setIsRecording(!isRecording)}
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