import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';
import type { Chat, PrivateChatPeer } from '@/types';

export interface ChatSlice {
  latestChat: Chat | null;
  public: Record<string, Chat>;
  private: Record<string, Chat>;
  unreadPublic: number;
  privateOpened: boolean;
  openedPrivateChatPeer: PrivateChatPeer | null;
  privateChatPeers: PrivateChatPeer[];
  add: (chat: Chat) => void;
  setPrivateOpened: (privateOpened: boolean) => void;
  setOpenedPrivateChatPeer: (
    openedPrivateChatPeer: PrivateChatPeer | null
  ) => void;
  setUnreadPublic: (unreadPublic: number) => void;
  addUnreadPublic: (unreadPublic?: number) => void;
  addPrivateChatPeer: (privateChatPeer: PrivateChatPeer) => void;
}

export const createChatSlice: StateCreator<
  StoreState,
  [],
  [],
  ChatSlice
> = set => ({
  latestChat: null,
  public: {},
  private: {},
  privateOpened: false,
  openedPrivateChatPeer: null,
  unreadPublic: 0,
  privateChatPeers: [],
  add: chat =>
    set(state => {
      if (chat.receiver) {
        return {
          ...state,
          chats: {
            ...state.chats,
            latestChat: chat,
            private: {
              ...state.chats.private,
              [chat.id]: chat,
            },
          },
        };
      }
      return {
        ...state,
        chats: {
          ...state.chats,
          latestChat: chat,
          public: {
            ...state.chats.public,
            [chat.id]: chat,
          },
        },
      };
    }),
  setPrivateOpened: privateOpened =>
    set(state => ({
      ...state,
      chats: {
        ...state.chats,
        privateOpened,
      },
    })),
  setOpenedPrivateChatPeer: openedPrivateChatPeer =>
    set(state => ({
      ...state,
      chats: {
        ...state.chats,
        openedPrivateChatPeer,
      },
    })),
  setUnreadPublic: number =>
    set(state => ({
      ...state,
      chats: {
        ...state.chats,
        unreadPublic: number,
      },
    })),
  addUnreadPublic: (number = 1) =>
    set(state => ({
      ...state,
      chats: {
        ...state.chats,
        unreadPublic: state.chats.unreadPublic + number,
      },
    })),
  addPrivateChatPeer: privateChatPeer =>
    set(state => ({
      ...state,
      chats: {
        ...state.chats,
        privateChatPeers: managePrivateChatsStatus(
          state.chats.privateChatPeers,
          privateChatPeer
        ),
      },
    })),
});

const managePrivateChatsStatus = (
  privateChatPeers: PrivateChatPeer[],
  privateChatPeer: PrivateChatPeer
) => {
  // find if peer already exist
  // it it does merge data
  let updatedPrivatePeers: PrivateChatPeer[] = [];

  const findExistingPeer = privateChatPeers.find(
    peer => peer.id === privateChatPeer.id
  );

  if (!findExistingPeer) {
    updatedPrivatePeers = [
      ...privateChatPeers,
      { ...privateChatPeer, isPrivatePeer: true },
    ];
  } else {
    // remove existing peer
    const removeExistingPeer = privateChatPeers.filter(
      peer => peer.id !== findExistingPeer.id
    );

    updatedPrivatePeers = [
      ...removeExistingPeer,
      {
        ...findExistingPeer,
        ...privateChatPeer,
        isPrivatePeer: true,
        unread:
          (findExistingPeer?.unread || 0) + (privateChatPeer?.unread || 0),
      },
    ];
  }

  // console.log({ updatedPrivatePeers })
  // privateChatPeers[privateChatPeer.id] = { ...privateChatPeers[privateChatPeer.id], ...privateChatPeer, isPrivatePeer: true }
  return updatedPrivatePeers.sort(
    (a, b) => (b?.lastMessageTimestamp || 0) - (a?.lastMessageTimestamp || 0)
  );
};
