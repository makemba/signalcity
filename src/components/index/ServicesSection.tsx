
import { Card } from "@/components/ui/card";
import { MapPin, Volume2, FileText, Headphones } from "lucide-react";

export const ServicesSection = () => {
  return (
    <div className="mb-12">
      <h2 className="text-2xl font-semibold mb-6 text-center">Nos services principaux</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center hover:shadow-lg transition-all">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold mb-2">Géolocalisation</h3>
          <p className="text-sm text-gray-600">Localisez précisément les incidents pour une intervention rapide</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all">
          <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <Volume2 className="h-6 w-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold mb-2">Analyse sonore</h3>
          <p className="text-sm text-gray-600">Mesurez et analysez les nuisances sonores en temps réel</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <FileText className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold mb-2">Suivi détaillé</h3>
          <p className="text-sm text-gray-600">Suivez l'évolution de vos signalements étape par étape</p>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-all">
          <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
            <Headphones className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold mb-2">Support 24/7</h3>
          <p className="text-sm text-gray-600">Une équipe disponible pour vous accompagner à tout moment</p>
        </Card>
      </div>
    </div>
  );
};
