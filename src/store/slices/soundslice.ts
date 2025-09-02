import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface SoundSlice {
  deviceId: string | null;
  devices: MediaDeviceInfo[];
  setDeviceId: (deviceId: string | null) => void;
  setDevices: (devices: MediaDeviceInfo[]) => void;
}

export const createSoundSlice: StateCreator<
  StoreState,
  [],
  [],
  SoundSlice
> = set => ({
  deviceId: null,
  devices: [],
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
});
