
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChartLine, Volume2, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

interface NoiseMeasurement {
  created_at: string;
  metadata: {
    noise_level: number;
  };
}

export default function NoiseHistory() {
  const [measurements, setMeasurements] = useState<NoiseMeasurement[]>([]);
  const [view, setView] = useState<'list' | 'chart'>('chart');

  useEffect(() => {
    const fetchMeasurements = async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("created_at, metadata")
        .eq("category_id", "noise")
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
        return;
      }

      setMeasurements(data as NoiseMeasurement[]);
    };

    fetchMeasurements();
    
    // Souscription aux mises à jour en temps réel
    const subscription = supabase
      .channel('noise-measurements')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'incidents' },
        (payload) => {
          if (payload.new.category_id === 'noise') {
            setMeasurements(prev => [payload.new as NoiseMeasurement, ...prev].slice(0, 50));
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const chartData = measurements.map(m => ({
    time: new Date(m.created_at).toLocaleTimeString(),
    niveau: m.metadata.noise_level
  })).reverse();

  return (
    <Card className="p-6 bg-white shadow-lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold flex items-center">
            <ChartLine className="h-5 w-5 mr-2 text-blue-500" />
            Historique des mesures
          </h3>
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

        {view === 'chart' ? (
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[0, 120]}
                  tick={{ fontSize: 12 }}
                  label={{ value: 'dB', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="niveau"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {measurements.map((measurement, index) => (
              <div
                key={index}
                className="flex justify-between items-center p-2 bg-gray-50 rounded"
              >
                <span className="text-sm text-gray-600">
                  {new Date(measurement.created_at).toLocaleString()}
                </span>
                <span className={`font-medium flex items-center gap-1 ${
                  measurement.metadata.noise_level > 85 ? 'text-red-500' : 'text-blue-500'
                }`}>
                  {measurement.metadata.noise_level > 85 && (
                    <AlertTriangle className="h-4 w-4" />
                  )}
                  {measurement.metadata.noise_level} dB
                </span>
              </div>
            ))}
            {measurements.length === 0 && (
              <p className="text-center text-gray-500">
                Aucune mesure enregistrée
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
