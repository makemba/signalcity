
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

export default function NoiseAnalysis() {
  const [currentNoiseLevel, setCurrentNoiseLevel] = useState<number>(0);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if browser supports audio API
    if (typeof navigator.mediaDevices === 'undefined' || 
        typeof navigator.mediaDevices.getUserMedia === 'undefined') {
      setHasPermission(false);
      return;
    }

    // Request permissions to verify they are available
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        stream.getTracks().forEach(track => track.stop());
        setHasPermission(true);
      })
      .catch(err => {
        console.error("Error checking microphone permissions:", err);
        setHasPermission(false);
      });
  }, []);

  const handleNoiseLevel = (level: number) => {
    console.log("Received noise level:", level);
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

          {hasPermission === false && (
            <Card className="mb-8 p-6 bg-red-50 border-red-100">
              <div className="flex flex-col md:flex-row items-start gap-4">
                <div className="rounded-full bg-red-500 text-white p-2 flex items-center justify-center h-10 w-10">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-red-900">Accès au microphone requis</h2>
                  <p className="text-red-700 text-sm mb-4">
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
                </div>
              </div>
            </Card>
          )}

          <NoiseAnalyzer onNoiseLevel={handleNoiseLevel} />
          
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
