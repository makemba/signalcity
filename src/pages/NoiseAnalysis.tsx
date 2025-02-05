import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Volume2, VolumeX, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function NoiseAnalysis() {
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log("NoiseAnalysis component mounted");
    return () => {
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [audioContext]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const context = new AudioContext();
      const source = context.createMediaStreamSource(stream);
      const analyzer = context.createAnalyser();
      analyzer.fftSize = 2048;
      source.connect(analyzer);
      
      setAudioContext(context);
      setIsRecording(true);

      const dataArray = new Uint8Array(analyzer.frequencyBinCount);
      
      const analyzeSound = () => {
        if (!isRecording) return;
        
        analyzer.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
        const estimatedDecibels = Math.round((average / 255) * 100);
        setDecibels(estimatedDecibels);

        if (estimatedDecibels > 85) {
          // Save high noise level incident
          saveNoiseIncident(estimatedDecibels);
        }

        requestAnimationFrame(analyzeSound);
      };

      analyzeSound();
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      setError("Impossible d'accéder au microphone. Veuillez vérifier vos permissions.");
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez vérifier vos permissions.",
        variant: "destructive",
      });
    }
  };

  const saveNoiseIncident = async (noiseLevel: number) => {
    try {
      const { error: incidentError } = await supabase
        .from('incidents')
        .insert({
          category_id: 'noise',
          description: `Niveau sonore élevé détecté: ${noiseLevel} dB`,
          location_lat: 0, // À remplacer par la géolocalisation réelle
          location_lng: 0, // À remplacer par la géolocalisation réelle
          metadata: {
            noise_level: noiseLevel,
            noise_type: 'MEASUREMENT'
          }
        });

      if (incidentError) throw incidentError;

      toast({
        title: "Niveau sonore élevé",
        description: `Un niveau sonore de ${noiseLevel} dB a été enregistré et signalé.`,
      });
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du niveau sonore:", error);
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
    toast({
      title: "Mesure terminée",
      description: "L'analyse sonore a été arrêtée.",
    });
  };

  const getNoiseLevel = (level: number) => {
    if (level > 85) return { text: "Dangereux", color: "text-red-500" };
    if (level > 70) return { text: "Élevé", color: "text-orange-500" };
    if (level > 50) return { text: "Modéré", color: "text-yellow-500" };
    return { text: "Normal", color: "text-green-500" };
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Analyse des Nuisances Sonores</h1>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="p-6 mb-8 shadow-lg">
        <div className="flex flex-col items-center space-y-6">
          {decibels !== null && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-4">Niveau sonore actuel</h2>
              <div className="text-5xl font-bold mb-2">
                {decibels} dB
              </div>
              <div className={`text-lg font-medium ${getNoiseLevel(decibels).color}`}>
                {getNoiseLevel(decibels).text}
                {decibels > 85 && (
                  <AlertTriangle className="h-5 w-5 inline ml-2" />
                )}
              </div>
            </div>
          )}
          
          <Button
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            className={`${
              isRecording 
                ? "bg-red-500 hover:bg-red-600" 
                : "bg-blue-500 hover:bg-blue-600"
            } text-white w-full max-w-sm`}
          >
            {isRecording ? (
              <>
                <VolumeX className="mr-2 h-5 w-5" /> Arrêter l'analyse
              </>
            ) : (
              <>
                <Volume2 className="mr-2 h-5 w-5" /> Commencer l'analyse
              </>
            )}
          </Button>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Info className="h-5 w-5 mr-2 text-blue-500" />
            Guide des niveaux sonores
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center text-green-500">
              <span className="w-24">0-50 dB:</span>
              <span>Calme (chuchotement)</span>
            </li>
            <li className="flex items-center text-yellow-500">
              <span className="w-24">50-70 dB:</span>
              <span>Conversation normale</span>
            </li>
            <li className="flex items-center text-orange-500">
              <span className="w-24">70-85 dB:</span>
              <span>Rue animée</span>
            </li>
            <li className="flex items-center text-red-500">
              <span className="w-24">85+ dB:</span>
              <span>Niveau potentiellement dangereux</span>
            </li>
          </ul>
        </Card>

        <Card className="p-6 shadow-md">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Recommandations
          </h3>
          <ul className="space-y-3">
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Évitez l'exposition prolongée aux bruits forts
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Utilisez une protection auditive si nécessaire
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Signalez les nuisances sonores persistantes
            </li>
            <li className="flex items-center">
              <span className="mr-2">•</span>
              Respectez les horaires de calme
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}