import { create } from 'zustand';
import type { StoreState } from './types';
import { createMicSlice } from './slices/micslice';
import { createHandSlice } from './slices/handslice';
import { createCameraSlice } from './slices/cameraslice';
import { createSoundSlice } from './slices/soundslice';
import { createScreenSlice } from './slices/screenslice';
import { createPeerSlice } from './slices/peerslice';
import { createMeetingSlice } from './slices/meetingslice';
import { createSettingsSlice } from './slices/settingsslice';
import { createPaginationSlice } from './slices/paginationslice';
import { devtools } from 'zustand/middleware';
import { createChatSlice } from './slices/chatslice';
import { createWaiterSlice } from './slices/waiterslice';
import { createSharedMediaSlice } from './slices/sharedmediaslice';
import { createModalSlice } from './slices/modalslice';
import { createReactionSlice } from './slices/reactionslice';
import { createDeviceSlice } from './slices/deviceslice';

// Create the store with devtools middleware
export const useStore = create<StoreState>()(
  devtools(
    (...a) => ({
      mic: createMicSlice(...a),
      hand: createHandSlice(...a),
      camera: createCameraSlice(...a),
      sound: createSoundSlice(...a),
      screen: createScreenSlice(...a),
      device: createDeviceSlice(...a),
      peers: createPeerSlice(...a),
      waiters: createWaiterSlice(...a),
      chats: createChatSlice(...a),
      meeting: createMeetingSlice(...a),
      settings: createSettingsSlice(...a),
      modal: createModalSlice(...a),
      pagination: createPaginationSlice(...a),
      sharedMedia: createSharedMediaSlice(...a),
      reactions: createReactionSlice(...a),
    }),
    {
      name: 'MyStore', // Name of the store in Devtools
      enabled: process.env.NODE_ENV === 'development', // Enable Devtools only in development
    }
  )
);
