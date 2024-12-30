import { AlertTriangle, Lightbulb, Trash2, Tool, HelpCircle } from "lucide-react";

export const INCIDENT_CATEGORIES = [
  {
    id: "pothole",
    label: "Nid de poule",
    icon: AlertTriangle,
    color: "text-red-500",
  },
  {
    id: "lighting",
    label: "Éclairage défectueux",
    icon: Lightbulb,
    color: "text-yellow-500",
  },
  {
    id: "garbage",
    label: "Dépôt sauvage",
    icon: Trash2,
    color: "text-orange-500",
  },
  {
    id: "equipment",
    label: "Mobilier urbain endommagé",
    icon: Tool,
    color: "text-blue-500",
  },
  {
    id: "other",
    label: "Autre",
    icon: HelpCircle,
    color: "text-gray-500",
  },
];

export const INCIDENT_STATUS = {
  PENDING: "En attente",
  IN_PROGRESS: "En cours",
  RESOLVED: "Résolu",
  REJECTED: "Rejeté",
};

export type IncidentCategory = typeof INCIDENT_CATEGORIES[number];
export type IncidentStatus = keyof typeof INCIDENT_STATUS;