import { UserRole } from "@/constants/user";

export interface User {
  id: number;
  name: string;
  role?: UserRole;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  relation?: string;
  home_location_id?: number;
  home_location?: UserLocation;
  last_location_id?: number;
  last_location?: UserLocation;
  radius?: number;
}

export interface UserLocation {
  id: number;
  user_id: number;
  lat: number;
  long: number;
  display_name: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
}