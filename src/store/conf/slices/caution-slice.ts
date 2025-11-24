import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import { CautionType } from '@/types';

export interface CautionSlice {
  active: CautionType;
  set: (caution: CautionType) => void;
}

export const createCautionSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', CautionSlice]],
  CautionSlice
> = set => ({
  active: CautionType.Hide,
  set: caution =>
    set(state => {
      state.caution.active = caution;
      return state;
    }),
});
