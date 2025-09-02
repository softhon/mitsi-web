import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface ScreenSlice {
  sharing: boolean;
  change: boolean;
  stop: boolean;
  setSharing: (state: boolean) => void;
  setChange: (state: boolean) => void;
  setStop: (state: boolean) => void;
}

export const createScreenSlice: StateCreator<
  StoreState,
  [],
  [],
  ScreenSlice
> = set => ({
  sharing: false,
  change: false,
  stop: false,
  videoTrack: null,
  audioTrack: null,
  setSharing: state =>
    set(prev => ({
      ...prev,
      screen: { ...prev.screen, sharing: state },
    })),
  setChange: state =>
    set(prev => ({
      ...prev,
      screen: { ...prev.screen, change: state },
    })),
  setStop: state =>
    set(prev => ({
      ...prev,
      screen: { ...prev.screen, stop: state },
    })),
});
