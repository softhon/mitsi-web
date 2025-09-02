import { Access } from '@/types';
import type { MeetingType } from '@/types';
import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface MeetingSlice {
  data: MeetingType | null;
  joined: boolean;
  started: number;
  ended: boolean;
  recording: boolean;
  maxPeers: number;
  removed: boolean;
  disconnected: boolean;
  timeLeft: number;
  mirror: boolean;
  waitingToStart: boolean;
  allowWaiting: boolean;
  access: Access;
  activeSpeakerPeerId: string | null;
  presenterPeerId: string | null;

  setData: (data: MeetingType | null) => void;
  setJoined: (joined: boolean) => void;
  setStarted: (timestamp: number) => void;
  setEnded: (ended: boolean) => void;
  setRecording: (recording: boolean) => void;
  setMaxPeers: (maxPeers: number) => void;
  setRemoved: (removed: boolean) => void;
  setDisconnected: (disconnected: boolean) => void;
  setTimeLeft: (timeLeft: number) => void;
  reduceTimeLeft: (by?: number) => void;
  setMirror: (mirror: boolean) => void;
  setWaitingToStart: (waitingToStart: boolean) => void;
  setAllowWaiting: (value: boolean) => void;
  setAccess: (access: Access) => void;
  setActiveSpeakerPeerId: (peerId: string | null) => void;
  setPresenterPeerId: (peerId: string | null) => void;
}

export const createMeetingSlice: StateCreator<
  StoreState,
  [],
  [],
  MeetingSlice
> = set => ({
  data: null,
  joined: false,
  started: 0,
  ended: false,
  recording: false,
  maxPeers: 0,
  removed: false,
  disconnected: false,
  timeLeft: 0,
  mirror: true,
  waitingToStart: false,
  allowWaiting: false,
  access: Access.Visiting,
  activeSpeakerPeerId: null,
  presenterPeerId: null,

  setData: data =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, data },
    })),
  setJoined: joined =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, joined },
    })),
  setStarted: started =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, started },
    })),
  setEnded: ended =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, ended },
    })),
  setRecording: recording =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, recording },
    })),
  setMaxPeers: maxPeers =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, maxPeers },
    })),
  setRemoved: removed =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, removed },
    })),
  setDisconnected: disconnected =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, disconnected },
    })),
  setTimeLeft: timeLeft =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, timeLeft },
    })),
  reduceTimeLeft: (by = 1) =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, timeLeft: state.meeting.timeLeft - by },
    })),
  setMirror: mirror =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, mirror },
    })),

  setWaitingToStart: waitingToStart =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, waitingToStart },
    })),
  setAllowWaiting: allowWaiting =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, allowWaiting },
    })),
  setAccess: access =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, access },
    })),
  setActiveSpeakerPeerId: activeSpeakerPeerId =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, activeSpeakerPeerId },
    })),
  setPresenterPeerId: presenterPeerId =>
    set(state => ({
      ...state,
      meeting: { ...state.meeting, presenterPeerId },
    })),
});
