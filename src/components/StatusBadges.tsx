import { Badge } from "@/components/ui/badge";

const StatusBadges = () => {
  const statuses = [
    { label: "En attente", count: 23, color: "bg-yellow-100 text-yellow-800" },
    { label: "En cours", count: 15, color: "bg-blue-100 text-blue-800" },
    { label: "Résolu", count: 45, color: "bg-green-100 text-green-800" },
    { label: "Rejeté", count: 8, color: "bg-red-100 text-red-800" },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {statuses.map((status, index) => (
        <Badge
          key={index}
          variant="secondary"
          className={`${status.color} text-xs py-1 px-3`}
        >
          {status.label} ({status.count})
        </Badge>
      ))}
    </div>
  );
};

export default StatusBadges;