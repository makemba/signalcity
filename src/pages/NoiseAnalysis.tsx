import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export default function NoiseAnalysis() {
  const [isRecording, setIsRecording] = useState(false);
  const [decibels, setDecibels] = useState<number | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
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
          toast({
            title: "Niveau sonore élevé détecté",
            description: "Le niveau sonore dépasse les normes recommandées.",
            variant: "destructive",
          });
        }

        requestAnimationFrame(analyzeSound);
      };

      analyzeSound();
    } catch (error) {
      console.error("Erreur lors de l'accès au microphone:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'accéder au microphone. Veuillez vérifier vos permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (audioContext) {
      audioContext.close();
      setAudioContext(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Analyse des Nuisances Sonores</h1>
      
      <Card className="p-6 mb-8">
        <div className="flex flex-col items-center space-y-4">
          {decibels !== null && (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Niveau sonore actuel</h2>
              <div className="text-4xl font-bold">
                {decibels} dB
                {decibels > 85 ? (
                  <AlertTriangle className="h-8 w-8 text-red-500 inline ml-2" />
                ) : null}
              </div>
            </div>
          )}
          
          <Button
            size="lg"
            onClick={isRecording ? stopRecording : startRecording}
            className={`${
              isRecording ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
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
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Guide des niveaux sonores</h3>
          <ul className="space-y-2">
            <li>0-30 dB : Calme (chuchotement)</li>
            <li>30-50 dB : Conversation normale</li>
            <li>50-70 dB : Rue animée</li>
            <li>70-85 dB : Trafic intense</li>
            <li>85+ dB : Niveau potentiellement dangereux</li>
          </ul>
        </Card>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Recommandations</h3>
          <ul className="space-y-2">
            <li>• Évitez l'exposition prolongée aux bruits forts</li>
            <li>• Utilisez une protection auditive si nécessaire</li>
            <li>• Signalez les nuisances sonores persistantes</li>
            <li>• Respectez les horaires de calme</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}