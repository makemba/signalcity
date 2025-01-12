import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Clock, TrendingUp, TrendingDown } from "lucide-react";
import { Incident } from "@/types/incident";

const ResolutionTimeAnalyzer = ({ incidents }: { incidents: Incident[] }) => {
  const analysis = useMemo(() => {
    const resolvedIncidents = incidents.filter(
      (incident) => incident.status === "RESOLVED" && incident.resolvedDate
    );

    if (resolvedIncidents.length === 0) {
      return {
        averageTime: 0,
        totalResolved: 0,
        fastestResolution: 0,
        trend: "neutral",
        improvement: 0
      };
    }

    const resolutionTimes = resolvedIncidents.map((incident) => {
      const start = new Date(incident.date);
      const end = new Date(incident.resolvedDate!);
      return Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    });

    const averageTime = resolutionTimes.reduce((acc, time) => acc + time, 0) / resolutionTimes.length;
    
    // Calculer la tendance sur les 30 derniers jours
    const recentIncidents = resolvedIncidents
      .filter(incident => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return new Date(incident.resolvedDate!) >= thirtyDaysAgo;
      });

    const recentAverage = recentIncidents.length > 0
      ? recentIncidents.reduce((acc, incident) => {
          const time = Math.floor(
            (new Date(incident.resolvedDate!).getTime() - new Date(incident.date).getTime()) /
            (1000 * 60 * 60 * 24)
          );
          return acc + time;
        }, 0) / recentIncidents.length
      : averageTime;

    const improvement = ((averageTime - recentAverage) / averageTime) * 100;

    return {
      averageTime: Math.round(averageTime),
      totalResolved: resolvedIncidents.length,
      fastestResolution: Math.min(...resolutionTimes),
      trend: improvement > 0 ? "improving" : "declining",
      improvement: Math.abs(Math.round(improvement))
    };
  }, [incidents]);

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="text-blue-500 h-5 w-5" />
        Analyse des résolutions
      </h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">Temps moyen</p>
            <p className="text-xl font-semibold">{analysis.averageTime} jours</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600">Résolutions rapides</p>
            <p className="text-xl font-semibold">{analysis.fastestResolution} jours</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span>Total résolu</span>
          <span className="font-semibold">{analysis.totalResolved}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span>Tendance</span>
          <div className="flex items-center gap-2">
            {analysis.trend === "improving" ? (
              <>
                <TrendingDown className="text-green-500 h-4 w-4" />
                <span className="text-green-600">-{analysis.improvement}%</span>
              </>
            ) : (
              <>
                <TrendingUp className="text-red-500 h-4 w-4" />
                <span className="text-red-600">+{analysis.improvement}%</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ResolutionTimeAnalyzer;