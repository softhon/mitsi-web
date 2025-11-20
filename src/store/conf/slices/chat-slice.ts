import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import type { Chat } from '@/types';

export interface ChatSlice {
  chats: Chat[];
  add: (chat: Chat) => void;
}

export const createChatSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', ChatSlice]],
  ChatSlice
> = set => ({
  chats: [],
  add: chat =>
    set(state => {
      state.chat.chats.push(chat);
      return state;
    }),
});
