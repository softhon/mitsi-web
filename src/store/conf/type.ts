import type { CameraSlice } from './slices/camera-slice';
import type { MicSlice } from './slices/mic-slice';
import type { PeerSlice } from './slices/peer-slice';
import type { RoomSlice } from './slices/room-slice';

export interface ConfStoreState {
  mic: MicSlice;
  camera: CameraSlice;
  peers: PeerSlice;
  room: RoomSlice;
}
