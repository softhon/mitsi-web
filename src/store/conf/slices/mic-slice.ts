import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface MicSlice {
  on: boolean;
  deviceId: string | null;
  devices: MediaDeviceInfo[];
  toggle: () => void;
  setDeviceId: (deviceId: string | null) => void;
  setDevices: (devices: MediaDeviceInfo[]) => void;
}

export const createMicSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', MicSlice]],
  MicSlice
> = set => ({
  on: false,
  deviceId: null,
  devices: [],
  toggle: () =>
    set(state => {
      state.mic.on = !state.mic.on;
      return state;
    }),
  setDeviceId: deviceId =>
    set(state => {
      state.mic.deviceId = deviceId;
      return state;
    }),
  setDevices: devices =>
    set(state => {
      state.mic.devices = devices;
      return state;
    }),
});
