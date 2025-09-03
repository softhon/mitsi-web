import type { StateCreator } from 'zustand';
import 'zustand/middleware/immer';
import type { ConfStoreState } from '../type';

export interface CounterSlice {
  count: number;
  add: () => void;
}

export const createCounterSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', CounterSlice]],
  CounterSlice
> = set => ({
  count: 0,
  add: () =>
    set(state => {
      state.counter.count += 1;
      return state;
    }),
});
