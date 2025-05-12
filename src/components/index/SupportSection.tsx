
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, Mail, MessageSquare } from "lucide-react";

export const SupportSection = () => {
  return (
    <section className="py-12 bg-gray-50 rounded-lg mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Services de Support
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Phone className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Téléphonique</h3>
              <p className="text-gray-600 mb-4">
                Notre équipe est disponible 24/7 pour répondre à vos appels
              </p>
              <Button 
                variant="outline" 
                className="mt-auto"
                asChild
              >
                <Link to="/support">Contacter</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Support Email</h3>
              <p className="text-gray-600 mb-4">
                Envoyez-nous vos questions, nous répondons sous 24h
              </p>
              <Button 
                variant="outline" 
                className="mt-auto"
                asChild
              >
                <Link to="/support">Écrire</Link>
              </Button>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Chat en Direct</h3>
              <p className="text-gray-600 mb-4">
                Discutez en temps réel avec nos agents
              </p>
              <Button 
                variant="outline" 
                className="mt-auto"
                asChild
              >
                <Link to="/support">Démarrer</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};
