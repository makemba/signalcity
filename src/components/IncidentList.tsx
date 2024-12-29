import { AlertTriangle } from "lucide-react";

const mockIncidents = [
  {
    id: 1,
    category: "Nid de poule",
    location: "Rue des Lilas",
    date: "2024-02-20",
    status: "En attente",
  },
  {
    id: 2,
    category: "Éclairage défectueux",
    location: "Avenue des Roses",
    date: "2024-02-19",
    status: "En cours",
  },
];

export default function IncidentList() {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Signalements récents</h2>
      <div className="space-y-4">
        {mockIncidents.map((incident) => (
          <div
            key={incident.id}
            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-secondary" />
                <div>
                  <h3 className="font-medium">{incident.category}</h3>
                  <p className="text-sm text-gray-600">{incident.location}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600">{incident.date}</span>
                <p className="text-sm font-medium text-primary">{incident.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}