import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatsSummary from "@/components/StatsSummary";
import IncidentTrends from "@/components/IncidentTrends";
import { Users, FileText, MapPin } from "lucide-react";

const ManagerDashboard = () => {
  console.log("Manager Dashboard rendered");

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord gestionnaire</h1>
        <Badge variant="outline" className="text-sm">
          Maire / Conseiller
        </Badge>
      </div>

      <StatsSummary />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <Users className="h-6 w-6 text-blue-500" />
            <div>
              <h3 className="font-semibold">Équipes actives</h3>
              <p className="text-2xl font-bold">8</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <FileText className="h-6 w-6 text-green-500" />
            <div>
              <h3 className="font-semibold">Rapports en attente</h3>
              <p className="text-2xl font-bold">12</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <MapPin className="h-6 w-6 text-orange-500" />
            <div>
              <h3 className="font-semibold">Zones prioritaires</h3>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Tendances des incidents</h2>
          <IncidentTrends />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Rapports récents</h2>
          <div className="space-y-4">
            {/* Recent reports content */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;