import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Incident } from "@/types/incident";

interface TrendAnalysisProps {
  incidents: Incident[];
}

export default function TrendAnalysis({ incidents }: TrendAnalysisProps) {
  const data = incidents.reduce((acc: any[], incident) => {
    const date = new Date(incident.date).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold">Analyse des tendances</h3>
      </div>

      {data.length === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Pas assez de données pour l'analyse</span>
        </div>
      ) : (
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#2563eb" 
                name="Nombre d'incidents"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}