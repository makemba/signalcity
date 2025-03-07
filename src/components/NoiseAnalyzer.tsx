import { useState, useEffect } from 'react';
import { AlertTriangle, Volume2, VolumeX, Settings, Download, Share2, Camera, HelpCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import NoiseLevelDisplay from './NoiseLevelDisplay';
import SafetyTips from './SafetyTips';
import NoiseHistory from './NoiseHistory';
import AudioRecorder from './AudioRecorder';
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [decibels, setDecibels] = useState<number>(0);
  const [isCompatible, setIsCompatible] = useState<boolean>(true);
  const { toast } = useToast();
  const { isRecording, error, startRecording, stopRecording, calibrate } = useAudioAnalyzer((level) => {
    console.log("Niveau sonore reçu:", level, "dB");
    if (level > 0) {
      setDecibels(level);
      onNoiseLevel(level);
    }
  });

  useEffect(() => {
    checkDeviceCompatibility();
  }, []);

  const checkDeviceCompatibility = async () => {
    try {
      const result = await navigator.mediaDevices.getUserMedia({ audio: true });
      result.getTracks().forEach(track => track.stop());
      setIsCompatible(true);
      console.log("Appareil compatible avec l'analyse sonore");
    } catch (err) {
      console.error("Erreur de compatibilité:", err);
      setIsCompatible(false);
      toast({
        variant: "destructive",
        title: "Appareil non compatible",
        description: "L'analyse sonore n'est pas disponible sur cet appareil.",
      });
    }
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      stopRecording();
      toast({
        description: "Mesure du niveau sonore arrêtée",
      });
    } else {
      startRecording();
      toast({
        description: "Démarrage de la mesure du niveau sonore...",
      });
    }
  };

  const handleExportData = () => {
    const exportData = {
      date: new Date().toISOString(),
      decibels: decibels,
      device: navigator.userAgent,
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `mesure-sonore-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Export réussi",
      description: "Les données ont été exportées avec succès",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Mesure de niveau sonore',
          text: `Niveau sonore mesuré: ${decibels} dB`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(`Niveau sonore mesuré: ${decibels} dB - ${window.location.href}`);
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papier",
        });
      }
    } catch (err) {
      console.error('Erreur lors du partage:', err);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de partager les données",
      });
    }
  };

  if (!isCompatible) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Appareil non compatible</AlertTitle>
          <AlertDescription>
            L'analyse sonore n'est pas disponible sur cet appareil. 
            Voici quelques solutions alternatives :
          </AlertDescription>
        </Alert>

        <Card className="p-6 bg-white shadow-lg space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="text-center p-4 border rounded-lg">
              <Camera className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold mb-2">Utiliser la vidéo</h3>
              <p className="text-sm text-gray-600 mb-4">
                Vous pouvez filmer la source du bruit pour documenter la nuisance
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/video-analysis'}>
                Passer à l'analyse vidéo
              </Button>
            </div>

            <div className="text-center p-4 border rounded-lg">
              <HelpCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold mb-2">Besoin d'aide ?</h3>
              <p className="text-sm text-gray-600 mb-4">
                Consultez notre guide de dépannage ou contactez le support
              </p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Guide de dépannage</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Guide de dépannage</DialogTitle>
                    <DialogDescription>
                      <ul className="list-disc pl-4 space-y-2 mt-4">
                        <li>Vérifiez que votre navigateur est à jour</li>
                        <li>Autorisez l'accès au microphone dans les paramètres</li>
                        <li>Essayez avec un autre navigateur (Chrome recommandé)</li>
                        <li>Redémarrez votre appareil</li>
                        <li>Vérifiez que votre microphone fonctionne dans d'autres applications</li>
                      </ul>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </Card>

        <SafetyTips />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erreur</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card className="p-6 bg-white shadow-lg space-y-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleToggleRecording}
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      className="min-w-[200px]"
                    >
                      {isRecording ? (
                        <>
                          <VolumeX className="mr-2 h-5 w-5" />
                          Arrêter la mesure
                        </>
                      ) : (
                        <>
                          <Volume2 className="mr-2 h-5 w-5" />
                          Mesurer le niveau sonore
                        </>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isRecording ? "Arrêter la mesure sonore" : "Commencer une nouvelle mesure"}
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={calibrate}
                      variant="outline"
                      size="lg"
                      className="min-w-[50px]"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Calibrer le microphone dans un environnement calme
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleExportData}
                      variant="outline"
                      size="lg"
                      className="min-w-[50px]"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Exporter les données de mesure
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="lg"
                      className="min-w-[50px]"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    Partager cette mesure
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {isRecording && (
              <div className="w-full animate-fade-in">
                <NoiseLevelDisplay decibels={decibels} />
              </div>
            )}

            <AudioRecorder />

            <div className="text-sm text-muted-foreground text-center">
              <p>Pour des mesures plus précises, calibrez le microphone dans un environnement calme.</p>
              <p className="mt-2">Les niveaux sont enregistrés automatiquement pour le suivi des nuisances sonores.</p>
            </div>
          </Card>
          
          <SafetyTips />
        </div>

        <div className="space-y-6">
          <NoiseHistory />
        </div>
      </div>
    </div>
  );
}
