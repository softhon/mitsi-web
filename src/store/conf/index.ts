import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ConfStoreState } from './type';
import { createMicSlice } from './slices/mic-slice';
import { createCameraSlice } from './slices/camera-slice';

export const useConfStore = create<ConfStoreState>()(
  devtools(
    immer((set, get, api) => ({
      mic: createMicSlice(set, get, api),
      camera: createCameraSlice(set, get, api),
    })),
    { name: 'conf-store' }
  )
);
