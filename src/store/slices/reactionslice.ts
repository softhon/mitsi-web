import type { EmojiReaction } from '@/types';
import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';
const REACTION_EXPIRATION_TIME = 10000; // 10 secs

export interface ReactionsSlice {
  open: boolean;
  emojis: EmojiReaction[];
  add: (emojis: EmojiReaction) => void;
  setOpen: (open: boolean) => void;
  clear: () => void;
}

export const createReactionSlice: StateCreator<
  StoreState,
  [],
  [],
  ReactionsSlice
> = set => ({
  open: true,
  emojis: [],
  add: emoji =>
    set(state => {
      const now = Date.now();
      // these logic is to reduce the number of emoji is the document
      let visible = state.reactions.emojis.filter(
        emoji => now - emoji.timestamp < REACTION_EXPIRATION_TIME
      );
      visible = visible.length > 15 ? visible.slice(-6) : visible;
      return {
        ...state,
        reactions: {
          ...state.reactions,
          emojis: [...visible, emoji],
        },
      };
    }),
  setOpen: open =>
    set(state => ({
      ...state,
      reactions: {
        ...state.reactions,
        open,
      },
    })),
  clear: () =>
    set(state => ({
      ...state,
      reactions: {
        ...state.reactions,
        emojis: [],
      },
    })),
});
