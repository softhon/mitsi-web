import type { CounterSlice } from './slices/counter-slice';
import type { MicSlice } from './slices/mic-slice';

export interface ConfStoreState {
  counter: CounterSlice;
  mic: MicSlice;
}
