import { create } from 'zustand';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface TargetLocation extends Coordinates {
  name?: string;
}

interface LocationState {
  currentPosition: Coordinates | null;
  targetLocation: TargetLocation | null;
  distance: number | null;
  setCurrentPosition: (position: Coordinates) => void;
  setTargetLocation: (location: TargetLocation) => void;
  setDistance: (distance: number) => void;
  clearTargetLocation: () => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentPosition: null,
  targetLocation: null,
  distance: 0,
  setCurrentPosition: (position) => set({ currentPosition: position }),
  setTargetLocation: (location) => set({ targetLocation: location }),
  setDistance: (distance) => set({ distance: distance }),
  clearTargetLocation: () => set({ targetLocation: null }),
  clearDistance: () => set({ distance: null }),
}));
