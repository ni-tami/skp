import { API_URLS } from '@/constants/api-constants';
import { apiClient } from '../lib/api-client';

export interface ConnectedUser {
  id: number;
  email: string;
  role: string;
  display_name: string;
  status: string;
}

export interface ConnectResponse {
  id: number;
  caregiver_id: number;
  recipient_id: number;
  caregiver?: ConnectedUser;
  recipient?: ConnectedUser;
  accepted: boolean;
  code: string;
  created_at: string;
}

export interface GenerateCodeResponse {
  code: string;
}

export const ConnectApi = {
  generateCode: async () => {
    const response = await apiClient.post(API_URLS.CONNECT_GENERATE)
    return response.data
  },

  acceptCode: async (code: string) => {
    const response = await apiClient.post(`${API_URLS.CONNECT}/${code}/accept`)
    return response.data
  },

  getConnection: async () => {
    const response = await apiClient.get(API_URLS.CONNECT)
    return response.data
  },

  deleteConnection: async (connectionId: number) => {
    const response = await apiClient.delete(`${API_URLS.CONNECT}/${connectionId}`)
    return response.data
  },
}
