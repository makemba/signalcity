
import { Card, CardContent } from "@/components/ui/card";
import { Building, ShieldCheck, HeartPulse, Radio, Landmark, MapPin, GraduationCap, Users } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  description: string;
  icon: React.ElementType;
}

const partners: Partner[] = [
  {
    id: 1,
    name: "Ministère de l'Intérieur",
    description: "Coordination de la sécurité publique et de la gestion des incidents au niveau national",
    icon: Landmark
  },
  {
    id: 2,
    name: "Police Nationale Congolaise",
    description: "Intervention rapide et suivi des incidents signalés par les citoyens",
    icon: ShieldCheck
  },
  {
    id: 3,
    name: "Services de Santé d'Urgence",
    description: "Réponse médicale aux incidents et coordination des soins d'urgence",
    icon: HeartPulse
  },
  {
    id: 4,
    name: "Agence Nationale de l'Environnement",
    description: "Surveillance et intervention pour les incidents environnementaux",
    icon: MapPin
  },
  {
    id: 5,
    name: "Congo Télécom",
    description: "Infrastructure de communication et support technique pour la plateforme",
    icon: Radio
  },
  {
    id: 6,
    name: "Mairies des Communes",
    description: "Gestion des incidents au niveau local et coordination avec les services municipaux",
    icon: Building
  },
  {
    id: 7,
    name: "Universités et Centres de Recherche",
    description: "Analyse des données et amélioration continue des systèmes de prévention",
    icon: GraduationCap
  },
  {
    id: 8,
    name: "Organisations Communautaires",
    description: "Sensibilisation et formation des citoyens à l'utilisation de la plateforme",
    icon: Users
  }
];

export default function Partners() {
  return (
    <div className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Nos Partenaires</h2>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Report Helper Hub collabore avec des institutions clés au Congo-Brazzaville pour offrir un service efficace et coordonné
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner) => {
            const Icon = partner.icon;
            return (
              <Card key={partner.id} className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 flex flex-col items-center text-center h-full">
                  <div className="bg-blue-50 p-3 rounded-full mb-4">
                    <Icon className="h-8 w-8 text-blue-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">{partner.name}</h3>
                  <p className="text-gray-600 text-sm">{partner.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  );
}
