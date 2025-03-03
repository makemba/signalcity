
import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Feedback } from "@/types/incident";

interface SatisfactionAnalyzerProps {
  feedback: Feedback[];
}

export default function SatisfactionAnalyzer({ feedback }: SatisfactionAnalyzerProps) {
  const summaryData = useMemo(() => {
    const totalFeedback = feedback.length;
    if (totalFeedback === 0) return null;

    const ratingCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let totalRating = 0;

    feedback.forEach(item => {
      const rating = item.rating;
      ratingCounts[rating as keyof typeof ratingCounts]++;
      totalRating += rating;
    });

    const averageRating = totalRating / totalFeedback;
    
    // Calculate percentages
    const ratingPercentages = Object.entries(ratingCounts).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage: Math.round((count / totalFeedback) * 100)
    }));

    // Sentiments calculation
    const positive = ratingCounts[4] + ratingCounts[5];
    const neutral = ratingCounts[3];
    const negative = ratingCounts[1] + ratingCounts[2];
    
    const sentiments = {
      positive: Math.round((positive / totalFeedback) * 100),
      neutral: Math.round((neutral / totalFeedback) * 100),
      negative: Math.round((negative / totalFeedback) * 100)
    };

    return {
      totalFeedback,
      averageRating,
      ratingPercentages,
      sentiments
    };
  }, [feedback]);

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <span key={index} className={`text-lg ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ★
      </span>
    ));
  };

  const getSentimentColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-blue-100 text-blue-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!summaryData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Aucune donnée de satisfaction disponible</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="md:w-1/3">
        <Card className="p-6 h-full flex flex-col justify-center items-center">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">{summaryData.averageRating.toFixed(1)}</h3>
            <div className="flex justify-center mb-4">
              {renderStars(Math.round(summaryData.averageRating))}
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Basé sur {summaryData.totalFeedback} évaluations
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Badge className={getSentimentColor('positive')}>
                {summaryData.sentiments.positive}% Positif
              </Badge>
              <Badge className={getSentimentColor('neutral')}>
                {summaryData.sentiments.neutral}% Neutre
              </Badge>
              <Badge className={getSentimentColor('negative')}>
                {summaryData.sentiments.negative}% Négatif
              </Badge>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="md:w-2/3">
        <Card className="p-6 h-full">
          <h3 className="font-medium mb-4">Répartition des notes</h3>
          <div className="space-y-4">
            {summaryData.ratingPercentages
              .sort((a, b) => b.rating - a.rating)
              .map(({ rating, percentage, count }) => (
                <div key={rating} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <span>{rating}</span>
                      <span className="text-yellow-400">★</span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {count} évaluations ({percentage}%)
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        rating >= 4 ? 'bg-green-500' :
                        rating === 3 ? 'bg-blue-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium mb-2">Commentaires récents</h3>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {feedback.slice(0, 3).map((item, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <div className="flex justify-between">
                    <div className="flex items-center gap-1">
                      {renderStars(item.rating)}
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-1">{item.comment || "Pas de commentaire"}</p>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
