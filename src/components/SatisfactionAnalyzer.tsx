import { Card } from "@/components/ui/card";
import { SmileIcon, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface SatisfactionAnalyzerProps {
  feedback: Array<{
    incidentId: number;
    rating: number;
    date: string;
  }>;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e'];

export default function SatisfactionAnalyzer({ feedback }: SatisfactionAnalyzerProps) {
  const ratingDistribution = feedback.reduce((acc: any[], item) => {
    const rating = Math.round(item.rating);
    const existingRating = acc.find(r => r.rating === rating);
    
    if (existingRating) {
      existingRating.count += 1;
    } else {
      acc.push({ rating, count: 1 });
    }
    
    return acc;
  }, []).sort((a, b) => a.rating - b.rating);

  const totalFeedback = feedback.length;
  const averageRating = totalFeedback > 0
    ? feedback.reduce((sum, item) => sum + item.rating, 0) / totalFeedback
    : 0;

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <SmileIcon className="h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-semibold">Analyse de la satisfaction</h3>
      </div>

      {totalFeedback === 0 ? (
        <div className="flex items-center justify-center p-8 text-gray-500">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>Pas de retours à analyser</span>
        </div>
      ) : (
        <>
          <div className="text-center mb-4">
            <p className="text-sm text-gray-500">Note moyenne</p>
            <p className="text-2xl font-bold">{averageRating.toFixed(1)}/5</p>
          </div>
          
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ratingDistribution}
                  dataKey="count"
                  nameKey="rating"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ rating }) => `${rating} étoiles`}
                >
                  {ratingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.rating - 1]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </Card>
  );
}