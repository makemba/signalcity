import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, AlertTriangle, Shield, Heart } from "lucide-react";

export default function EmergencyContact() {
  const emergencyNumbers = [
    { name: "Police Secours", number: "17", icon: Shield },
    { name: "SAMU", number: "15", icon: Heart },
    { name: "Pompiers", number: "18", icon: AlertTriangle },
    { name: "Numéro d'urgence européen", number: "112", icon: Phone },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8">
          <div className="flex items-center">
            <AlertTriangle className="h-6 w-6 text-red-500 mr-4" />
            <div>
              <h2 className="text-lg font-semibold text-red-700">En cas d'urgence immédiate</h2>
              <p className="text-red-600">
                Si vous êtes en danger immédiat, contactez directement les services d'urgence.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {emergencyNumbers.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.number} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{service.name}</h3>
                    <p className="text-2xl font-bold text-primary">{service.number}</p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = `tel:${service.number}`}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8 p-6">
          <h3 className="text-xl font-semibold mb-4">Autres contacts utiles</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Violence conjugale</h4>
              <p>3919 (gratuit et anonyme)</p>
            </div>
            <div>
              <h4 className="font-medium">Protection des enfants en danger</h4>
              <p>119 (gratuit et anonyme)</p>
            </div>
            <div>
              <h4 className="font-medium">Urgences sociales</h4>
              <p>115 (gratuit)</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}