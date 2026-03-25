import type { PeerData } from '@/types';
import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface WaitersSlice {
  waiters: PeerData[];
  setWaiters: (waiters: PeerData[]) => void;
  addWaiter: (waiter: PeerData) => void;
  removeWaiter: (peerId: string) => void;
  clearWaiters: () => void;
}

export const createWaitersSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', WaitersSlice]],
  WaitersSlice
> = set => ({
  waiters: [],
  setWaiters: waiters =>
    set(state => {
      state.waiters.waiters = waiters;
      return state;
    }),
  addWaiter: waiter =>
    set(state => {
      if (!state.waiters.waiters.find(w => w.id === waiter.id)) {
        state.waiters.waiters.push(waiter);
      }
      return state;
    }),
  removeWaiter: peerId =>
    set(state => {
      const index = state.waiters.waiters.findIndex(w => w.id === peerId);
      if (index >= 0) state.waiters.waiters.splice(index, 1);
      return state;
    }),
  clearWaiters: () =>
    set(state => {
      state.waiters.waiters = [];
      return state;
    }),
});
