import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { ChartLine } from "lucide-react";

interface NoiseMeasurement {
  created_at: string;
  metadata: {
    noise_level: number;
  };
}

export default function NoiseHistory() {
  const [measurements, setMeasurements] = useState<NoiseMeasurement[]>([]);

  useEffect(() => {
    const fetchMeasurements = async () => {
      const { data, error } = await supabase
        .from("incidents")
        .select("created_at, metadata")
        .eq("category_id", "noise")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
        return;
      }

      setMeasurements(data as NoiseMeasurement[]);
    };

    fetchMeasurements();
  }, []);

  return (
    <Card className="p-6 bg-white shadow-lg">
      <h3 className="text-xl font-semibold mb-4 flex items-center">
        <ChartLine className="h-5 w-5 mr-2 text-blue-500" />
        Historique des mesures
      </h3>
      <div className="space-y-2">
        {measurements.map((measurement, index) => (
          <div
            key={index}
            className="flex justify-between items-center p-2 bg-gray-50 rounded"
          >
            <span className="text-sm text-gray-600">
              {new Date(measurement.created_at).toLocaleString()}
            </span>
            <span className="font-medium">
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
    </Card>
  );
}