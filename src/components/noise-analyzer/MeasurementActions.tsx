
import { Button } from "@/components/ui/button";
import { Share2, Save, Download } from "lucide-react";
import { toast } from "sonner";

interface MeasurementActionsProps {
  decibels: number;
  measurementDuration: number;
  onSaveMeasurement: () => Promise<void>;
  onExportData: () => void;
  onShare: () => Promise<void>;
}

export default function MeasurementActions({
  decibels,
  measurementDuration,
  onSaveMeasurement,
  onExportData,
  onShare
}: MeasurementActionsProps) {
  if (decibels <= 0 || measurementDuration < 3) {
    return null;
  }
  
  const handleAction = async (action: () => Promise<void>, successMessage: string) => {
    try {
      await action();
      toast.success(successMessage);
    } catch (error) {
      toast.error("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onExportData}
        className="flex items-center gap-1"
      >
        <Download className="h-4 w-4" />
        Exporter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleAction(onShare, "Mesure partagée avec succès")}
        className="flex items-center gap-1"
      >
        <Share2 className="h-4 w-4" />
        Partager
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={() => handleAction(onSaveMeasurement, "Mesure enregistrée avec succès")}
        className="flex items-center gap-1"
      >
        <Save className="h-4 w-4" />
        Enregistrer
      </Button>
    </div>
  );
}
