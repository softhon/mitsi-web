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

  screens: string[]; // ids of peers sharing screen -> for optimization
  //Actions
  addData: (data: PeerData, isMe?: boolean) => void;
  addOthersData: (data: PeerData[]) => void;
  updateData: (id: string, data: Partial<PeerData>) => void;
  updateMedia: (id: string, media: Partial<PeerMedia>) => void;
  updateCondition: (id: string, condition: Partial<PeerCondition>) => void;
  updateLastActiveSpeechTimestamp: (id: string, timeStamp: number) => void;
  swapPositions: (activeIndex: number, passiveIndex: number) => void;
  addScreen: (id: string) => void;
  removeScreen: (id: string) => void;
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
  screens: [],
  addData: (data, isYou = false) =>
    set(state => {
      if (isYou) {
        state.peers.me = data;
      } else {
        if (!state.peers.others[data.id])
          state.peers.positions.push({
            id: data.id,
            lastActiveSpeechTimestamp: 0,
          });
        state.peers.others[data.id] = data;
      }
      state.peers.medias[data.id] = {
        id: data.id,
      };
      state.peers.conditions[data.id] = {
        id: data.id,
      };
      return state;
    }),

  addOthersData: data =>
    set(state => {
      data.forEach(peerData => {
        state.peers.others[peerData.id] = peerData;
        state.peers.positions.push({
          id: peerData.id,
          lastActiveSpeechTimestamp: 0,
        });
        state.peers.medias[peerData.id] = {
          id: peerData.id,
        };
        state.peers.conditions[peerData.id] = {
          id: peerData.id,
        };
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
  addScreen: id =>
    set(state => {
      state.peers.screens.push(id);
      return state;
    }),
  removeScreen: id =>
    set(state => {
      const index = state.peers.screens.findIndex(val => val === id);
      if (index >= 0) {
        state.peers.screens.splice(index, 1);
      }
      return state;
    }),
  remove: id =>
    set(state => {
      delete state.peers.others[id];
      delete state.peers.medias[id];
      delete state.peers.conditions[id];

      const positionIndex = state.peers.positions.findIndex(
        value => value.id === id
      );
      if (positionIndex >= 0) {
        state.peers.positions.splice(positionIndex, 1);
      }
      const screenIndex = state.peers.screens.findIndex(val => val === id);
      if (screenIndex >= 0) {
        state.peers.screens.splice(screenIndex, 1);
      }
      return state;
    }),
  clear: () =>
    set(state => {
      state.peers.others = {};
      state.peers.medias = {};
      state.peers.conditions = {};
      state.peers.positions = [];
      state.peers.screens = [];

      const myPeerId = state.peers.me?.id;
      if (myPeerId) {
        state.peers.medias[myPeerId] = { id: myPeerId };
        state.peers.conditions[myPeerId] = { id: myPeerId };
      }

      return state;
    }),
});
