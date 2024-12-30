import { INCIDENT_CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";

const mockIncidents = [
  {
    id: 1,
    categoryId: "pothole",
    location: "Rue des Lilas",
    date: "2024-02-20",
    status: "PENDING",
  },
  {
    id: 2,
    categoryId: "lighting",
    location: "Avenue des Roses",
    date: "2024-02-19",
    status: "IN_PROGRESS",
  },
  {
    id: 3,
    categoryId: "garbage",
    location: "Boulevard des Champs",
    date: "2024-02-18",
    status: "RESOLVED",
  },
];

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

export default function IncidentList() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Signalements récents</h2>
      <div className="space-y-4">
        {mockIncidents.map((incident) => {
          const category = INCIDENT_CATEGORIES.find(
            (cat) => cat.id === incident.categoryId
          );
          
          return (
            <div
              key={incident.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {category && (
                    <category.icon className={`h-5 w-5 ${category.color}`} />
                  )}
                  <div>
                    <h3 className="font-medium">{category?.label}</h3>
                    <p className="text-sm text-gray-600">{incident.location}</p>
                  </div>
                </div>
                <div className="text-right space-y-2">
                  <span className="text-sm text-gray-600 block">
                    {incident.date}
                  </span>
                  <Badge
                    variant="secondary"
                    className={`${getStatusColor(incident.status)}`}
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