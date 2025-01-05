export interface Location {
  lat: number;
  lng: number;
}

export interface Incident {
  id: number;
  categoryId: string;
  location: Location;
  date: string;
  status: string;
  resolvedDate?: string;
}