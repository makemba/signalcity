import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ThumbsUp, ThumbsDown } from "lucide-react";

interface Feedback {
  incidentId: number;
  rating: number;
  comment?: string;
}

interface Props {
  feedback: Feedback[];
}

const SatisfactionAnalyzer = ({ feedback }: Props) => {
  const analysis = useMemo(() => {
    // Algorithme d'analyse des retours utilisateurs
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

    return {
      averageRating,
      sentimentDistribution,
      totalFeedback,
    };
  }, [feedback]);

  if (!analysis) return null;

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Analyse de la satisfaction</h3>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span>Note moyenne</span>
          <span>{analysis.averageRating.toFixed(1)}/5</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <ThumbsUp className="text-green-500 h-4 w-4" />
            <span>{analysis.sentimentDistribution.positive}</span>
          </div>
          <div className="flex items-center gap-2">
            <ThumbsDown className="text-red-500 h-4 w-4" />
            <span>{analysis.sentimentDistribution.negative}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SatisfactionAnalyzer;