import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface HandSlice {
  raised: boolean;
  toggle: () => void;
}

export const createHandSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', HandSlice]],
  HandSlice
> = set => ({
  raised: false,
  toggle: () =>
    set(state => {
      state.hand.raised = !state.hand.raised;
      return state;
    }),
});
