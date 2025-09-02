import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface PaginationSlice {
  pageSize: number;
  currentPage: number;
  maxPage: number;
  setPageSize: (pageSize: number) => void;
  setCurrentPage: (page: number) => void;
  setMaxPage: (max: number) => void;
}

export const createPaginationSlice: StateCreator<
  StoreState,
  [],
  [],
  PaginationSlice
> = set => ({
  pageSize: 2,
  currentPage: 1,
  maxPage: 1,
  setPageSize: pageSize =>
    set(state => ({
      ...state,
      pagination: {
        ...state.pagination,
        pageSize,
      },
    })),
  setCurrentPage: currentPage =>
    set(state => ({
      ...state,
      pagination: {
        ...state.pagination,
        currentPage,
      },
    })),
  setMaxPage: maxPage =>
    set(state => ({
      ...state,
      pagination: {
        ...state.pagination,
        maxPage,
      },
    })),
});
