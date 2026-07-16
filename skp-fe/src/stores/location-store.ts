import { create } from 'zustand';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TargetLocation extends Coordinates {
  name?: string;
}

export const MIN_SAFE_ZONE_RADIUS = 10;
export const MAX_SAFE_ZONE_RADIUS = 200;
export const DEFAULT_SAFE_ZONE_RADIUS = 50;

interface LocationState {
  currentPosition: Coordinates | null;
  targetLocation: TargetLocation | null;
  distance: number | null;
  radius: number;
  setCurrentPosition: (position: Coordinates) => void;
  setTargetLocation: (location: TargetLocation) => void;
  setDistance: (distance: number) => void;
  setRadius: (radius: number) => void;
  clearTargetLocation: () => void;
  clearDistance: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentPosition: null,
  targetLocation: null,
  distance: 0,
  radius: DEFAULT_SAFE_ZONE_RADIUS,
  setCurrentPosition: (position) => set({ currentPosition: position }),
  setTargetLocation: (location) => set({ targetLocation: location }),
  setDistance: (distance) => set({ distance: distance }),
  setRadius: (radius) => set({ radius }),
  clearTargetLocation: () => set({ targetLocation: null }),
  clearDistance: () => set({ distance: null }),
}));
