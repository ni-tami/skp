import { API_URLS } from '@/constants/api-constants';
import { apiClient } from '../lib/api-client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  role: string;
  display_name: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: 'bearer';
  user: {
    id: number;
    email: string;
    role: string;
    display_name: string;
    status: string;
  };
}

export const AuthApi = {
  login: async (payload: LoginPayload) => {
    const response = await apiClient.post(API_URLS.LOGIN, payload)
    return response.data
  },

  signUp: async (payload: SignUpPayload) => {
    const response = await apiClient.post(API_URLS.SIGN_UP, payload)
    return response.data
  },
}
