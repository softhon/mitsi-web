// Granular selectors for maximum performance

import { useMemo } from 'react';
import { useConfStore } from '.';

// ============================================================================
// MIC SELECTORS
// ============================================================================
export const useMicOn = () => useConfStore(state => state.mic.on);
export const useMicDeviceId = () => useConfStore(state => state.mic.deviceId);
export const useMicDevices = () => useConfStore(state => state.mic.devices);
export const useMicActions = () =>
  useMemo(
    () => ({
      toggle: useConfStore.getState().mic.toggle,
      setDeviceId: useConfStore.getState().mic.setDeviceId,
      setDevices: useConfStore.getState().mic.setDevices,
    }),
    []
  );

// ============================================================================
// CAMERA SELECTORS
// ============================================================================
export const useCameraOn = () => useConfStore(state => state.camera.on);
export const useCameraDeviceId = () =>
  useConfStore(state => state.camera.deviceId);
export const useCameraDevices = () =>
  useConfStore(state => state.camera.devices);
export const useCameraActions = () =>
  useMemo(
    () => ({
      toggle: useConfStore.getState().camera.toggle,
      setDeviceId: useConfStore.getState().camera.setDeviceId,
      setDevices: useConfStore.getState().camera.setDevices,
    }),
    []
  );

// ============================================================================
// PEER SELECTORS
// ============================================================================
