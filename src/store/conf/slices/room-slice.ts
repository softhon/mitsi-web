import type { ConfStoreState } from '@/store/conf/type';
import { Access, type Dimensions, type RoomData } from '@/types';
import type { StateCreator } from 'zustand';

export interface RoomSlice {
  data: RoomData | null;
  access: Access;
  reconnecting: boolean;
  disconnected: boolean;
  recording: boolean;
  locked: boolean;
  gridDimensions: Dimensions;
  maxPeerPerPage: number;
  setData: (data: RoomData) => void;
  setAccess: (access: Access) => void;
  setGridDimensions: (dimensions: Dimensions) => void;
  setMaxPeerPerPage: (num: number) => void;
  setReconnecting: (reconnecting: boolean) => void;
  setDisconnected: (disconnected: boolean) => void;
  setRecording: (recording: boolean) => void;
  setLocked: (locked: boolean) => void;
}

export const createRoomSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', RoomSlice]],
  RoomSlice
> = set => ({
  data: null,
  access: Access.Visiting,
  reconnecting: false,
  disconnected: false,
  recording: false,
  locked: false,
  maxPeerPerPage: 12,
  gridDimensions: {
    width: 0,
    height: 0,
  },
  setData: data =>
    set(state => {
      state.room.data = data;
      return state;
    }),
  setAccess: access =>
    set(state => {
      state.room.access = access;
      return state;
    }),
  setGridDimensions: dimensions =>
    set(state => {
      state.room.gridDimensions = dimensions;
      return state;
    }),
  setMaxPeerPerPage: num =>
    set(state => {
      state.room.maxPeerPerPage = num;
      return state;
    }),
  setReconnecting: reconnecting =>
    set(state => {
      state.room.reconnecting = reconnecting;
      return state;
    }),
  setDisconnected: disconnected =>
    set(state => {
      state.room.disconnected = disconnected;
      return state;
    }),
  setRecording: recording =>
    set(state => {
      state.room.recording = recording;
      return state;
    }),
  setLocked: locked =>
    set(state => {
      state.room.locked = locked;
      return state;
    }),
});
