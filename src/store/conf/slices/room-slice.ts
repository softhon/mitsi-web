import type { ConfStoreState } from '@/store/conf/type';
import { Access, type RoomData } from '@/types';
import type { StateCreator } from 'zustand';

export interface RoomSlice {
  data: RoomData | null;
  access: Access;
  setData: (data: RoomData) => void;
  setAccess: (access: Access) => void;
}

export const createRoomSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', RoomSlice]],
  RoomSlice
> = set => ({
  data: null,
  access: Access.Visiting,
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
});
