
import { create } from 'zustand';

interface Incident {
  id: string;
  title: string;
  description?: string;
  category: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  location?: {
    latitude: number;
    longitude: number;
  };
  created_at: string;
  updated_at?: string;
  reporter_id?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

interface IncidentFilters {
  category?: string;
  status?: string;
  priority?: string;
  dateRange?: {
    from: Date | null;
    to: Date | null;
  };
  searchTerm?: string;
}

interface IncidentState {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
  filters: IncidentFilters;
  selectedIncidentId: string | null;
  
  // Actions
  setIncidents: (incidents: Incident[]) => void;
  addIncident: (incident: Incident) => void;
  updateIncident: (id: string, incident: Partial<Incident>) => void;
  deleteIncident: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (filters: Partial<IncidentFilters>) => void;
  resetFilters: () => void;
  selectIncident: (id: string | null) => void;
}

export const useIncidentStore = create<IncidentState>((set) => ({
  incidents: [],
  loading: false,
  error: null,
  filters: {},
  selectedIncidentId: null,
  
  setIncidents: (incidents) => set({ incidents }),
  addIncident: (incident) => set((state) => ({ 
    incidents: [...state.incidents, incident] 
  })),
  updateIncident: (id, updatedIncident) => set((state) => ({
    incidents: state.incidents.map((incident) => 
      incident.id === id ? { ...incident, ...updatedIncident } : incident
    ),
  })),
  deleteIncident: (id) => set((state) => ({
    incidents: state.incidents.filter((incident) => incident.id !== id),
  })),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setFilters: (newFilters) => set((state) => ({ 
    filters: { ...state.filters, ...newFilters } 
  })),
  resetFilters: () => set({ filters: {} }),
  selectIncident: (id) => set({ selectedIncidentId: id }),
}));
