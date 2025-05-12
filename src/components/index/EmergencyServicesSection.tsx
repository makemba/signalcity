
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Phone, ArrowRight } from "lucide-react";

export const EmergencyServicesSection = () => {
  return (
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
            <p className="text-sm text-gray-600">117</p>
          </div>
          <Button variant="destructive" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
          <div>
            <p className="font-medium">SAMU</p>
            <p className="text-sm text-gray-600">118</p>
          </div>
          <Button variant="default" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </Button>
        </div>
        <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
          <div>
            <p className="font-medium">Pompiers</p>
            <p className="text-sm text-gray-600">118</p>
          </div>
          <Button variant="secondary" size="sm">
            <Phone className="h-4 w-4 mr-2" />
            Appeler
          </Button>
        </div>
      </div>
    </Card>
  );
};
