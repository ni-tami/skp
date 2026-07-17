import { API_URLS } from '@/constants/api-constants';
import { apiClient } from '../lib/api-client';

export interface GeofencePayload {
  recipient_id: number;
  home_lat: number;
  home_lng: number;
  home_radius_in_m: number;
}

export interface GeofenceDetailResponse {
  recipient_id: number;
  home_lat: number;
  home_lng: number;
  home_radius_in_m: number;
  last_lat: number;
  last_lng: number;
  last_accuracy: number;
  last_seen_at: string;
  geofence_state: string;
}

export const LocationApi = {
  setGeofence: async (payload: GeofencePayload) => {
    const response = await apiClient.post(API_URLS.GEOFENCE, payload)
    return response.data
  },

  getGeofence: async () => {
    const response = await apiClient.get(API_URLS.GEOFENCE)
    return response.data
  },

  clearGeofence: async () => {
    const response = await apiClient.delete(API_URLS.GEOFENCE)
    return response.data
  },
}
