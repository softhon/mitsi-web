import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ConfStoreState } from './type';
import { createCounterSlice } from './slices/counter-slice';

export const useConfStore = create<ConfStoreState>()(
  devtools(
    immer((set, get, api) => ({
      counter: createCounterSlice(set, get, api),
    })),
    { name: 'conf-store' }
  )
);
