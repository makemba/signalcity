import Header from "@/components/Header";
import IncidentForm from "@/components/IncidentForm";
import IncidentList from "@/components/IncidentList";
import IncidentMap from "@/components/IncidentMap";
import StatsSummary from "@/components/StatsSummary";
import CategoryFilter from "@/components/CategoryFilter";
import StatusBadges from "@/components/StatusBadges";
import SearchBar from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { 
  AlertTriangle, 
  ArrowRight, 
  Bell, 
  Shield, 
  Volume2, 
  Phone,
  Headphones,
  AlertCircle,
  FileText,
  MapPin 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Phone, Mail, MessageSquare } from "lucide-react";

export default function Index() {
  const { toast } = useToast();

  const { data: recentIncidents } = useQuery({
    queryKey: ["recent-incidents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["incident-stats"],
    queryFn: async () => {
      const { count: total, error: totalError } = await supabase
        .from("incidents")
        .select("*", { count: 'exact' });

      if (totalError) throw totalError;

      const { count: pending, error: pendingError } = await supabase
        .from("incidents")
        .select("*", { count: 'exact' })
        .eq("status", "PENDING");

      if (pendingError) throw pendingError;
      
      return {
        total: total || 0,
        pending: pending || 0
      };
    },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      
      {/* Section Hero améliorée */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-800 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-blue-900/20 backdrop-blur-sm"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Signalement d'incidents en temps réel
            </h1>
            <p className="text-lg md:text-xl mb-8 text-blue-100">
              Une plateforme intelligente pour signaler, suivre et résoudre les incidents dans votre communauté. 
              Ensemble, contribuons à un environnement plus sûr et plus agréable.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100 animate-fade-in"
                asChild
              >
                <Link to="/signaler">
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
                <Link to="/analyse-sonore">
                  <Volume2 className="mr-2 h-5 w-5" />
                  Analyse sonore
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Bell className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total des signalements</p>
                <p className="text-2xl font-bold">{stats?.total || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold">{stats?.pending || 0}</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Résolutions ce mois</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Fonctionnalités principales */}
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

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Colonne gauche */}
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Carte des signalements</h2>
              </div>
              <Card className="p-4">
                <IncidentMap />
              </Card>
            </div>
            
            <div className="space-y-6">
              <SearchBar />
              <CategoryFilter />
              <StatusBadges />
              <IncidentList />
            </div>
          </div>

          {/* Colonne droite */}
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Nouveau signalement</h3>
              <IncidentForm onSubmit={() => {
                toast({
                  title: "Signalement envoyé",
                  description: "Votre signalement a été enregistré avec succès",
                });
              }} />
            </Card>

            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Services d'urgence</h3>
                <Button variant="outline" asChild>
                  <Link to="/urgence">
                    Voir plus
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <p className="font-medium">Police</p>
                    <p className="text-sm text-gray-600">17</p>
                  </div>
                  <Button variant="destructive" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">SAMU</p>
                    <p className="text-sm text-gray-600">15</p>
                  </div>
                  <Button variant="default" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">Pompiers</p>
                    <p className="text-sm text-gray-600">18</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                </div>
              </div>
            </Card>

            {/* Carte d'information */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500 rounded-full">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Information importante</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    En cas d'urgence immédiate, contactez directement les services d'urgence. 
                    Cette plateforme est destinée au signalement et au suivi des incidents non urgents.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/urgence">En savoir plus</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Add new Support Services section */}
        <section className="py-12 bg-gray-50">
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
      </main>
    </div>
  );
}
