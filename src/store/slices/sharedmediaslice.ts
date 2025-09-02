import type { SharedMedia, SharedMediaType } from '@/types';
import type { StoreState } from '../types';
import type { StateCreator } from 'zustand';

export interface SharedMediaSlice {
  peerId: string | null;
  url: string | null;
  type: SharedMediaType | null;
  paused?: boolean;
  time?: number;
  set: (media: SharedMedia) => void;
  update: (data: Partial<SharedMedia>) => void;
  clear: () => void;
}

export const createSharedMediaSlice: StateCreator<
  StoreState,
  [],
  [],
  SharedMediaSlice
> = set => ({
  peerId: null,
  url: null,
  type: null,
  set: (media: SharedMedia) =>
    set(state => ({
      ...state,
      sharedMedia: {
        ...state.sharedMedia,
        ...media,
      },
    })),
  update: (data: Partial<SharedMedia>) =>
    set(state => ({
      ...state,
      sharedMedia: {
        ...state.sharedMedia,
        ...data,
      },
    })),
  clear: () =>
    set(state => ({
      ...state,
      sharedMedia: {
        ...state.sharedMedia,
        peerId: null,
        url: null,
        type: null,
        paused: undefined,
        time: undefined,
      },
    })),
});
