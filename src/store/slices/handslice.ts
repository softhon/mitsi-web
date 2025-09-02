import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface HandSlice {
  raised: boolean;
  setRaised: (raised: boolean) => void;
}

export const createHandSlice: StateCreator<
  StoreState,
  [],
  [],
  HandSlice
> = set => ({
  raised: false,
  setRaised: state =>
    set(prev => ({
      ...prev,
      hand: { ...prev.hand, raised: state },
    })),
});
