
import { DashboardShell } from "@/components/DashboardShell";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect } from "react";
import NoiseAnalyzer from "@/components/NoiseAnalyzer";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

export default function NoiseAnalysis() {
  const [currentNoiseLevel, setCurrentNoiseLevel] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkMicrophonePermission = async () => {
      setIsLoading(true);
      try {
        // Check if browser supports audio API
        if (typeof navigator.mediaDevices === 'undefined' || 
            typeof navigator.mediaDevices.getUserMedia === 'undefined') {
          console.error("L'API audio n'est pas supportée par ce navigateur");
          setHasPermission(false);
          return;
        }

        // Request permissions to verify they are available
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
        toast({
          title: "Microphone accessible",
          description: "Vous pouvez maintenant mesurer le niveau sonore",
        });
      } catch (err) {
        console.error("Erreur lors de la vérification des permissions du microphone:", err);
        setHasPermission(false);
        toast({
          variant: "destructive",
          title: "Accès au microphone refusé",
          description: "Veuillez autoriser l'accès au microphone pour utiliser l'analyse sonore",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkMicrophonePermission();
  }, [toast]);

  const handleNoiseLevel = (level: number) => {
    console.log("Niveau sonore reçu:", level);
    setCurrentNoiseLevel(level);
  };

  return (
    <DashboardShell>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Analyse des Nuisances Sonores</h1>
          <p className="text-gray-600 mb-6">
            Mesurez et analysez les niveaux sonores en temps réel pour documenter les nuisances
          </p>
          
          <Card className="mb-8 p-6 bg-blue-50 border-blue-100">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="rounded-full bg-blue-500 text-white p-2 flex items-center justify-center h-10 w-10">
                {currentNoiseLevel > 0 ? (
                  <span className="font-bold">{currentNoiseLevel}</span>
                ) : (
                  <span className="font-bold">0</span>
                )}
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-blue-900">Analyse Sonore pour le Congo-Brazzaville</h2>
                <p className="text-blue-700 text-sm">
                  Notre technologie est spécialement calibrée pour les environnements urbains congolais, 
                  permettant une mesure précise des nuisances sonores dans les quartiers résidentiels et les zones d'activité.
                </p>
              </div>
            </div>
          </Card>

          {isLoading && (
            <Card className="mb-8 p-6 bg-gray-50 border-gray-100">
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3">Vérification de l'accès au microphone...</span>
              </div>
            </Card>
          )}

          {!isLoading && hasPermission === false && (
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Accès au microphone requis</AlertTitle>
              <AlertDescription className="space-y-4">
                <p>
                  Pour pouvoir analyser les nuisances sonores, vous devez autoriser l'accès à votre microphone.
                  Veuillez vérifier les paramètres de votre navigateur et réessayer.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Réessayer
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => navigate("/report-incident")}
                  >
                    Signaler autrement
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && hasPermission && <NoiseAnalyzer onNoiseLevel={handleNoiseLevel} />}
          
          <Separator className="my-12" />
          
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold">Impact au Congo-Brazzaville</h2>
            <p>
              Le contrôle des nuisances sonores représente un défi majeur dans les zones urbaines congolaises, où la densité de population 
              et les activités économiques peuvent générer des niveaux de bruit élevés. Notre outil offre:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Documentation objective des nuisances pour faciliter les démarches administratives</li>
              <li>Données précises pour les autorités locales et les services d'urbanisme</li>
              <li>Sensibilisation sur l'impact sanitaire des nuisances sonores prolongées</li>
              <li>Base factuelle pour l'établissement de règlementations sur le bruit urbain</li>
            </ul>
          </div>
        </div>

        <Testimonials />
        <Partners />
      </div>
    </DashboardShell>
  );
}
