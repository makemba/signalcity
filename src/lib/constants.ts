import { AlertTriangle, Lightbulb, Trash2, HelpCircle, Volume2, Shield, Heart, Users } from "lucide-react";

export const INCIDENT_CATEGORIES = [
  {
    id: "noise",
    label: "Nuisances sonores",
    icon: Volume2,
    color: "text-purple-500",
    description: "Mesure automatique des décibels et analyse des nuisances sonores"
  },
  {
    id: "violence",
    label: "Violence/Agression",
    icon: Shield,
    color: "text-red-600",
    description: "Signalement urgent de violence physique ou verbale"
  },
  {
    id: "domestic_violence",
    label: "Violence conjugale",
    icon: Heart,
    color: "text-pink-600",
    description: "Signalement confidentiel de violence conjugale"
  },
  {
    id: "gender_violence",
    label: "Violence basée sur le genre",
    icon: Users,
    color: "text-indigo-600",
    description: "Signalement de discrimination ou violence basée sur le genre"
  },
  {
    id: "public_disorder",
    label: "Trouble à l'ordre public",
    icon: AlertTriangle,
    color: "text-orange-500",
    description: "Perturbation de la tranquillité publique"
  },
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

// Seuils de décibels pour les nuisances sonores
export const NOISE_THRESHOLDS = {
  ACCEPTABLE: 70, // En décibels
  MODERATE: 80,
  HIGH: 90,
  VERY_HIGH: 100
};

// Types de nuisances sonores
export const NOISE_TYPES = {
  MUSIC: "Musique",
  TRAFFIC: "Circulation",
  CONSTRUCTION: "Travaux",
  PEOPLE: "Personnes",
  OTHER: "Autre"
};