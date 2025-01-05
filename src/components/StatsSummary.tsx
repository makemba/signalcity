import { Card } from "@/components/ui/card";
import { ArrowUp, ArrowDown } from "lucide-react";

const StatsSummary = () => {
  const stats = [
    {
      label: "Total des signalements",
      value: 156,
      change: 12,
      increase: true,
    },
    {
      label: "En attente",
      value: 23,
      change: -5,
      increase: false,
    },
    {
      label: "Résolus ce mois",
      value: 45,
      change: 8,
      increase: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
            </div>
            <div className={`flex items-center ${stat.increase ? 'text-green-500' : 'text-red-500'}`}>
              {stat.increase ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
              <span className="ml-1 text-sm">{Math.abs(stat.change)}%</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default StatsSummary;