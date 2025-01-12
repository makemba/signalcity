import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown, AlertCircle, Clock, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

const StatsSummary = () => {
  const { toast } = useToast();

  useEffect(() => {
    console.log("StatsSummary component mounted");
  }, []);

  const stats = [
    {
      label: "Total des signalements",
      value: 156,
      change: 12,
      increase: true,
      icon: AlertCircle,
      color: "text-blue-500",
    },
    {
      label: "En attente",
      value: 23,
      change: -5,
      increase: false,
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Résolus ce mois",
      value: 45,
      change: 8,
      increase: true,
      icon: CheckCircle,
      color: "text-green-500",
    },
  ];

  const handleCardClick = (label: string) => {
    console.log(`Card clicked: ${label}`);
    toast({
      title: "Statistique sélectionnée",
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
          </Card>
        );
      })}
    </div>
  );
};

export default StatsSummary;