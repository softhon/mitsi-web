import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';

export interface CameraSlice {
  on: boolean;
  deviceId: string | null;
  devices: MediaDeviceInfo[];
  toggle: () => void;
  setDeviceId: (deviceId: string | null) => void;
  setDevices: (devices: MediaDeviceInfo[]) => void;
}

export const createCameraSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', CameraSlice]],
  CameraSlice
> = set => ({
  on: false,
  deviceId: null,
  devices: [],
  toggle: () =>
    set(state => {
      state.camera.on = !state.camera.on;
      return state;
    }),
  setDeviceId: deviceId =>
    set(state => {
      state.camera.deviceId = deviceId;
      return state;
    }),
  setDevices: devices =>
    set(state => {
      state.camera.devices = devices;
      return state;
    }),
});
