import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export type LayoutMode = 'grid' | 'speaker';

export interface LayoutSlice {
  mode: LayoutMode;
  setMode: (mode: LayoutMode) => void;
  toggleMode: () => void;
}

export const createLayoutSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', LayoutSlice]],
  LayoutSlice
> = set => ({
  mode: 'grid',
  setMode: mode =>
    set(state => {
      state.layout.mode = mode;
      return state;
    }),
  toggleMode: () =>
    set(state => {
      state.layout.mode = state.layout.mode === 'grid' ? 'speaker' : 'grid';
      return state;
    }),
});
