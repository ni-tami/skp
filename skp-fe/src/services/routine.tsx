import { DayOfWeek, RepeatType } from "@/constants/routine";
import { User } from "./user";

export interface RoutineCategory {
  id: number;
  name: string;
  icon: string;
  variant: string;
  created_at?: string;
  updated_at?: string;
}

export interface Routine {
  id: number;
  caregiver?: User;
  carerecipient?: User;
  title: string;
  detail?: string;
  category: RoutineCategory;
  notifications_enabled?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface RoutineSchedule {
  id: number;
  routine: Routine;
  start_time: string;
  end_time: string;
  interval: number;
  repeat_type: RepeatType;
  day_of_week: DayOfWeek[];
  created_at: string;
  updated_at: string;
}

export interface RoutineCompletion {
  id: number;
  schedule: RoutineSchedule;
  status: string;
  completed_at: string;
  created_at: string;
  updated_at: string;
}