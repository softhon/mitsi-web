import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface CameraSlice {
  on: boolean;
  deviceId: string | null;
  devices: MediaDeviceInfo[];
  toggle: boolean;
  setOn: (on: boolean) => void;
  setDeviceId: (deviceId: string | null) => void;
  setDevices: (devices: MediaDeviceInfo[]) => void;
  setToggle: (toggle: boolean) => void;
}

export const createCameraSlice: StateCreator<
  StoreState,
  [],
  [],
  CameraSlice
> = set => ({
  on: false,
  deviceId: null,
  devices: [],
  toggle: false,
  setOn: value =>
    set(state => ({
      ...state,
      camera: { ...state.camera, on: value },
    })),
  setDeviceId: value =>
    set(state => ({
      ...state,
      camera: { ...state.camera, deviceId: value },
    })),
  setDevices: value =>
    set(state => ({
      ...state,
      camera: { ...state.camera, devices: value },
    })),
  setToggle: value =>
    set(state => ({
      ...state,
      camera: { ...state.camera, toggle: value },
    })),
});
