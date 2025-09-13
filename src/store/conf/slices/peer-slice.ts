import type { PeerCondition, PeerData, PeerMedia } from '@/types';
import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface PeerSlice {
  me: PeerData | null;
  others: Record<string, PeerData>;
  medias: Record<string, PeerMedia>;
  conditions: Record<string, PeerCondition>;
  positions: {
    id: string;
    lastActiveSpeechTimestamp: number;
  }[]; // id and array position;
  //Actions
  addData: (data: PeerData, isMe?: boolean) => void;
  addOthersData: (data: PeerData[]) => void;
  updateData: (id: string, data: Partial<PeerData>) => void;
  updateMedia: (id: string, media: Partial<PeerMedia>) => void;
  updateCondition: (id: string, condition: Partial<PeerCondition>) => void;
  updateLastActiveSpeechTimestamp: (id: string, timeStamp: number) => void;
  swapPositions: (activeIndex: number, passiveIndex: number) => void;
  remove: (id: string) => void;
  clear: () => void;
}

export const createPeerSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', PeerSlice]],
  PeerSlice
> = set => ({
  me: null,
  others: {},
  medias: {},
  conditions: {},
  positions: [],

  addData: (data, isYou = false) =>
    set(state => {
      if (isYou) {
        state.peers.me = data;
      } else {
        state.peers.others[data.id] = data;
      }
      state.peers.medias[data.id] = {
        id: data.id,
      };
      state.peers.conditions[data.id] = {
        id: data.id,
      };

      if (!state.peers.positions.find(value => value.id === data.id))
        state.peers.positions.push({
          id: data.id,
          lastActiveSpeechTimestamp: 0,
        });
      return state;
    }),
  addOthersData: data =>
    set(state => {
      data.forEach(peerData => {
        state.peers.others[peerData.id] = peerData;
      });
      return state;
    }),
  updateData: (id, data) =>
    set(state => {
      if (state.peers.me?.id === id) {
        Object.assign(state.peers.me, data);
      } else if (state.peers.others[id]) {
        Object.assign(state.peers.others[id], data);
      }
      return state;
    }),
  updateMedia: (id, media) =>
    set(state => {
      if (state.peers.me?.id === id || state.peers.others[id]) {
        Object.assign(state.peers.medias[id], media);
      }
      return state;
    }),
  updateCondition: (id, condition) =>
    set(state => {
      if (state.peers.me?.id === id || state.peers.others[id]) {
        Object.assign(state.peers.conditions[id], condition);
      }
      return state;
    }),
  updateLastActiveSpeechTimestamp: (id, timeStamp) =>
    set(state => {
      const index = state.peers.positions.findIndex(value => value.id === id);
      if (index >= 0) {
        state.peers.positions[index] = {
          id,
          lastActiveSpeechTimestamp: timeStamp,
        };
      }
      return state;
    }),
  swapPositions: (activeIndex, passiveIndex) =>
    set(state => {
      const activePosition = state.peers.positions[activeIndex];
      const passivePosition = state.peers.positions[passiveIndex];
      state.peers.positions[passiveIndex] = {
        ...activePosition,
        lastActiveSpeechTimestamp: Date.now(),
      };
      state.peers.positions[activeIndex] = passivePosition;
      return state;
    }),
  remove: id =>
    set(state => {
      delete state.peers.others[id];
      delete state.peers.medias[id];
      delete state.peers.conditions[id];

      const index = state.peers.positions.findIndex(value => value.id === id);
      if (index >= 0) {
        state.peers.positions.splice(index, 1);
      }
      return state;
    }),
  clear: () =>
    set(state => {
      state.peers.others = {};
      state.peers.medias = {};
      state.peers.conditions = {};
      state.peers.positions = [];
      return state;
    }),
});
