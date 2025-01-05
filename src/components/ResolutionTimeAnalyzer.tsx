import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Incident } from "@/types/incident";

const ResolutionTimeAnalyzer = ({ incidents }: { incidents: Incident[] }) => {
  const analysis = useMemo(() => {
    // Algorithme pour calculer les temps moyens de résolution
    const resolvedIncidents = incidents.filter(
      (incident) => incident.status === "RESOLVED" && incident.resolvedDate
    );

    const resolutionTimes = resolvedIncidents.map((incident) => {
      const start = new Date(incident.date);
      const end = new Date(incident.resolvedDate!);
      return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    });

    const averageTime =
      resolutionTimes.length > 0
        ? resolutionTimes.reduce((acc, time) => acc + time, 0) / resolutionTimes.length
        : 0;

    return {
      averageTime: Math.round(averageTime),
      totalResolved: resolvedIncidents.length,
      fastestResolution: resolutionTimes.length > 0 ? Math.min(...resolutionTimes) : 0,
    };
  }, [incidents]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Analyse des résolutions</h3>
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Clock className="text-blue-500 h-4 w-4" />
          <span>Temps moyen: {analysis.averageTime} jours</span>
        </div>
        <div>Résolutions rapides: {analysis.fastestResolution} jours</div>
        <div>Total résolu: {analysis.totalResolved}</div>
      </div>
    </Card>
  );
};

export default ResolutionTimeAnalyzer;