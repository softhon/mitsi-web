import type { CameraSlice } from './slices/camera-slice';
import type { MicSlice } from './slices/mic-slice';

export interface ConfStoreState {
  mic: MicSlice;
  camera: CameraSlice;
}
