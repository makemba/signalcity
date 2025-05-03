
import { Card } from "@/components/ui/card";
import { TrendingUp, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Incident } from "@/types/incident";

interface TrendAnalysisProps {
  incidents: Incident[];
}

export default function TrendAnalysis({ incidents }: TrendAnalysisProps) {
  const data = incidents.reduce((acc: any[], incident) => {
    const date = new Date(incident.createdAt).toLocaleDateString();
    const existingEntry = acc.find(entry => entry.date === date);
    
    if (existingEntry) {
      existingEntry.count += 1;
    } else {
      acc.push({ date, count: 1 });
    }
    
    return acc;
  }, []).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <Card className="p-4 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-100 rounded-full">
          <TrendingUp className="h-5 w-5 text-blue-500" />
        </div>
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
              <Tooltip contentStyle={{
                backgroundColor: 'white',
                borderRadius: '6px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                border: '1px solid #e2e8f0'
              }} />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="#2563eb" 
                strokeWidth={2}
                name="Nombre d'incidents"
                dot={{ stroke: '#2563eb', strokeWidth: 2, fill: 'white', r: 4 }}
                activeDot={{ stroke: '#2563eb', strokeWidth: 2, fill: '#2563eb', r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
