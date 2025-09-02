import type { StateCreator } from 'zustand';
import type { StoreState } from '../types';
import { isMobileDevice } from '@/lib/utils';

export interface DeviceSlice {
  agent: string;
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

const userAgent = navigator.userAgent || '';

export const createDeviceSlice: StateCreator<
  StoreState,
  [],
  [],
  DeviceSlice
> = () => ({
  agent: userAgent,
  isMobile: isMobileDevice(),
  isIOS: /iPad|iPhone|iPod/.test(userAgent),
  isAndroid: /Android/i.test(userAgent),
});
