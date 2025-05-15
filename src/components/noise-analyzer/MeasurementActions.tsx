
import { Button } from "@/components/ui/button";
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
  
  return (
    <div className="flex flex-wrap justify-center gap-2 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={onExportData}
        className="flex items-center gap-1"
      >
        Exporter
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onShare}
        className="flex items-center gap-1"
      >
        Partager
      </Button>
      <Button
        variant="default"
        size="sm"
        onClick={onSaveMeasurement}
      >
        Enregistrer
      </Button>
    </div>
  );
}
