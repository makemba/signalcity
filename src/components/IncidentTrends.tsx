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

const mockData = [
  { date: "2024-01", count: 12, resolved: 8 },
  { date: "2024-02", count: 19, resolved: 15 },
  { date: "2024-03", count: 15, resolved: 12 },
  { date: "2024-04", count: 23, resolved: 18 },
  { date: "2024-05", count: 17, resolved: 14 },
  { date: "2024-06", count: 21, resolved: 16 },
];

export default function IncidentTrends() {
  const { toast } = useToast();

  console.log("IncidentTrends component rendered");

  const handleClick = (data: any) => {
    console.log("Chart clicked:", data);
    if (data && data.activePayload) {
      toast({
        title: "Détails du mois",
        description: `${data.activePayload[0].payload.date}: ${data.activePayload[0].payload.count} incidents`,
      });
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Évolution des incidents</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={mockData}
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