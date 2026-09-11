import apiClient from '../../../lib/axios';
import type { PracticeUser } from '../types/locationTypes';
// locationService.ts
// API client for Location resources used by DPM UI components.
// Uses native fetch so it is framework-agnostic and easy to adapt.

/**
 * Environment base URL resolution:
 * - For Vite: import.meta.env.VITE_API_BASE_URL
 * - For CRA: process.env.REACT_APP_API_BASE_URL
 * If none are set, defaults to empty string (relative requests).
 */
// eslint-disable-next-line react-hooks/rules-of-hooks
/* ─── Service functions ──────────────────────────────────────────────────── */
/**
 * Fetch all locations for the authenticated user.
 * TODO: replace with `apiClient.get<Location[]>('/locations')` when backend is ready.
 */
export const fetchLocations = async (personId: number): Promise<PracticeUser> => {
    
    const { data } = await apiClient.get<PracticeUser>('/api/dpm/getLocations?personId=' + personId);      
    return data;
};

const locationService = {
  fetchLocations
};

export default locationService;