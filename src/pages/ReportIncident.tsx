import IncidentForm from "@/components/IncidentForm";
import { AlertTriangle, Clock, MapPin, Shield } from "lucide-react";

export default function ReportIncident() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-r from-blue-900 to-blue-800">
        <div className="absolute inset-0 overflow-hidden">
          <img
            src="/photo-1605810230434-7631ac76ec81"
            alt="Background"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Signaler un incident
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Aidez-nous à améliorer votre quartier en signalant rapidement tout problème
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3 mb-12">
            <Feature
              icon={Clock}
              title="Rapide et simple"
              description="Signalez un incident en quelques clics, sans inscription requise"
            />
            <Feature
              icon={MapPin}
              title="Géolocalisation"
              description="Localisation automatique ou manuelle des incidents"
            />
            <Feature
              icon={Shield}
              title="Suivi efficace"
              description="Chaque signalement est traité et suivi par nos équipes"
            />
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          {/* Instructions */}
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              Comment signaler un incident ?
            </h2>
            <ol className="list-decimal list-inside space-y-2 text-blue-800">
              <li>Activez la géolocalisation ou saisissez l'adresse</li>
              <li>Sélectionnez la catégorie qui correspond le mieux</li>
              <li>Décrivez le problème rencontré</li>
              <li>Ajoutez une photo si possible</li>
            </ol>
          </div>

          {/* Alert for important information */}
          <div className="mb-8 flex p-4 border-l-4 border-amber-500 bg-amber-50">
            <AlertTriangle className="h-6 w-6 text-amber-500 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-amber-800">
                Information importante
              </h3>
              <p className="mt-1 text-sm text-amber-700">
                En cas d'urgence, contactez directement les services d'urgence appropriés
                (15, 17, 18, 112).
              </p>
            </div>
          </div>

          <IncidentForm />
        </div>
      </div>
    </div>
  );
}

// Feature component for the features section
function Feature({ icon: Icon, title, description }: { 
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl transition-transform hover:scale-105">
      <div className="p-3 bg-blue-100 rounded-full mb-4">
        <Icon className="h-6 w-6 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}