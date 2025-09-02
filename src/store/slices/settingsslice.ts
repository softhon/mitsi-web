import { SettingsTabName } from '@/types';
import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface SettingsSlice {
  activeTab: SettingsTabName;
  attendeeJoinedAlert: boolean;
  attendeeLeftAlert: boolean;
  requestToJoinAlert: boolean;
  newChatAlert: boolean;
  attendeeJoinedSound: boolean;
  recordingSound: boolean;
  setActiveTab: (activeTab: SettingsTabName) => void;
  setAttendeeJoinedAlert: (state: boolean) => void;
  setAttendeeLeftAlert: (state: boolean) => void;
  setRequestToJoinAlert: (state: boolean) => void;
  setNewChatAlert: (state: boolean) => void;
  setAttendeeJoinedSound: (state: boolean) => void;
  setRecordingSound: (state: boolean) => void;
}

export const createSettingsSlice: StateCreator<
  StoreState,
  [],
  [],
  SettingsSlice
> = set => ({
  activeTab: SettingsTabName.Audio,
  attendeeJoinedAlert: false,
  attendeeLeftAlert: false,
  newChatAlert: true,
  requestToJoinAlert: true,
  attendeeJoinedSound: false,
  recordingSound: true,
  setActiveTab: activeTab =>
    set(state => ({
      ...state,
      settings: { ...state.settings, activeTab },
    })),
  setAttendeeJoinedAlert: attendeeJoinedAlert =>
    set(state => ({
      ...state,
      settings: { ...state.settings, attendeeJoinedAlert },
    })),
  setAttendeeLeftAlert: attendeeLeftAlert =>
    set(state => ({
      ...state,
      settings: { ...state.settings, attendeeLeftAlert },
    })),
  setRequestToJoinAlert: requestToJoinAlert =>
    set(state => ({
      ...state,
      settings: { ...state.settings, requestToJoinAlert },
    })),
  setNewChatAlert: newChatAlert =>
    set(state => ({
      ...state,
      settings: { ...state.settings, newChatAlert },
    })),
  setAttendeeJoinedSound: attendeeJoinedSound =>
    set(state => ({
      ...state,
      settings: { ...state.settings, attendeeJoinedSound },
    })),
  setRecordingSound: recordingSound =>
    set(state => ({
      ...state,
      settings: { ...state.settings, recordingSound },
    })),
});
