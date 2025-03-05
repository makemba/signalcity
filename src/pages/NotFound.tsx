
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, MapPin, Bell, Volume2, HelpCircle, Phone } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const popularPages = [
    { name: "Signaler un incident", path: "/report-incident", icon: Bell },
    { name: "Analyse sonore", path: "/noise-analysis", icon: Volume2 },
    { name: "Contact d'urgence", path: "/emergency-contact", icon: Phone },
    { name: "Statistiques", path: "/statistics", icon: MapPin },
    { name: "Support", path: "/support", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center max-w-md w-full">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">
          La page que vous recherchez n'existe pas.
        </p>
        
        <Card className="p-6 mb-8 bg-white shadow-md">
          <h2 className="text-lg font-medium mb-4">Vous cherchez peut-être...</h2>
          <div className="space-y-2">
            {popularPages.map((page) => (
              <Button
                key={page.path}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => navigate(page.path)}
              >
                <page.icon className="mr-2 h-4 w-4" />
                {page.name}
              </Button>
            ))}
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            onClick={() => navigate("/")}
            className="inline-flex items-center"
          >
            <Home className="mr-2 h-4 w-4" />
            Retour à l'accueil
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Page précédente
          </Button>
        </div>
      </div>
    </div>
  );
}
