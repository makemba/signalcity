
import { Button } from "@/components/ui/button";
import { Bell, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
      <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm"></div>
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
            Signalement d'incidents en temps réel
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            Une plateforme intelligente pour signaler, suivre et résoudre les incidents au Congo-Brazzaville. 
            Ensemble, contribuons à un environnement plus sûr et plus agréable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 animate-fade-in"
              asChild
            >
              <Link to="/report-incident">
                <Bell className="mr-2 h-5 w-5" />
                Signaler un incident
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10 animate-fade-in"
              asChild
            >
              <Link to="/noise-analysis">
                <Volume2 className="mr-2 h-5 w-5" />
                Analyse sonore
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
