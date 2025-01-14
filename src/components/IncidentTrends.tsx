import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export default function IncidentTrends() {
  const { toast } = useToast();

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents-trends'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('created_at, status')
        .order('created_at');
      
      if (error) {
        console.error('Error fetching incidents:', error);
        throw error;
      }
      
      return data;
    }
  });

  const processData = () => {
    if (!incidents) return [];
    
    const monthlyData = incidents.reduce((acc: any[], incident) => {
      const date = new Date(incident.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: '2-digit' });
      const existingEntry = acc.find(entry => entry.date === date);
      
      if (existingEntry) {
        existingEntry.count += 1;
        if (incident.status === 'RESOLVED') {
          existingEntry.resolved += 1;
        }
      } else {
        acc.push({
          date,
          count: 1,
          resolved: incident.status === 'RESOLVED' ? 1 : 0
        });
      }
      
      return acc;
    }, []);

    return monthlyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const chartData = processData();

  console.log("IncidentTrends component rendered with data:", chartData);

  const handleClick = (data: any) => {
    console.log("Chart clicked:", data);
    if (data && data.activePayload) {
      toast({
        title: "Détails du mois",
        description: `${data.activePayload[0].payload.date}: ${data.activePayload[0].payload.count} incidents`,
      });
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chargement des données...</h3>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Évolution des incidents</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            onClick={handleClick}
            className="cursor-pointer"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="count"
              name="Incidents"
              stroke="#8884d8"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="resolved"
              name="Résolus"
              stroke="#82ca9d"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}