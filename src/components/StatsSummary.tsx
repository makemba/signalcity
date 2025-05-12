
import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StatsSummary = () => {
  const { data: incidentStats, isLoading } = useQuery({
    queryKey: ['incident-stats'],
    queryFn: async () => {
      // Obtenir le total des signalements
      const { count: total, error: totalError } = await supabase
        .from('incidents')
        .select('*', { count: 'exact' });

      if (totalError) throw totalError;

      // Obtenir le nombre d'incidents en attente
      const { count: pending, error: pendingError } = await supabase
        .from('incidents')
        .select('*', { count: 'exact' })
        .eq('status', 'PENDING');

      if (pendingError) throw pendingError;

      // Obtenir le nombre d'incidents résolus ce mois
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: resolved, error: resolvedError } = await supabase
        .from('incidents')
        .select('*', { count: 'exact' })
        .eq('status', 'RESOLVED')
        .gte('resolved_at', startOfMonth.toISOString());

      if (resolvedError) throw resolvedError;

      return {
        total: total || 0,
        pending: pending || 0,
        resolved: resolved || 0
      };
    },
    meta: {
      onError: () => {
        toast("Erreur", {
          description: "Erreur lors du chargement des statistiques"
        });
      }
    }
  });

  const stats = [
    {
      label: "Total des signalements",
      value: isLoading ? "..." : incidentStats?.total || 0,
      change: 12,
      increase: true,
      icon: AlertCircle,
      color: "text-blue-500",
    },
    {
      label: "En attente",
      value: isLoading ? "..." : incidentStats?.pending || 0,
      change: -5,
      increase: false,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Résolus ce mois",
      value: isLoading ? "..." : incidentStats?.resolved || 0,
      change: 8,
      increase: true,
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  const handleCardClick = (label: string) => {
    console.log(`Card clicked: ${label}`);
    toast("Statistique sélectionnée", {
      description: `Détails pour: ${label}`,
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card 
            key={index} 
            className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(stat.label)}
          >
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <Icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                </div>
              </div>
              <div className={`flex items-center ${stat.increase ? 'text-green-500' : 'text-red-500'}`}>
                {stat.increase ? 
                  <ArrowUp className="h-4 w-4" /> : 
                  <ArrowDown className="h-4 w-4" />
                }
                <span className="ml-1 text-sm">{Math.abs(stat.change)}%</span>
              </div>
            </div>
            {isLoading && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default StatsSummary;
