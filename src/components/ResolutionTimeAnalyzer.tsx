import { Card } from "@/components/ui/card";
import { Clock, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Incident } from "@/types/incident";

interface ResolutionTimeAnalyzerProps {
  incidents: Incident[];
}

export default function ResolutionTimeAnalyzer({ incidents }: ResolutionTimeAnalyzerProps) {
  const resolvedIncidents = incidents.filter(
    incident => incident.status === "RESOLVED" && incident.resolvedDate
  );

  const averageResolutionTimes = resolvedIncidents.reduce((acc: any[], incident) => {
    const category = incident.categoryId;
    const resolutionTime = new Date(incident.resolvedDate!).getTime() - 
                          new Date(incident.date).getTime();
    const days = Math.round(resolutionTime / (1000 * 60 * 60 * 24));
    
    const existingCategory = acc.find(item => item.category === category);
    if (existingCategory) {
      existingCategory.count += 1;
      existingCategory.totalDays += days;
      existingCategory.averageDays = Math.round(existingCategory.totalDays / existingCategory.count);
    } else {
      acc.push({
        category,
        count: 1,
        totalDays: days,
        averageDays: days
      });
    }
    
    return acc;
  }, []);

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold">Temps de résolution moyen</h3>
      </div>

      {averageResolutionTimes.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Pas d'incidents résolus à analyser</span>
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={averageResolutionTimes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="averageDays" 
                fill="#22c55e" 
                name="Jours moyens"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}