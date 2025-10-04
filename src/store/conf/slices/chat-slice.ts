import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface ChatSlice {
  open: boolean;
  toggle: () => void;
}

export const createChatSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', ChatSlice]],
  ChatSlice
> = set => ({
  open: false,
  toggle: () =>
    set(state => {
      state.chat.open = !state.chat.open;
      return state;
    }),
});
