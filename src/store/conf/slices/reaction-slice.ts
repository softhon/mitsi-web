import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import type { EmojiReaction } from '@/types';
const REACTION_EXPIRATION_TIME = 10000; // 10 secs

export interface ReactionSlice {
  emojis: EmojiReaction[];
  add: (emoji: EmojiReaction) => void;
  clear: () => void;
}

export const createReactionSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', ReactionSlice]],
  ReactionSlice
> = set => ({
  emojis: [],
  add: emoji =>
    set(state => {
      const now = Date.now();
      let visible = state.reactions.emojis.filter(
        emoji => now - emoji.timestamp < REACTION_EXPIRATION_TIME
      );
      visible = visible.length > 15 ? visible.slice(-6) : visible;
      state.reactions.emojis = [...visible, emoji];
      return state;
    }),
  clear: () =>
    set(state => {
      state.reactions.emojis = [];
      return state;
    }),
});
