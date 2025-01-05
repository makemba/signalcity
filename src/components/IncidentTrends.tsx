import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

const mockData = [
  { date: "2024-01", count: 12 },
  { date: "2024-02", count: 19 },
  { date: "2024-03", count: 15 },
  { date: "2024-04", count: 23 },
  { date: "2024-05", count: 17 },
  { date: "2024-06", count: 21 },
];

export default function IncidentTrends() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Évolution des incidents</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mockData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="count"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}