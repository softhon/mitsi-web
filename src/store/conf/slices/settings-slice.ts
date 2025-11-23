import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface SettingsSlice {
  open: boolean;
  toggle: () => void;
}

export const createSettingsSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', SettingsSlice]],
  SettingsSlice
> = set => ({
  open: false,
  toggle: () =>
    set(state => {
      state.settings.open = !state.settings.open;
      return state;
    }),
});
