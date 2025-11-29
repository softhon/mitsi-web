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
import { createScreenSlice } from './slices/screen-slice';
import { createSettingsSlice } from './slices/settings-slice';
import { createReactionSlice } from './slices/reaction-slice';
import { createHandSlice } from './slices/hand-slice';
import { createCautionSlice } from './slices/caution-slice';
import { createFullscreenSlice } from './slices/fullscreen-slice';

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
      screen: createScreenSlice(set, get, api),
      hand: createHandSlice(set, get, api),
      settings: createSettingsSlice(set, get, api),
      reactions: createReactionSlice(set, get, api),
      caution: createCautionSlice(set, get, api),
      fullscreen: createFullscreenSlice(set, get, api),
    })),
    { name: 'conf-store' }
  )
);
