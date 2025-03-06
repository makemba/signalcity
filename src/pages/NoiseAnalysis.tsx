
import { DashboardShell } from "@/components/DashboardShell";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import NoiseAnalyzer from "@/components/NoiseAnalyzer";
import Partners from "@/components/Partners";
import Testimonials from "@/components/Testimonials";

export default function NoiseAnalysis() {
  const [currentNoiseLevel, setCurrentNoiseLevel] = useState<number>(0);

  const handleNoiseLevel = (level: number) => {
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
