import { API_URLS } from '@/constants/api-constants';
import { apiClient } from '../lib/api-client';
import { RoutineSetting } from './routine';

export interface Caregiver {
  key_0: number;
  key_1: boolean;
  key_2: string;
  key_3: boolean;
}

export interface CareRecipient {
  key_0: string;
  key_1: boolean;
}

export interface Category {
  id: number;
  name: string;
  color: string;
}

export interface Routine {
  id: number;
  title: string;
  category: Category;
  detail: string | null;
}

export interface Schedule {
  id: number;
  status: string;
  start_time: string;
  end_time: string;
  routine: Routine;
  confirmed_at: string;
}

export interface RoutineScheduleResponse {
  date: string;
  caregiver: Caregiver;
  care_recipient: CareRecipient;
  schedules: Schedule[];
}

export interface RoutineScheduleParams {
  type?: string;
  date: string;
  caregiver_id?: number;
  carerecipient_id?: number;
}

export interface RoutinePayload {
  care_recipient_id: number;
  caregiver_id: number;
  category_id: number;
  title: string;
  detail: string;
  is_active: boolean;
}

export const RoutineApi = {
  getRoutineCategories: async () => {
    const response = await apiClient.get(API_URLS.ROUTINE_CATEGORY);
    return response.data;
  },
  createRoutine: async (payload: RoutinePayload) => {
    const response = await apiClient.post(API_URLS.ROUTINE, payload);
    return response.data
  },
  updateRoutine: async (routine_id: string, payload: RoutinePayload) => {
    const response = await apiClient.put(API_URLS.ROUTINE + routine_id, payload);
    return response.data
  },
  getRoutines: async () => {
    const response = await apiClient.get(API_URLS.ROUTINE);
    return response.data;
  },
  getRoutine: async (routine_id: string) => {
    const response = await apiClient.get(API_URLS.ROUTINE + routine_id);
    return response.data;
  },
  createRoutineSetting: async (payload: Routine) => {
    const response = await apiClient.post(API_URLS.ROUTINE_SETTING, payload);
    return response.data
  },
  updateRoutineSetting: async (payload: RoutineSetting) => {
    const response = await apiClient.put(API_URLS.ROUTINE_SETTING, payload);
    return response.data
  },
  getRoutineSettings: async () => {
    const response = await apiClient.get(API_URLS.ROUTINE_SETTING);
    
    return response.data;
  },
  getRoutineScheduleList: async (params?: RoutineScheduleParams): Promise<RoutineScheduleResponse> => {
    const response = await apiClient.get(API_URLS.ROUTINE_SCHEDULE, { params });
    return response.data;
  },
};