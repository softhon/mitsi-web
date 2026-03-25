import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface SpeakingSlice {
  speaking: Record<string, boolean>; // peerId -> isSpeaking
  setSpeaking: (peerId: string, isSpeaking: boolean) => void;
  clearSpeaking: (peerId: string) => void;
  clearAllSpeaking: () => void;
}

export const createSpeakingSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', SpeakingSlice]],
  SpeakingSlice
> = set => ({
  speaking: {},
  setSpeaking: (peerId, isSpeaking) =>
    set(state => {
      state.speaking.speaking[peerId] = isSpeaking;
      return state;
    }),
  clearSpeaking: peerId =>
    set(state => {
      delete state.speaking.speaking[peerId];
      return state;
    }),
  clearAllSpeaking: () =>
    set(state => {
      state.speaking.speaking = {};
      return state;
    }),
});
