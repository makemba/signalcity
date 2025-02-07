import { NOISE_THRESHOLDS } from '@/lib/constants';
import { AlertTriangle, Volume2, Gauge, Shield, Bell } from 'lucide-react';
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface NoiseLevelDisplayProps {
  decibels: number;
}

export default function NoiseLevelDisplay({ decibels }: NoiseLevelDisplayProps) {
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

  const getHealthImpact = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) {
      return "Dangereux pour l'audition";
    }
    if (decibels >= NOISE_THRESHOLDS.HIGH) {
      return "Risque pour l'audition";
    }
    if (decibels >= NOISE_THRESHOLDS.MODERATE) {
      return "Inconfortable";
    }
    return "Sans danger";
  };

  const getDetailedRecommendations = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) {
      return [
        "Quittez immédiatement la zone si possible",
        "Utilisez une protection auditive",
        "Limitez l'exposition à quelques minutes maximum",
        "Signalez la nuisance aux autorités"
      ];
    }
    if (decibels >= NOISE_THRESHOLDS.HIGH) {
      return [
        "Limitez votre temps d'exposition",
        "Utilisez une protection auditive si l'exposition est prolongée",
        "Éloignez-vous de la source sonore",
        "Envisagez de signaler la nuisance"
      ];
    }
    if (decibels >= NOISE_THRESHOLDS.MODERATE) {
      return [
        "Prenez des pauses régulières",
        "Évitez une exposition prolongée",
        "Maintenez une distance raisonnable avec la source"
      ];
    }
    return [
      "Niveau sonore acceptable",
      "Pas de mesure particulière nécessaire",
      "Continuez à surveiller le niveau sonore"
    ];
  };

  const getProgressColor = () => {
    if (decibels >= NOISE_THRESHOLDS.VERY_HIGH) return "bg-red-600";
    if (decibels >= NOISE_THRESHOLDS.HIGH) return "bg-orange-500";
    if (decibels >= NOISE_THRESHOLDS.MODERATE) return "bg-yellow-500";
    return "bg-green-500";
  };

  console.log("Affichage du niveau sonore:", decibels, "dB");

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <Gauge className="h-16 w-16 mb-2 mx-auto text-blue-500" />
          <div className={`text-4xl font-bold ${getNoiseColor()}`}>
            {decibels}
            <span className="text-2xl ml-1">dB</span>
          </div>
          {decibels >= NOISE_THRESHOLDS.HIGH && (
            <AlertTriangle className="absolute -right-8 top-0 h-6 w-6 text-red-500 animate-pulse" />
          )}
        </div>
        
        <div className="space-y-2">
          <p className={`text-lg font-medium ${getNoiseColor()}`}>
            Niveau: {getNoiseLevel()}
          </p>
          <p className={`text-sm ${getNoiseColor()}`}>
            {getHealthImpact()}
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="recommendations">
            <AccordionTrigger className="text-sm font-medium">
              <Shield className="h-4 w-4 mr-2" />
              Recommandations détaillées
            </AccordionTrigger>
            <AccordionContent>
              <ul className="text-left space-y-2 mt-2">
                {getDetailedRecommendations().map((rec, index) => (
                  <li key={index} className="flex items-start">
                    <Bell className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                Intensité
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-blue-600">
                {Math.min(100, Math.round((decibels / 120) * 100))}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
            <div
              className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${Math.min(100, (decibels / 120) * 100)}%` }}
            />
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <Volume2 className="h-4 w-4 inline-block mr-1" />
          Mesure en temps réel
        </div>
      </div>
    </Card>
  );
}