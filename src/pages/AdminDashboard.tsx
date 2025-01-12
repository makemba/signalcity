import { Card } from "@/components/ui/card";
import StatsSummary from "@/components/StatsSummary";
import CategoryFilter from "@/components/CategoryFilter";
import StatusBadges from "@/components/StatusBadges";
import { useToast } from "@/hooks/use-toast";
import { PanelLeftOpen } from "lucide-react";

const AdminDashboard = () => {
  const { toast } = useToast();
  console.log("Admin Dashboard rendered");

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Tableau de bord administrateur</h1>
        <PanelLeftOpen className="h-6 w-6 text-gray-500" />
      </div>

      <StatsSummary />
      <CategoryFilter />
      <StatusBadges />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Actions rapides</h2>
          <div className="space-y-4">
            {/* Quick actions content */}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-4">
            {/* Notifications content */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;