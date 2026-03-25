import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import type { Chat } from '@/types';

export interface ChatSlice {
  chats: Chat[];
  dmChats: Record<string, Chat[]>;
  unreadDm: Record<string, number>;
  add: (chat: Chat) => void;
  addDmChat: (peerId: string, chat: Chat, mine?: boolean) => void;
  clearUnread: (peerId: string) => void;
}

export const createChatSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', ChatSlice]],
  ChatSlice
> = set => ({
  chats: [],
  dmChats: {},
  unreadDm: {},
  add: chat =>
    set(state => {
      state.chat.chats.push(chat);
      return state;
    }),
  addDmChat: (peerId, chat, mine = false) =>
    set(state => {
      if (!state.chat.dmChats[peerId]) state.chat.dmChats[peerId] = [];
      state.chat.dmChats[peerId].push(chat);
      if (!mine) state.chat.unreadDm[peerId] = (state.chat.unreadDm[peerId] ?? 0) + 1;
      return state;
    }),
  clearUnread: peerId =>
    set(state => {
      state.chat.unreadDm[peerId] = 0;
      return state;
    }),
});
