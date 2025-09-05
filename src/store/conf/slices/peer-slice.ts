import type { PeerCondition, PeerData, PeerMedia } from '@/types';
import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface PeerSlice {
  you: PeerData | null;
  others: Record<string, PeerData>;
  medias: Record<string, PeerMedia>;
  conditions: Record<string, PeerCondition>;
  positions: Record<string, number>; // id and array position;
  //Actions
  addData: (data: PeerData, isYou?: boolean) => void;
  updateData: (id: string, data: Partial<PeerData>) => void;
  updateMedia: (id: string, media: Partial<PeerMedia>) => void;
  updateCondition: (id: string, condition: Partial<PeerCondition>) => void;
  swapPositions: (id1: string, id2: string) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const createPeerSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', PeerSlice]],
  PeerSlice
> = set => ({
  you: null,
  others: {},
  medias: {},
  conditions: {},
  positions: {},

  addData: (data, isYou = false) =>
    set(state => {
      if (isYou) {
        state.peers.you = data;
      } else {
        state.peers.others[data.id] = data;
      }
      state.peers.medias[data.id] = {
        id: data.id,
      };
      state.peers.conditions[data.id] = {
        id: data.id,
      };
      state.peers.positions[data.id] =
        Object.keys(state.peers.positions).length - 1;
      return state;
    }),

  updateData: (id, data) =>
    set(state => {
      if (state.peers.you?.id === id) {
        Object.assign(state.peers.you, data);
      } else if (state.peers.others[id]) {
        Object.assign(state.peers.others[id], data);
      }
      return state;
    }),
  updateMedia: (id, media) =>
    set(state => {
      if (state.peers.you?.id === id || state.peers.others[id]) {
        Object.assign(state.peers.medias[id], media);
      }
      return state;
    }),
  updateCondition: (id, condition) =>
    set(state => {
      if (state.peers.you?.id === id || state.peers.others[id]) {
        Object.assign(state.peers.conditions[id], condition);
      }
      return state;
    }),
  swapPositions: (id1, id2) =>
    set(state => {
      const id1Position = state.peers.positions[id1];
      const id2Position = state.peers.positions[id2];
      state.peers.positions[id1] = id2Position;
      state.peers.positions[id2] = id1Position;
      return state;
    }),
  remove: id =>
    set(state => {
      delete state.peers.others[id];
      delete state.peers.medias[id];
      delete state.peers.conditions[id];
      delete state.peers.positions[id];
      return state;
    }),
  clear: () =>
    set(state => {
      state.peers.others = {};
      state.peers.medias = {};
      state.peers.conditions = {};
      state.peers.positions = {};
      return state;
    }),
});
