
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export const ImportantInfoSection = () => {
  return (
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
  );
};
