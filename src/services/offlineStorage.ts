
import { Incident } from "@/types/incident";

const OFFLINE_INCIDENTS_KEY = 'offline_incidents';

export type IncidentStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED" | "REJECTED";

export interface OfflineIncident extends Omit<Incident, 'id'> {
  offlineId: string;
  createdAt: string;
  pendingUpload: boolean;
  status: IncidentStatus;
}

// Save incident to local storage when offline
export const saveOfflineIncident = (incident: Omit<OfflineIncident, 'offlineId'>): OfflineIncident => {
  try {
    const offlineIncidents = getOfflineIncidents();
    const offlineId = crypto.randomUUID();
    
    const newOfflineIncident: OfflineIncident = {
      ...incident,
      offlineId,
      pendingUpload: true
    };
    
    offlineIncidents.push(newOfflineIncident);
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(offlineIncidents));
    
    return newOfflineIncident;
  } catch (error) {
    console.error('Error saving offline incident:', error);
    throw new Error('Failed to save offline incident');
  }
};

// Get all offline incidents
export const getOfflineIncidents = (): OfflineIncident[] => {
  try {
    const storedIncidents = localStorage.getItem(OFFLINE_INCIDENTS_KEY);
    return storedIncidents ? JSON.parse(storedIncidents) : [];
  } catch (error) {
    console.error('Error getting offline incidents:', error);
    return [];
  }
};

// Remove an offline incident
export const removeOfflineIncident = (offlineId: string): void => {
  try {
    const offlineIncidents = getOfflineIncidents();
    const filteredIncidents = offlineIncidents.filter(incident => incident.offlineId !== offlineId);
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(filteredIncidents));
  } catch (error) {
    console.error('Error removing offline incident:', error);
  }
};

// Mark incident as synced
export const markIncidentAsSynced = (offlineId: string): void => {
  try {
    const offlineIncidents = getOfflineIncidents();
    const updatedIncidents = offlineIncidents.map(incident => 
      incident.offlineId === offlineId 
        ? { ...incident, pendingUpload: false } 
        : incident
    );
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify(updatedIncidents));
  } catch (error) {
    console.error('Error marking incident as synced:', error);
  }
};

// Check if there are any pending incidents to upload
export const hasPendingIncidents = (): boolean => {
  const offlineIncidents = getOfflineIncidents();
  return offlineIncidents.some(incident => incident.pendingUpload);
};

// Count pending incidents
export const countPendingIncidents = (): number => {
  const offlineIncidents = getOfflineIncidents();
  return offlineIncidents.filter(incident => incident.pendingUpload).length;
};

// Clear all offline incidents 
export const clearOfflineIncidents = (): void => {
  try {
    localStorage.setItem(OFFLINE_INCIDENTS_KEY, JSON.stringify([]));
  } catch (error) {
    console.error('Error clearing offline incidents:', error);
  }
};
