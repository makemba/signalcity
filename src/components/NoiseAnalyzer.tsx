import { useState } from 'react';
import { AlertTriangle, Volume2, VolumeX, Settings, Download, Share2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useAudioAnalyzer } from '@/hooks/useAudioAnalyzer';
import NoiseLevelDisplay from './NoiseLevelDisplay';
import SafetyTips from './SafetyTips';
import NoiseHistory from './NoiseHistory';
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";

interface NoiseAnalyzerProps {
  onNoiseLevel: (level: number) => void;
}

export default function NoiseAnalyzer({ onNoiseLevel }: NoiseAnalyzerProps) {
  const [decibels, setDecibels] = useState<number>(0);
  const { toast } = useToast();
  const { isRecording, error, startRecording, stopRecording, calibrate } = useAudioAnalyzer((level) => {
    console.log("Niveau sonore reçu:", level);
    setDecibels(level);
    onNoiseLevel(level);
  });

  const handleToggleRecording = () => {
    console.log("Bouton d'enregistrement cliqué, état actuel:", isRecording);
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  const handleExportData = () => {
    // Création d'un objet avec les données à exporter
    const exportData = {
      date: new Date().toISOString(),
      decibels: decibels,
      device: navigator.userAgent,
    };

    // Création du fichier
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    // Téléchargement
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
        // Fallback pour les navigateurs qui ne supportent pas l'API Web Share
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