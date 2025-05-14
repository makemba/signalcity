
import { DashboardShell } from "@/components/DashboardShell";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState, useEffect, useCallback } from "react";
import NoiseAnalyzer from "@/components/NoiseAnalyzer";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Volume2, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";

export default function NoiseAnalysis() {
  const [currentNoiseLevel, setCurrentNoiseLevel] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showGuideDialog, setShowGuideDialog] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check for microphone permissions
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
        toast("Microphone accessible");
      } catch (err) {
        console.error("Erreur lors de la vérification des permissions du microphone:", err);
        setHasPermission(false);
        toast("Accès au microphone refusé");
      } finally {
        setIsLoading(false);
      }
    };

    checkMicrophonePermission();
    
    // Show guide dialog on first visit
    const hasSeenGuide = localStorage.getItem('noise-analysis-guide-seen');
    if (!hasSeenGuide) {
      setTimeout(() => {
        setShowGuideDialog(true);
        localStorage.setItem('noise-analysis-guide-seen', 'true');
      }, 1500);
    }
  }, []);

  // Handler for noise level updates
  const handleNoiseLevel = useCallback((level: number) => {
    console.log("Niveau sonore reçu:", level);
    setCurrentNoiseLevel(level);
  }, []);

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
                <div className="space-y-4 mt-4 p-4 bg-white rounded-lg border border-red-100">
                  <h3 className="font-medium">Comment activer le microphone :</h3>
                  <ol className="list-decimal pl-5 space-y-2 text-sm">
                    <li>Cliquez sur l'icône de cadenas ou d'information dans la barre d'adresse de votre navigateur</li>
                    <li>Recherchez les paramètres liés au microphone ou aux permissions du site</li>
                    <li>Activez l'autorisation d'accès au microphone pour ce site</li>
                    <li>Rafraîchissez la page pour appliquer les changements</li>
                  </ol>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="flex items-center"
                  >
                    Réessayer
                    <ArrowRight className="ml-2 h-4 w-4" />
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

          {!isLoading && hasPermission && (
            <>
              <Alert variant="default" className="mb-6 bg-amber-50 border-amber-200">
                <Volume2 className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-amber-800">Conseils pour une mesure optimale</AlertTitle>
                <AlertDescription className="text-amber-700">
                  <ul className="list-disc pl-4 space-y-1 text-sm mt-1">
                    <li>Utilisez de préférence Chrome ou Firefox pour une meilleure compatibilité</li>
                    <li>La calibration automatique s'effectue au démarrage pour une mesure précise</li>
                    <li>L'initialisation peut prendre quelques secondes, veuillez patienter</li>
                    <li>Les rapports d'analyse sont générés automatiquement à la fin de la mesure</li>
                  </ul>
                </AlertDescription>
              </Alert>
              <NoiseAnalyzer onNoiseLevel={handleNoiseLevel} />
            </>
          )}
          
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

        <Dialog open={showGuideDialog} onOpenChange={setShowGuideDialog}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Guide d'utilisation de l'analyse sonore</DialogTitle>
              <DialogDescription>
                Pour obtenir les meilleurs résultats avec notre outil d'analyse sonore
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
              <div className="p-3 bg-blue-50 rounded-md border border-blue-100">
                <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                  <span className="bg-blue-100 p-1 rounded-full">1</span> Permissions
                </h3>
                <p className="text-sm text-blue-700 mt-1">
                  Assurez-vous d'avoir accordé les permissions d'accès au microphone dans votre navigateur
                </p>
              </div>
              
              <div className="p-3 bg-green-50 rounded-md border border-green-100">
                <h3 className="font-semibold text-green-800 flex items-center gap-2">
                  <span className="bg-green-100 p-1 rounded-full">2</span> Calibration
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  La calibration s'effectue automatiquement au démarrage pour des mesures précises
                </p>
              </div>
              
              <div className="p-3 bg-amber-50 rounded-md border border-amber-100">
                <h3 className="font-semibold text-amber-800 flex items-center gap-2">
                  <span className="bg-amber-100 p-1 rounded-full">3</span> Analyse
                </h3>
                <p className="text-sm text-amber-700 mt-1">
                  Un rapport est généré automatiquement à la fin de chaque mesure pour vous aider à interpréter les résultats
                </p>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-md border border-purple-100">
                <h3 className="font-semibold text-purple-800 flex items-center gap-2">
                  <span className="bg-purple-100 p-1 rounded-full">4</span> Navigateur
                </h3>
                <p className="text-sm text-purple-700 mt-1">
                  Utilisez Chrome ou Firefox pour la meilleure compatibilité avec les APIs audio
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowGuideDialog(false)}>Compris</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Testimonials />
        <Partners />
      </div>
    </DashboardShell>
  );
}
