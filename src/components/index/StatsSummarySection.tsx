
import { Card } from "@/components/ui/card";
import { Bell, AlertTriangle, Shield } from "lucide-react";

interface StatsSummaryProps {
  stats: {
    total: number;
    pending: number;
  } | undefined;
}

export const StatsSummarySection = ({ stats }: StatsSummaryProps) => {
  return (
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
  );
};
