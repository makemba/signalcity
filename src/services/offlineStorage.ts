
import { Incident } from "@/types/incident";

const OFFLINE_INCIDENTS_KEY = 'offline_incidents';
const LAST_SYNC_TIMESTAMP_KEY = 'last_sync_timestamp';

export type IncidentStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

export interface Location {
  lat: number;
  lng: number;
}

export interface OfflineIncident extends Omit<Incident, 'id'> {
  offlineId: string;
  createdAt: string;
  pendingUpload: boolean;
  status: IncidentStatus;
  location: Location;
  categoryId: string;
  date: string;
  retryCount?: number;
  lastRetryTimestamp?: string;
  failReason?: string;
}

// Enregistrer un incident dans le stockage local en mode hors ligne
export const saveOfflineIncident = (incident: Omit<OfflineIncident, 'offlineId'>): OfflineIncident => {
  try {
    const offlineIncidents = getOfflineIncidents();
    
    // Générer un ID unique pour l'incident hors ligne
    const offlineId = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString();
    
    const newOfflineIncident: OfflineIncident = {
      ...incident,
      offlineId,
      pendingUpload: true,
      retryCount: 0
    };
    
    offlineIncidents.push(newOfflineIncident);
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(offlineIncidents));
    
    return newOfflineIncident;
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'incident hors ligne:', error);
    throw new Error('Échec de l\'enregistrement de l\'incident hors ligne');
  }
};

// Récupérer tous les incidents hors ligne
export const getOfflineIncidents = (): OfflineIncident[] => {
  try {
    const storedIncidents = localStorage.getItem(OFFLINE_INCIDENTS_KEY);
    return storedIncidents ? JSON.parse(storedIncidents) : [];
  } catch (error) {
    console.error('Erreur lors de la récupération des incidents hors ligne:', error);
    return [];
  }
};

// Supprimer un incident hors ligne
export const removeOfflineIncident = (offlineId: string): void => {
  try {
    const offlineIncidents = getOfflineIncidents();
    const filteredIncidents = offlineIncidents.filter(incident => incident.offlineId !== offlineId);
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(filteredIncidents));
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'incident hors ligne:', error);
  }
};

// Marquer un incident comme synchronisé
export const markIncidentAsSynced = (offlineId: string): void => {
  try {
    const offlineIncidents = getOfflineIncidents();
    const updatedIncidents = offlineIncidents.map(incident => 
      incident.offlineId === offlineId 
        ? { ...incident, pendingUpload: false } 
        : incident
    );
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(updatedIncidents));
    updateLastSyncTimestamp();
  } catch (error) {
    console.error('Erreur lors du marquage de l\'incident comme synchronisé:', error);
  }
};

// Marquer un incident comme ayant échoué à la synchronisation
export const markIncidentAsFailed = (offlineId: string, reason: string): void => {
  try {
    const offlineIncidents = getOfflineIncidents();
    const updatedIncidents = offlineIncidents.map(incident => {
      if (incident.offlineId === offlineId) {
        const retryCount = (incident.retryCount || 0) + 1;
        return { 
          ...incident, 
          retryCount,
          lastRetryTimestamp: new Date().toISOString(),
          failReason: reason
        };
      }
      return incident;
    });
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(updatedIncidents));
  } catch (error) {
    console.error('Erreur lors du marquage de l\'incident comme échoué:', error);
  }
};

// Vérifier s'il y a des incidents en attente de synchronisation
export const hasPendingIncidents = (): boolean => {
  const offlineIncidents = getOfflineIncidents();
  return offlineIncidents.some(incident => incident.pendingUpload);
};

// Compter les incidents en attente de synchronisation
export const countPendingIncidents = (): number => {
  const offlineIncidents = getOfflineIncidents();
  return offlineIncidents.filter(incident => incident.pendingUpload).length;
};

// Effacer tous les incidents hors ligne
export const clearOfflineIncidents = (): void => {
  try {
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Erreur lors de l\'effacement des incidents hors ligne:', error);
  }
};

// Enregistrer l'horodatage de la dernière synchronisation
export const updateLastSyncTimestamp = (): void => {
  try {
    localStorage.setItem(LAST_SYNC_TIMESTAMP_KEY, new Date().toISOString());
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de l\'horodatage de synchronisation:', error);
  }
};

// Récupérer l'horodatage de la dernière synchronisation
export const getLastSyncTimestamp = (): string | null => {
  try {
    return localStorage.getItem(LAST_SYNC_TIMESTAMP_KEY);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'horodatage de synchronisation:', error);
    return null;
  }
};

// Sauvegarde automatique périodique
export const setupAutoSave = (callback: () => void, intervalMinutes = 5): number => {
  const intervalId = window.setInterval(callback, intervalMinutes * 60 * 1000);
  return intervalId;
};

// Récupérer les incidents qui ont échoué à la synchronisation
export const getFailedIncidents = (): OfflineIncident[] => {
  const incidents = getOfflineIncidents();
  return incidents.filter(incident => incident.retryCount && incident.retryCount > 0 && incident.pendingUpload);
};

// Récupérer les incidents par statut
export const getIncidentsByStatus = (status: IncidentStatus): OfflineIncident[] => {
  const incidents = getOfflineIncidents();
  return incidents.filter(incident => incident.status === status);
};

// Mettre à jour un incident hors ligne
export const updateOfflineIncident = (offlineId: string, updates: Partial<OfflineIncident>): OfflineIncident | null => {
  try {
    const offlineIncidents = getOfflineIncidents();
    let updatedIncident: OfflineIncident | null = null;
    
    const updatedIncidents = offlineIncidents.map(incident => {
      if (incident.offlineId === offlineId) {
        updatedIncident = { ...incident, ...updates };
        return updatedIncident;
      }
      return incident;
    });
    
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(updatedIncidents));
    return updatedIncident;
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'incident hors ligne:', error);
    return null;
  }
};
