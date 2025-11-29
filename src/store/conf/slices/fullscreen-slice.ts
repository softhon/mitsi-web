import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import { FullscreenType } from '@/types';

export interface FullscreenSlice {
  active: FullscreenType;
  set: (active: FullscreenType) => void;
}

export const createFullscreenSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', FullscreenSlice]],
  FullscreenSlice
> = set => ({
  active: FullscreenType.Hide,
  set: active =>
    set(state => {
      state.fullscreen.active = active;
      return state;
    }),
});
