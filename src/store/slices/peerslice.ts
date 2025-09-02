/* eslint-disable @typescript-eslint/no-unused-vars */
import type { Peer, SelectedPeerAction } from '@/types';
import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface PeerSlice {
  self: Peer | null;
  others: Record<string, Peer>;
  idsOrder: Record<string, number>; // id and lastSpeechTimestamp
  selected: Peer | null;
  selectedAction: SelectedPeerAction | null;
  setSelf: (self: Peer) => void;
  updateSelf: (data: Partial<Peer>) => void;
  add: (peer: Peer) => void;
  update: (id: string, data: Partial<Peer>) => void;
  remove: (id: string) => void;
  updateIdTimestamp: (id: string) => void;
  setSelectedPeer: (
    peer: Peer | null,
    action: SelectedPeerAction | null
  ) => void;
  swapIdsOrder: (
    activeSpeakerPeerId: string,
    oldestSpeakerPeerId: string
  ) => void;
  clear: () => void;
}

export const createPeerSlice: StateCreator<
  StoreState,
  [],
  [],
  PeerSlice
> = set => ({
  self: null,
  others: {},
  idsOrder: {},
  selected: null,
  selectedAction: null,
  setSelf: self =>
    set(state => ({
      ...state,
      peers: {
        ...state.peers,
        self: { ...self, lowerName: self.name.toLowerCase() },
      },
    })),
  updateSelf: update =>
    set(state => ({
      ...state,
      peers: {
        ...state.peers,
        self: state.peers.self
          ? {
              ...state.peers.self,
              ...update,
            }
          : null,
      },
    })),
  add: peer =>
    set(state => {
      if (peer.id === state.peers.self?.id) {
        console.log('Attempted add self peer to peers but rejected');
        return state;
      }
      return {
        ...state,
        peers: {
          ...state.peers,
          others: {
            ...state.peers.others,
            [peer.id]: { ...peer, lowerName: peer.name.toLowerCase() },
          },
          idsOrder: {
            ...state.peers.idsOrder,
            [peer.id]: 0,
          },
        },
      };
    }),
  update: (id, data) =>
    set(state => {
      if (id === state.peers.self?.id) {
        return {
          ...state,
          peers: {
            ...state.peers,
            self: state.peers.self
              ? {
                  ...state.peers.self,
                  ...data,
                }
              : null,
          },
        };
      }
      if (!state.peers.others[id]) {
        return state; // No profile to update
      }
      return {
        ...state,
        peers: {
          ...state.peers,
          others: {
            ...state.peers.others,
            [id]: {
              ...state.peers.others[id],
              ...data,
            },
          },
        },
      };
    }),
  remove: id =>
    set(state => {
      const { [id]: _, ...restPeers } = state.peers.others;
      const { [id]: __, ...restPeersOrder } = state.peers.idsOrder;
      return {
        ...state,
        peers: {
          ...state.peers,
          others: restPeers,
          idsOrder: restPeersOrder,
        },
      };
    }),
  updateIdTimestamp: id =>
    set(state => ({
      ...state,
      peers: {
        ...state.peers,
        idsOrder: {
          ...state.peers.idsOrder,
          [id]: Date.now(),
        },
      },
    })),
  setSelectedPeer: (peer, action) =>
    set(state => {
      if (!peer)
        return {
          ...state,
          peers: {
            ...state.peers,
            selected: null,
            selectedAction: null,
          },
        };
      return {
        ...state,
        peers: {
          ...state.peers,
          selected: peer,
          selectedAction: action || 'FullScreenCamera',
        },
      };
    }),
  swapIdsOrder: (activeSpeakerPeerId, oldestSpeakerPeerId) =>
    set(state => {
      const peerKeys = Object.keys(state.peers.idsOrder);
      const activeSpeakerPeerIndex = peerKeys.indexOf(activeSpeakerPeerId);
      const oldestSpeakerPeerIndex = peerKeys.indexOf(oldestSpeakerPeerId);
      peerKeys[oldestSpeakerPeerIndex] = activeSpeakerPeerId;
      peerKeys[activeSpeakerPeerIndex] = oldestSpeakerPeerId;

      const newPeersOrder: Record<string, number> = {};

      peerKeys.forEach(key => {
        newPeersOrder[key] = state.peers.idsOrder[key];
      });
      return {
        ...state,
        peers: {
          ...state.peers,
          idsOrder: newPeersOrder,
        },
      };
    }),
  clear: () =>
    set(state => ({
      ...state,
      peers: {
        ...state.peers,
        others: {},
        idsOrder: {},
      },
    })),
});
