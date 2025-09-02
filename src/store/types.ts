import type { CameraSlice } from './slices/cameraslice';
import type { ChatSlice } from './slices/chatslice';
import type { DeviceSlice } from './slices/deviceslice';
import type { HandSlice } from './slices/handslice';
import type { MeetingSlice } from './slices/meetingslice';
import type { MicSlice } from './slices/micslice';
import type { ModalSlice } from './slices/modalslice';
import type { PaginationSlice } from './slices/paginationslice';
import type { PeerSlice } from './slices/peerslice';
import type { ReactionsSlice } from './slices/reactionslice';
import type { ScreenSlice } from './slices/screenslice';
import type { SettingsSlice } from './slices/settingsslice';
import type { SharedMediaSlice } from './slices/sharedmediaslice';
import type { SoundSlice } from './slices/soundslice';
import type { WaiterSlice } from './slices/waiterslice';

export interface StoreState {
  mic: MicSlice;
  hand: HandSlice;
  camera: CameraSlice;
  sound: SoundSlice;
  screen: ScreenSlice;
  device: DeviceSlice;
  peers: PeerSlice;
  waiters: WaiterSlice;
  chats: ChatSlice;
  meeting: MeetingSlice;
  settings: SettingsSlice;
  modal: ModalSlice;
  pagination: PaginationSlice;
  sharedMedia: SharedMediaSlice;
  reactions: ReactionsSlice;
}
