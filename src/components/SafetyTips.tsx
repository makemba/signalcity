import { AlertTriangle, Volume2, Shield, HelpCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function SafetyTips() {
  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <Shield className="h-5 w-5 mr-2 text-blue-500" />
        Conseils de sécurité
      </h3>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-left">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
              <span>Exposition aux bruits forts</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="ml-6 space-y-2 text-sm text-gray-600">
              <li>• Évitez l'exposition prolongée aux bruits supérieurs à 85 dB</li>
              <li>• Utilisez des protections auditives dans les environnements bruyants</li>
              <li>• Prenez des pauses régulières dans des zones calmes</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-2">
          <AccordionTrigger className="text-left">
            <div className="flex items-center">
              <Volume2 className="h-4 w-4 mr-2 text-blue-500" />
              <span>Bonnes pratiques</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="ml-6 space-y-2 text-sm text-gray-600">
              <li>• Maintenez une distance de sécurité avec les sources sonores</li>
              <li>• Réglez le volume des appareils audio à un niveau modéré</li>
              <li>• Surveillez régulièrement votre environnement sonore</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="item-3">
          <AccordionTrigger className="text-left">
            <div className="flex items-center">
              <HelpCircle className="h-4 w-4 mr-2 text-green-500" />
              <span>En cas de problème</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ul className="ml-6 space-y-2 text-sm text-gray-600">
              <li>• Contactez immédiatement un professionnel de santé en cas de troubles auditifs</li>
              <li>• Signalez les nuisances sonores aux autorités compétentes</li>
              <li>• Documentez les incidents avec notre application</li>
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}