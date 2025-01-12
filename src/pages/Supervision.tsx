import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

const Supervision = () => {
  console.log("Supervision page rendered");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supervision des opérations</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Incidents actifs</h3>
              <p className="text-3xl font-bold mt-2">24</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">En cours de traitement</h3>
              <p className="text-3xl font-bold mt-2">12</p>
            </div>
            <Clock className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Résolus aujourd'hui</h3>
              <p className="text-3xl font-bold mt-2">8</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Équipes sur le terrain</h2>
          <div className="space-y-4">
            {/* Teams content */}
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Interventions en cours</h2>
          <div className="space-y-4">
            {/* Interventions content */}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Supervision;