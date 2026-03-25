import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import type { NotificationSettings } from '@/types';
import type { BackgroundMode } from '@/services/background-service';

export interface SettingsSlice {
  open: boolean;
  toggle: () => void;
  backgroundTrackVersion: number;
  bumpBackgroundTrackVersion: () => void;
  notifications: NotificationSettings;
  toggleNotification: (notification: keyof NotificationSettings) => void;
  noiseSuppression: boolean;
  toggleNoiseSuppression: () => void;
  backgroundMode: BackgroundMode;
  backgroundImage: string | null;
  setBackgroundMode: (mode: BackgroundMode) => void;
  setBackgroundImage: (src: string | null) => void;
}

export const createSettingsSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', SettingsSlice]],
  SettingsSlice
> = set => ({
  open: false,
  backgroundTrackVersion: 0,
  noiseSuppression: true,
  backgroundMode: 'none',
  backgroundImage: null,
  toggle: () =>
    set(state => {
      state.settings.open = !state.settings.open;
      return state;
    }),
  bumpBackgroundTrackVersion: () =>
    set(state => {
      state.settings.backgroundTrackVersion += 1;
      return state;
    }),
  toggleNoiseSuppression: () =>
    set(state => {
      state.settings.noiseSuppression = !state.settings.noiseSuppression;
      return state;
    }),
  notifications: {
    peerJoined: false,
    peerLeave: false,
    newMessage: true,
    handRaise: true,
    error: true,
  },
  toggleNotification: notification =>
    set(state => {
      state.settings.notifications[notification] =
        !state.settings.notifications[notification];
      return state;
    }),
  setBackgroundMode: mode =>
    set(state => {
      state.settings.backgroundMode = mode;
      return state;
    }),
  setBackgroundImage: src =>
    set(state => {
      state.settings.backgroundImage = src;
      return state;
    }),
});
