
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { Loader2, TrendingUp, Lightbulb } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface IncidentData {
  date: string;
  count: number;
}

const PredictiveIncidentAnalysis = () => {
  const [predictionMonths, setPredictionMonths] = useState<number>(3);
  
  const { data, isLoading, error } = useQuery({
    queryKey: ['incidents-trends-prediction'],
    queryFn: async () => {
      // Fetch historical data first
      const { data, error } = await supabase
        .from('incidents')
        .select('created_at, category_id')
        .order('created_at');
      
      if (error) throw error;
      
      // Group by month
      const monthlyData: Record<string, number> = {};
      const today = new Date();
      
      // Pre-fill last 12 months with zeros to ensure we have data even if no incidents
      for (let i = 11; i >= 0; i--) {
        const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
        monthlyData[monthKey] = 0;
      }
      
      // Count actual incidents by month
      data.forEach(incident => {
        const date = new Date(incident.created_at);
        const monthKey = date.toISOString().slice(0, 7); // YYYY-MM
        monthlyData[monthKey] = (monthlyData[monthKey] || 0) + 1;
      });
      
      // Convert to array format for the chart
      const sortedMonths = Object.keys(monthlyData).sort();
      const chartData = sortedMonths.map(month => ({
        date: month,
        count: monthlyData[month],
        predicted: false
      }));
      
      // Simple prediction algorithm for future months
      // Using moving average and trend analysis
      for (let i = 1; i <= predictionMonths; i++) {
        const nextMonth = new Date(today.getFullYear(), today.getMonth() + i, 1);
        const nextMonthKey = nextMonth.toISOString().slice(0, 7);
        
        // Get last 3 months average for basic prediction
        const lastMonths = chartData.slice(-3);
        const averageCount = lastMonths.reduce((sum, item) => sum + item.count, 0) / lastMonths.length;
        
        // Calculate trend direction and strength
        const trend = lastMonths.length >= 2 
          ? (lastMonths[lastMonths.length - 1].count - lastMonths[0].count) / lastMonths.length 
          : 0;
        
        // Predicted value with trend factor
        const predictedCount = Math.max(0, Math.round(averageCount + trend * i));
        
        chartData.push({
          date: nextMonthKey,
          count: predictedCount,
          predicted: true
        });
      }
      
      return chartData;
    }
  });
  
  // Generate insights from the data
  const generateInsights = () => {
    if (!data || data.length < 6) return null;
    
    const realData = data.filter(d => !d.predicted);
    const predictedData = data.filter(d => d.predicted);
    
    // Calculate overall trend
    const firstHalf = realData.slice(0, Math.floor(realData.length / 2));
    const secondHalf = realData.slice(Math.floor(realData.length / 2));
    
    const firstHalfAvg = firstHalf.reduce((sum, item) => sum + item.count, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, item) => sum + item.count, 0) / secondHalf.length;
    
    const trendPercentage = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
    
    // Predict peak months
    const maxPredictedMonth = predictedData.reduce(
      (max, item) => item.count > max.count ? item : max, 
      { date: '', count: 0, predicted: true }
    );
    
    const insights = [
      {
        title: "Tendance générale",
        description: `${trendPercentage > 0 ? 'Augmentation' : 'Diminution'} de ${Math.abs(trendPercentage).toFixed(1)}% des incidents`,
        type: trendPercentage > 10 ? "warning" : trendPercentage < -10 ? "success" : "info"
      },
      {
        title: "Pic prévu",
        description: `Le pic d'incidents est prévu pour ${formatMonthYear(maxPredictedMonth.date)}`,
        type: "warning"
      }
    ];
    
    return insights;
  };
  
  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
  };
  
  const insights = data ? generateInsights() : null;
  
  if (isLoading) {
    return (
      <Card className="shadow-md">
        <CardContent className="flex justify-center items-center h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </CardContent>
      </Card>
    );
  }
  
  if (error || !data) {
    return (
      <Card className="shadow-md border-red-200">
        <CardContent className="p-6">
          <div className="text-red-500">
            Une erreur est survenue lors du chargement des données prédictives
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-500" />
          Analyse prédictive des incidents
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="actualColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="predictedColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ffc658" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(-2)}`;
                  }}
                />
                <YAxis />
                <Tooltip 
                  formatter={(value, name) => [value, 'Incidents']}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Incidents réels" 
                  stroke="#8884d8" 
                  fillOpacity={1} 
                  fill="url(#actualColor)"
                  data={data.filter(d => !d.predicted)}
                />
                <Area 
                  type="monotone" 
                  dataKey="count" 
                  name="Incidents prévus" 
                  stroke="#ffc658" 
                  fillOpacity={1} 
                  fill="url(#predictedColor)"
                  strokeDasharray="5 5"
                  data={data.filter(d => d.predicted)}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <h3 className="font-medium">Insights basés sur les données</h3>
            </div>
            
            <div className="space-y-3">
              {insights && insights.map((insight, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg flex items-start gap-3">
                  <Badge variant={insight.type as "default" | "secondary" | "destructive" | "outline"}>
                    {insight.type === "warning" ? "Attention" : 
                     insight.type === "success" ? "Positif" : "Info"}
                  </Badge>
                  <div>
                    <h4 className="font-medium text-sm">{insight.title}</h4>
                    <p className="text-sm text-gray-600">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="text-sm text-gray-500 italic">
            * Les prédictions sont basées sur les tendances historiques et sont susceptibles de changer en fonction des données futures.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveIncidentAnalysis;
