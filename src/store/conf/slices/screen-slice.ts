import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface ScreenSlice {
  on: boolean;
  toggle: (state: boolean) => void;
}

export const createScreenSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', ScreenSlice]],
  ScreenSlice
> = set => ({
  on: false,
  toggle: () =>
    set(state => {
      state.screen.on = !state.screen.on;
      return state;
    }),
});
