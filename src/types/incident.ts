export interface Location {
  lat: number;
  lng: number;
}

export interface Incident {
  id: number;
  categoryId: string;
  location: Location;
  date: string;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";
  resolvedDate?: string;
  priority?: "high" | "medium" | "low";
  description?: string;
}