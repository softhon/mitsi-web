import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import type { ConfStoreState } from './type';
import { createMicSlice } from './slices/mic-slice';
import { createCameraSlice } from './slices/camera-slice';
import { createPeerSlice } from './slices/peer-slice';
import { createRoomSlice } from '@/store/conf/slices/room-slice';
import { createGridSlice } from './slices/grid-slice';
import { createChatSlice } from './slices/chat-slice';
import { createModalSlice } from './slices/modal-slice';

export const useConfStore = create<ConfStoreState>()(
  devtools(
    immer((set, get, api) => ({
      mic: createMicSlice(set, get, api),
      camera: createCameraSlice(set, get, api),
      peers: createPeerSlice(set, get, api),
      room: createRoomSlice(set, get, api),
      grid: createGridSlice(set, get, api),
      chat: createChatSlice(set, get, api),
      modal: createModalSlice(set, get, api),
    })),
    { name: 'conf-store' }
  )
);
