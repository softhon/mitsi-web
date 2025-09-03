import type { CameraSlice } from './slices/camera-slice';
import type { CounterSlice } from './slices/counter-slice';
import type { MicSlice } from './slices/mic-slice';

export interface ConfStoreState {
  counter: CounterSlice;
  mic: MicSlice;
  camera: CameraSlice;
}
