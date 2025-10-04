import type { StateCreator } from 'zustand';
import type { ConfStoreState } from '../type';
import type { Dimensions } from '@/types';

export interface TileLayout {
  width: number;
  height: number;
  aspectRatio: string;
}

export interface GridSlice {
  size: Dimensions;
  tile: TileLayout;
  rows: number;
  cols: number;
  setSize: (dimensions: Dimensions) => void;
  setTile: (layout: TileLayout) => void;
  setRows: (num: number) => void;
  setCols: (num: number) => void;
}

const intialState: Dimensions = {
  width: 0,
  height: 0,
};
export const createGridSlice: StateCreator<
  ConfStoreState,
  [],
  [['zustand/immer', GridSlice]],
  GridSlice
> = set => ({
  size: intialState,
  tile: { ...intialState, aspectRatio: '1/1' },
  rows: 0,
  cols: 0,
  setSize: dimensions =>
    set(state => {
      state.grid.size.height = dimensions.height;
      state.grid.size.width = dimensions.width;
      return state;
    }),
  setTile: layout =>
    set(state => {
      state.grid.tile.height = layout.height;
      state.grid.tile.width = layout.width;
      state.grid.tile.aspectRatio = layout.aspectRatio;
      return state;
    }),
  setRows: num =>
    set(state => {
      state.grid.rows = num;
      return state;
    }),
  setCols: num =>
    set(state => {
      state.grid.cols = num;
      return state;
    }),
});
