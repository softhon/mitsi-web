import type { CameraSlice } from './slices/camera-slice';
import type { ChatSlice } from './slices/chat-slice';
import type { GridSlice } from './slices/grid-slice';
import type { MicSlice } from './slices/mic-slice';
import type { ModalSlice } from './slices/modal-slice';
import type { PeerSlice } from './slices/peer-slice';
import type { RoomSlice } from './slices/room-slice';
import type { ScreenSlice } from './slices/screen-slice';
import type { SettingsSlice } from './slices/settings-slice';
import type { ReactionSlice } from './slices/reaction-slice';
import type { HandSlice } from './slices/hand-slice';

export interface ConfStoreState {
  mic: MicSlice;
  camera: CameraSlice;
  peers: PeerSlice;
  room: RoomSlice;
  grid: GridSlice;
  chat: ChatSlice;
  modal: ModalSlice;
  screen: ScreenSlice;
  hand: HandSlice;
  settings: SettingsSlice;
  reactions: ReactionSlice;
}
