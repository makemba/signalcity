import { useEffect } from "react";
import { INCIDENT_CATEGORIES, NOISE_TYPES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Image } from "lucide-react";

interface NoiseMetadata {
  noise_level?: number;
  noise_type?: string;
}

interface IncidentWithAttachments {
  id: number;
  category_id: string;
  description: string | null;
  location_lat: number;
  location_lng: number;
  status: string;
  created_at: string;
  metadata: NoiseMetadata | null;
  incident_attachments: {
    id: number;
    file_path: string;
    file_type: string;
  }[] | null;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "IN_PROGRESS":
      return "bg-blue-100 text-blue-800";
    case "RESOLVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const formatLocation = (lat: number, lng: number) => {
  return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function IncidentList() {
  const { data: incidents, isLoading } = useQuery({
    queryKey: ["incidents"],
    queryFn: async () => {
      const { data: incidents, error: incidentsError } = await supabase
        .from("incidents")
        .select(`
          *,
          incident_attachments (
            id,
            file_path,
            file_type
          )
        `)
        .order("created_at", { ascending: false });

      if (incidentsError) throw incidentsError;
      return incidents as IncidentWithAttachments[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("public:incidents")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "incidents",
        },
        (payload) => {
          console.log("Changement détecté:", payload);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Signalements récents</h2>
      <div className="space-y-4">
        {incidents?.map((incident) => {
          const category = INCIDENT_CATEGORIES.find(
            (cat) => cat.id === incident.category_id
          );
          const noiseType = incident.category_id === "noise" && incident.metadata?.noise_type
            ? NOISE_TYPES[incident.metadata.noise_type as keyof typeof NOISE_TYPES]
            : null;

          return (
            <div
              key={incident.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {category && (
                    <category.icon className={`h-5 w-5 ${category.color} mt-1`} />
                  )}
                  <div>
                    <h3 className="font-medium">{category?.label}</h3>
                    {noiseType && (
                      <p className="text-sm text-gray-600 mt-1">
                        Type de bruit : {noiseType}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      {formatLocation(incident.location_lat, incident.location_lng)}
                    </p>
                    {incident.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {incident.description}
                      </p>
                    )}
                    {incident.incident_attachments && incident.incident_attachments.length > 0 && (
                      <div className="flex items-center gap-2 mt-2">
                        <Image className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {incident.incident_attachments.length} pièce(s) jointe(s)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <span className="text-sm text-gray-600 block">
                    {formatDate(incident.created_at)}
                  </span>
                  <Badge
                    variant="secondary"
                    className={getStatusColor(incident.status)}
                  >
                    {incident.status}
                  </Badge>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}