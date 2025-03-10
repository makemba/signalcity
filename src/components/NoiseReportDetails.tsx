
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { NOISE_THRESHOLDS } from "@/lib/constants";

interface NoiseReportDetailsProps {
  measurements: Array<{
    id: string;
    created_at: string;
    noise_level: number;
    duration: number;
    type: string;
    location_name?: string;
    notes?: string;
  }>;
}

export function NoiseReportDetails({ measurements }: NoiseReportDetailsProps) {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('day');

  // Calculer les statistiques
  const stats = {
    average: Math.round(measurements.reduce((acc, m) => acc + m.noise_level, 0) / measurements.length),
    max: Math.max(...measurements.map(m => m.noise_level)),
    min: Math.min(...measurements.map(m => m.noise_level)),
    totalDuration: measurements.reduce((acc, m) => acc + m.duration, 0),
    overThreshold: measurements.filter(m => m.noise_level > NOISE_THRESHOLDS.HIGH).length
  };

  // Préparer les données pour le graphique
  const chartData = measurements.map(m => ({
    time: format(new Date(m.created_at), 'HH:mm', { locale: fr }),
    niveau: m.noise_level,
    seuil: NOISE_THRESHOLDS.HIGH
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Rapport détaillé des mesures sonores</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Moyenne</h3>
            <p className="mt-1 text-2xl font-semibold">{stats.average} dB</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Maximum</h3>
            <p className="mt-1 text-2xl font-semibold text-red-600">{stats.max} dB</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500">Dépassements seuil</h3>
            <p className="mt-1 text-2xl font-semibold text-amber-600">{stats.overThreshold}</p>
          </div>
        </div>

        <div className="h-[300px] w-full mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="niveau" 
                fill="#3b82f6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-6">
          <h3 className="font-medium mb-3">Détails des mesures</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {measurements.map((measurement) => (
              <div 
                key={measurement.id}
                className="p-3 bg-gray-50 rounded-lg flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium">
                    {format(new Date(measurement.created_at), 'dd MMMM yyyy HH:mm', { locale: fr })}
                  </p>
                  {measurement.location_name && (
                    <p className="text-sm text-gray-500">Lieu : {measurement.location_name}</p>
                  )}
                  {measurement.notes && (
                    <p className="text-sm text-gray-500">Notes : {measurement.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className={`text-lg font-semibold ${
                    measurement.noise_level > NOISE_THRESHOLDS.HIGH 
                      ? 'text-red-600' 
                      : measurement.noise_level > NOISE_THRESHOLDS.MODERATE 
                        ? 'text-amber-600' 
                        : 'text-green-600'
                  }`}>
                    {measurement.noise_level} dB
                  </p>
                  <p className="text-sm text-gray-500">
                    Durée : {measurement.duration}s
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
