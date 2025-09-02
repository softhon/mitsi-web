import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface MicSlice {
  on: boolean;
  deviceId: string | null;
  devices: MediaDeviceInfo[];
  toggle: boolean;
  setOn: (on: boolean) => void;
  setDeviceId: (deviceId: string | null) => void;
  setDevices: (devices: MediaDeviceInfo[]) => void;
  setToggle: (toggle: boolean) => void;
}

export const createMicSlice: StateCreator<
  StoreState,
  [],
  [],
  MicSlice
> = set => ({
  on: false,
  deviceId: null,
  devices: [],
  toggle: false,
  setOn: value =>
    set(state => ({
      ...state,
      mic: { ...state.mic, on: value },
    })),
  setDeviceId: value =>
    set(state => ({
      ...state,
      mic: { ...state.mic, deviceId: value },
    })),
  setDevices: value =>
    set(state => ({
      ...state,
      mic: { ...state.mic, devices: value },
    })),
  setToggle: value =>
    set(state => ({
      ...state,
      mic: { ...state.mic, toggle: value },
    })),
});
