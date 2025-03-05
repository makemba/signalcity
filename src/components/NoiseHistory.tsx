
import { useEffect, useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChartLine, Volume2, AlertTriangle, Calendar, Download, Filter, RefreshCw } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { NOISE_THRESHOLDS } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NoiseMeasurement {
  created_at: string;
  metadata: {
    noise_level: number;
    noise_type?: string;
  };
}

export default function NoiseHistory() {
  const [measurements, setMeasurements] = useState<NoiseMeasurement[]>([]);
  const [view, setView] = useState<'list' | 'chart'>('chart');
  const [timeRange, setTimeRange] = useState<'hour' | 'day' | 'week' | 'all'>('day');
  const [loading, setLoading] = useState<boolean>(true);
  const [chartType, setChartType] = useState<'line' | 'area'>('area');
  const { toast } = useToast();

  const fetchMeasurements = async () => {
    setLoading(true);
    
    let query = supabase
      .from("incidents")
      .select("created_at, metadata")
      .eq("category_id", "noise")
      .order("created_at", { ascending: false });
    
    // Apply time filtering
    if (timeRange !== 'all') {
      const now = new Date();
      let startTime = new Date();
      
      if (timeRange === 'hour') {
        startTime.setHours(now.getHours() - 1);
      } else if (timeRange === 'day') {
        startTime.setDate(now.getDate() - 1);
      } else if (timeRange === 'week') {
        startTime.setDate(now.getDate() - 7);
      }
      
      query = query.gte('created_at', startTime.toISOString());
    }
    
    query = query.limit(100);

    const { data, error } = await query;

    if (error) {
      console.error("Erreur lors de la récupération de l'historique:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger les données historiques",
      });
      setLoading(false);
      return;
    }

    setMeasurements(data as NoiseMeasurement[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchMeasurements();
    
    // Souscription aux mises à jour en temps réel
    const subscription = supabase
      .channel('noise-measurements')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'incidents' },
        (payload) => {
          if (payload.new.category_id === 'noise') {
            setMeasurements(prev => [payload.new as NoiseMeasurement, ...prev].slice(0, 100));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [timeRange]);

  const chartData = useMemo(() => {
    return measurements
      .map(m => ({
        time: new Date(m.created_at).toLocaleTimeString(),
        fullTime: new Date(m.created_at).toLocaleString(),
        niveau: m.metadata.noise_level,
        date: format(new Date(m.created_at), 'yyyy-MM-dd'),
        noiseType: m.metadata.noise_type || 'Non spécifié'
      }))
      .reverse();
  }, [measurements]);

  const getNoiseColor = (level: number) => {
    if (level >= NOISE_THRESHOLDS.VERY_HIGH) return "#ef4444";
    if (level >= NOISE_THRESHOLDS.HIGH) return "#f97316";
    if (level >= NOISE_THRESHOLDS.MODERATE) return "#eab308";
    return "#22c55e";
  };

  const getAverageMeasurement = () => {
    if (measurements.length === 0) return 0;
    const sum = measurements.reduce((acc, curr) => acc + curr.metadata.noise_level, 0);
    return Math.round(sum / measurements.length);
  };

  const getMaxMeasurement = () => {
    if (measurements.length === 0) return 0;
    return Math.max(...measurements.map(m => m.metadata.noise_level));
  };

  const downloadCsv = () => {
    if (measurements.length === 0) return;
    
    const headers = ["Date", "Heure", "Niveau (dB)", "Type"];
    const rows = measurements.map(m => [
      format(new Date(m.created_at), 'yyyy-MM-dd'),
      format(new Date(m.created_at), 'HH:mm:ss'),
      m.metadata.noise_level,
      m.metadata.noise_type || 'Non spécifié'
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mesures-sonores-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Export réussi",
      description: "Les données ont été exportées au format CSV",
    });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="text-sm font-semibold">{data.fullTime}</p>
          <p className="text-sm">
            Niveau: <span className="font-medium" style={{ color: getNoiseColor(data.niveau) }}>
              {data.niveau} dB
            </span>
          </p>
          <p className="text-sm">Type: {data.noiseType}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomizedDot = (props: any) => {
    const { cx, cy, value } = props;
    
    return (
      <circle 
        cx={cx} 
        cy={cy} 
        r={4} 
        fill={getNoiseColor(value)} 
        stroke="white"
        strokeWidth={2}
      />
    );
  };

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-xl font-semibold flex items-center">
            <ChartLine className="h-5 w-5 mr-2 text-blue-500" />
            Historique des mesures
          </h3>
          
          <div className="flex flex-wrap gap-2 items-center">
            <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
              <SelectTrigger className="w-[120px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hour">1 heure</SelectItem>
                <SelectItem value="day">1 jour</SelectItem>
                <SelectItem value="week">1 semaine</SelectItem>
                <SelectItem value="all">Tout</SelectItem>
              </SelectContent>
            </Select>
            
            {view === 'chart' && (
              <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                <SelectTrigger className="w-[120px]">
                  <ChartLine className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Graphique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="line">Ligne</SelectItem>
                  <SelectItem value="area">Zone</SelectItem>
                </SelectContent>
              </Select>
            )}
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={fetchMeasurements}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Rafraîchir les données</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={downloadCsv}
                    disabled={measurements.length === 0}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Exporter en CSV</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
            
            <div className="flex gap-2">
              <button
                onClick={() => setView('chart')}
                className={`p-2 rounded ${
                  view === 'chart' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <ChartLine className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`p-2 rounded ${
                  view === 'list' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                }`}
              >
                <Volume2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="h-[300px] flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
          </div>
        ) : measurements.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center text-gray-500">
            Aucune donnée disponible pour la période sélectionnée
          </div>
        ) : view === 'chart' ? (
          <div>
            <div className="flex justify-between mb-4 flex-wrap gap-2">
              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <div className="text-sm text-gray-500">Moyenne :</div>
                <div className="text-lg font-semibold ml-2">{getAverageMeasurement()} dB</div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <div className="text-sm text-gray-500">Maximum :</div>
                <div className="text-lg font-semibold ml-2" style={{color: getNoiseColor(getMaxMeasurement())}}>
                  {getMaxMeasurement()} dB
                </div>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg flex items-center">
                <div className="text-sm text-gray-500">Mesures :</div>
                <div className="text-lg font-semibold ml-2">{measurements.length}</div>
              </div>
            </div>
            
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === 'line' ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[0, Math.max(120, getMaxMeasurement() + 10)]}
                      tick={{ fontSize: 12 }}
                      label={{ value: 'dB', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine 
                      y={NOISE_THRESHOLDS.HIGH} 
                      stroke="#f97316" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Danger', position: 'right', fill: '#f97316', fontSize: 12 }} 
                    />
                    <Line
                      type="monotone"
                      dataKey="niveau"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={renderCustomizedDot}
                      activeDot={{ r: 6, fill: "#2563eb" }}
                      animationDuration={300}
                    />
                  </LineChart>
                ) : (
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorNiveau" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2563eb" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="time"
                      tick={{ fontSize: 12 }}
                      interval="preserveStartEnd"
                    />
                    <YAxis
                      domain={[0, Math.max(120, getMaxMeasurement() + 10)]}
                      tick={{ fontSize: 12 }}
                      label={{ value: 'dB', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle' } }}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine 
                      y={NOISE_THRESHOLDS.HIGH} 
                      stroke="#f97316" 
                      strokeDasharray="3 3" 
                      label={{ value: 'Danger', position: 'right', fill: '#f97316', fontSize: 12 }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="niveau"
                      stroke="#2563eb"
                      fillOpacity={1}
                      fill="url(#colorNiveau)"
                      activeDot={{ r: 6, fill: "#2563eb" }}
                      animationDuration={300}
                    />
                  </AreaChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {measurements.map((measurement, index) => {
              const noiseLevel = measurement.metadata.noise_level;
              const date = new Date(measurement.created_at);
              
              return (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {date.toLocaleDateString()} à {date.toLocaleTimeString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      Type: {measurement.metadata.noise_type || 'Non spécifié'}
                    </span>
                  </div>
                  <span className={`font-medium flex items-center gap-1 px-3 py-1 rounded-full ${
                    noiseLevel > NOISE_THRESHOLDS.HIGH ? 'bg-red-100 text-red-700' : 
                    noiseLevel > NOISE_THRESHOLDS.MODERATE ? 'bg-orange-100 text-orange-700' : 
                    'bg-green-100 text-green-700'
                  }`}>
                    {noiseLevel > NOISE_THRESHOLDS.HIGH && (
                      <AlertTriangle className="h-4 w-4" />
                    )}
                    {noiseLevel} dB
                  </span>
                </div>
              );
            })}
            {measurements.length === 0 && (
              <p className="text-center text-gray-500 py-8">
                Aucune mesure enregistrée
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
