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
}

export interface Location {
  lat: number;
  lng: number;
}
