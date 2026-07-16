import { API_URLS } from '@/constants/api-constants';
import axios from 'axios'

export interface MapboxParams {
  longitude: number;
  latitude: number;
}

const mapBoxBaseUrl = process.env.EXPO_PUBLIC_MAPBOX_BASE_URL
const mapBoxToken = process.env.EXPO_PUBLIC_MAPBOX_TOKEN

export const MapboxApi = {
  getMapData: async ({ longitude, latitude }: MapboxParams) => {
    const response = await axios.get(`${mapBoxBaseUrl}${API_URLS.REVERSE_GEOCODING}`, {
      params: {
        longitude,
        latitude,
        mapBoxToken
      },
    });
    const data = response.data;

    return data;
  },
};

