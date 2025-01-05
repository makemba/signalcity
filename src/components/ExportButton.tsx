import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const ExportButton = () => {
  const handleExport = () => {
    console.log("Exporting data...");
    // Logique d'export à implémenter
  };

  return (
    <Button
      onClick={handleExport}
      variant="outline"
      className="flex items-center gap-2"
    >
      <ArrowDown className="h-4 w-4" />
      Exporter
    </Button>
  );
};

export default ExportButton;