
export interface Incident {
  id: string;
  title: string;
  description: string;
  category: string;
  location: Location;
  noiseType?: string;
  photo?: File | null;
  video?: File | null;
  status: string;
  createdAt: string;
  date: string;
  categoryId: string;
  resolvedDate?: string;
  priority?: "high" | "medium" | "low";
  assignedTo?: string;
  severity?: string;
  estimatedResolutionTime?: string;
  lastUpdated?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Feedback {
  incidentId: string;
  rating: number;
  comment?: string;
  date: string;
  userId: string;
  resolved?: boolean;
}
