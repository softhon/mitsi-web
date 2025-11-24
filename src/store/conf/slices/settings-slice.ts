import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import type { NotificationSettings } from '@/types';

export interface SettingsSlice {
  open: boolean;
  toggle: () => void;
  notifications: NotificationSettings;
  toggleNotification: (notification: keyof NotificationSettings) => void;
}

export const createSettingsSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', SettingsSlice]],
  SettingsSlice
> = set => ({
  open: false,
  toggle: () =>
    set(state => {
      state.settings.open = !state.settings.open;
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
});
