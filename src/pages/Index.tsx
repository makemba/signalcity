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
import { AlertTriangle, ArrowRight, Bell, Shield, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
      const { data: { count: total }, error: totalError } = await supabase
        .from("incidents")
        .select("*", { count: 'exact', head: true });

      const { data: { count: pending }, error: pendingError } = await supabase
        .from("incidents")
        .select("*", { count: 'exact', head: true })
        .eq("status", "PENDING");

      if (totalError || pendingError) throw totalError || pendingError;
      
      return {
        total,
        pending
      };
    },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Signalement d'incidents en temps réel
            </h1>
            <p className="text-lg md:text-xl mb-8">
              Une plateforme simple et efficace pour signaler et suivre les incidents dans votre communauté
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
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
                className="bg-transparent border-white text-white hover:bg-white/10"
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

      <main className="container mx-auto py-8 px-4">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total des signalements</p>
              <p className="text-2xl font-bold">{stats?.total || 0}</p>
            </div>
          </Card>
          
          <Card className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">En attente</p>
              <p className="text-2xl font-bold">{stats?.pending || 0}</p>
            </div>
          </Card>
          
          <Card className="p-6 flex items-center space-x-4">
            <div className="p-3 bg-green-100 rounded-full">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Résolutions ce mois</p>
              <p className="text-2xl font-bold">85%</p>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
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

          {/* Right Column */}
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
                  <Button variant="destructive" size="sm">Appeler</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium">SAMU</p>
                    <p className="text-sm text-gray-600">15</p>
                  </div>
                  <Button variant="default" size="sm">Appeler</Button>
                </div>
                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
                  <div>
                    <p className="font-medium">Pompiers</p>
                    <p className="text-sm text-gray-600">18</p>
                  </div>
                  <Button variant="secondary" size="sm">Appeler</Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}