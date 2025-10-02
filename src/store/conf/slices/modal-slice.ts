import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface ModalSlice {
  chatOpen: boolean;
  participantsOpen: boolean;
  toggleChatOpen: () => void;
  toggleParticipantOpen: () => void;
}

export const createModalSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', ModalSlice]],
  ModalSlice
> = set => ({
  chatOpen: false,
  participantsOpen: false,
  toggleChatOpen: () =>
    set(state => {
      state.modal.chatOpen = !state.modal.chatOpen;
      state.modal.participantsOpen = false;
      return state;
    }),
  toggleParticipantOpen: () =>
    set(state => {
      state.modal.participantsOpen = !state.modal.participantsOpen;
      state.modal.chatOpen = false;
      return state;
    }),
});
