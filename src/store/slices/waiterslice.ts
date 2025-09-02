/* eslint-disable @typescript-eslint/no-unused-vars */
import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';
import type { Waiter } from '@/types';

export interface WaiterSlice {
  records: Record<string, Waiter>;
  add: (waiter: Waiter) => void;
  update: (id: string, data: Partial<Waiter>) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const createWaiterSlice: StateCreator<
  StoreState,
  [],
  [],
  WaiterSlice
> = set => ({
  records: {},
  add: waiter =>
    set(state => ({
      ...state,
      waiters: {
        ...state.waiters,
        records: {
          ...state.waiters.records,
          [waiter.id]: waiter,
        },
      },
    })),
  update: (id, data) =>
    set(state => {
      if (!state.waiters.records[id]) {
        return state; // No profile to update
      }
      return {
        ...state,
        waiters: {
          ...state.waiters,
          records: {
            ...state.waiters.records,
            [id]: {
              ...state.waiters.records[id],
              ...data,
            },
          },
        },
      };
    }),
  remove: id =>
    set(state => {
      const { [id]: _, ...restWaiters } = state.waiters.records;
      return {
        ...state,
        waiters: {
          ...state.waiters,
          records: restWaiters,
        },
      };
    }),
  clear: () =>
    set(state => ({
      ...state,
      waiters: {
        ...state.waiters,
        records: {},
      },
    })),
});
