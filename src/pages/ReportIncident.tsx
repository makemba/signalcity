import IncidentForm from "@/components/IncidentForm";
import { AlertTriangle, Clock, MapPin, Shield, Volume2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryFilter from "@/components/CategoryFilter";
import Footer from "@/components/Footer";
import Logo from "@/components/Logo";

export default function ReportIncident() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section avec animation */}
      <div className="relative py-16 bg-gradient-to-r from-blue-900 to-blue-800 animate-fade-in">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-800/90" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4 animate-scale-in">
            Signaler un incident
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Aidez-nous à améliorer votre quartier en signalant rapidement tout problème
          </p>
        </div>
      </div>

      {/* Section des catégories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <Card className="shadow-lg animate-fade-in">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Catégories d'incidents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryFilter />
          </CardContent>
        </Card>
      </div>

      {/* Features Section avec animation */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4 mb-12">
            <Feature
              icon={Clock}
              title="Rapide et simple"
              description="Signalez un incident en quelques clics"
              color="text-green-500"
            />
            <Feature
              icon={MapPin}
              title="Géolocalisation"
              description="Localisation automatique précise"
              color="text-blue-500"
            />
            <Feature
              icon={Shield}
              title="Suivi efficace"
              description="Traitement prioritaire par nos équipes"
              color="text-purple-500"
            />
            <Feature
              icon={Volume2}
              title="Analyse sonore"
              description="Mesure automatique des décibels"
              color="text-red-500"
            />
          </div>
        </div>
      </div>

      {/* Form Section avec animations */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <Card className="shadow-xl animate-fade-in">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Formulaire de signalement
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Instructions */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Comment signaler un incident ?
              </h2>
              <ol className="list-decimal list-inside space-y-2 text-blue-800">
                <li className="animate-fade-in" style={{ animationDelay: "100ms" }}>
                  Activez la géolocalisation ou saisissez l'adresse
                </li>
                <li className="animate-fade-in" style={{ animationDelay: "200ms" }}>
                  Sélectionnez la catégorie qui correspond le mieux
                </li>
                <li className="animate-fade-in" style={{ animationDelay: "300ms" }}>
                  Décrivez le problème rencontré
                </li>
                <li className="animate-fade-in" style={{ animationDelay: "400ms" }}>
                  Ajoutez une photo si possible
                </li>
              </ol>
            </div>

            {/* Alert for important information */}
            <Alert variant="destructive" className="mb-8">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Information importante</AlertTitle>
              <AlertDescription>
                En cas d'urgence, contactez directement les services d'urgence appropriés
                (15, 17, 18, 112).
              </AlertDescription>
            </Alert>

            <IncidentForm />
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}

// Feature component with animation
function Feature({ 
  icon: Icon, 
  title, 
  description,
  color 
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 animate-fade-in">
      <div className={`p-3 bg-gray-50 rounded-full mb-4 ${color}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}