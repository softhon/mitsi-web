import { ActionType } from '@/types';
import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';

export interface ModalSlice {
  sharedMediaOpened: boolean;
  attendeesOpened: boolean;
  chatsOpened: boolean;
  paymentOpened: boolean;
  actionOpened: ActionType;
  settingsOpened: boolean;
  setSharedMediaOpened: (state: boolean) => void;
  setAttendeesOpened: (state: boolean) => void;
  setChatsOpened: (state: boolean) => void;
  setPaymentOpened: (showPayment: boolean) => void;
  setActionOpened: (action: ActionType) => void;
  setSettingsOpened: (showSettings: boolean) => void;
}

export const createModalSlice: StateCreator<
  StoreState,
  [],
  [],
  ModalSlice
> = set => ({
  sharedMediaOpened: false,
  attendeesOpened: false,
  chatsOpened: false,
  paymentOpened: false,
  actionOpened: ActionType.Hide,
  settingsOpened: false,
  setSharedMediaOpened: value =>
    set(state => ({
      ...state,
      modal: {
        ...state.modal,
        sharedMediaOpened: value,
      },
    })),
  setAttendeesOpened: value =>
    set(state => ({
      ...state,
      modal: {
        ...state.modal,
        attendeesOpened: value,
      },
    })),
  setChatsOpened: value =>
    set(state => ({
      ...state,
      modal: {
        ...state.modal,
        chatsOpened: value,
      },
    })),
  setPaymentOpened: value =>
    set(state => ({
      ...state,
      modal: {
        ...state.modal,
        paymentOpened: value,
      },
    })),
  setActionOpened: action =>
    set(state => ({
      ...state,
      modal: {
        ...state.modal,
        actionOpened: action,
      },
    })),
  setSettingsOpened: value =>
    set(state => ({
      ...state,
      modal: {
        ...state.modal,
        settingsOpened: value,
      },
    })),
});
