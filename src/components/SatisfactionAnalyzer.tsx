import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown, TrendingUp, TrendingDown } from "lucide-react";

interface Feedback {
  incidentId: number;
  rating: number;
  comment?: string;
  date: string; // Ajout de la date pour l'analyse des tendances
}

interface Props {
  feedback: Feedback[];
}

const SatisfactionAnalyzer = ({ feedback }: Props) => {
  const analysis = useMemo(() => {
    const totalFeedback = feedback.length;
    if (totalFeedback === 0) return null;

    const averageRating =
      feedback.reduce((acc, item) => acc + item.rating, 0) / totalFeedback;

    const sentimentDistribution = feedback.reduce(
      (acc, item) => {
        if (item.rating >= 4) acc.positive++;
        else if (item.rating <= 2) acc.negative++;
        else acc.neutral++;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    // Analyse des tendances sur les 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentFeedback = feedback.filter(
      item => new Date(item.date) >= thirtyDaysAgo
    );

    const recentAverageRating = recentFeedback.length > 0
      ? recentFeedback.reduce((acc, item) => acc + item.rating, 0) / recentFeedback.length
      : averageRating;

    const trend = recentAverageRating > averageRating ? "up" : "down";
    const trendPercentage = Math.abs(
      ((recentAverageRating - averageRating) / averageRating) * 100
    );

    return {
      averageRating,
      sentimentDistribution,
      totalFeedback,
      trend,
      trendPercentage: Math.round(trendPercentage),
    };
  }, [feedback]);

  if (!analysis) return null;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Analyse de la satisfaction</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <span>Note moyenne</span>
          <span className="font-semibold">{analysis.averageRating.toFixed(1)}/5</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <ThumbsUp className="text-green-500 h-4 w-4" />
            <div>
              <p className="text-sm text-gray-600">Positifs</p>
              <p className="font-semibold">{analysis.sentimentDistribution.positive}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
            <ThumbsDown className="text-red-500 h-4 w-4" />
            <div>
              <p className="text-sm text-gray-600">Négatifs</p>
              <p className="font-semibold">{analysis.sentimentDistribution.negative}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span>Tendance</span>
          <div className="flex items-center gap-2">
            {analysis.trend === "up" ? (
              <>
                <TrendingUp className="text-green-500 h-4 w-4" />
                <span className="text-green-600">+{analysis.trendPercentage}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="text-red-500 h-4 w-4" />
                <span className="text-red-600">-{analysis.trendPercentage}%</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SatisfactionAnalyzer;