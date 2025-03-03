
export interface Location {
  lat: number;
  lng: number;
}

export interface NoiseMetadata {
  noise_level?: number;
  noise_type?: string;
  duration?: number;
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
  assignedTo?: string;
  lastUpdated?: string;
  comments?: Comment[];
  attachments?: Attachment[];
  tags?: string[];
  severity?: number;
  estimatedResolutionTime?: number;
  metadata?: NoiseMetadata;
  
  // Additional fields needed for mock data
  title?: string;
  category?: string;
  reporter_id?: string;
  created_at?: string;
  assigned_to?: string | null;
  resolution_notes?: string | null;
  updated_at?: string;
}

export interface Comment {
  id: number;
  text: string;
  author: string;
  date: string;
}

export interface Attachment {
  id: number;
  type: "image" | "document" | "video";
  url: string;
  name: string;
  size: number;
}

export interface Feedback {
  incidentId: number;
  rating: number;
  comment?: string;
  date: string;
  userId?: string;
  resolved?: boolean;
}
