import type { ConfStoreState } from '@/store/conf/type';
import { Access, type Dimensions, type RoomData } from '@/types';
import type { StateCreator } from 'zustand';

export interface RoomSlice {
  data: RoomData | null;
  access: Access;
  gridDimensions: Dimensions;
  maxPeerPerPage: number;
  setData: (data: RoomData) => void;
  setAccess: (access: Access) => void;
  setGridDimensions: (dimensions: Dimensions) => void;
  setMaxPeerPerPage: (num: number) => void;
}

export const createRoomSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', RoomSlice]],
  RoomSlice
> = set => ({
  data: null,
  access: Access.Visiting,
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
});
