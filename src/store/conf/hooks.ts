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
export const usePeerMe = () => useConfStore(state => state.peers.me);
export const usePeerOthers = () => useConfStore(state => state.peers.others);
export const usePeerOthersKeys = () => {
  const peerOthers = usePeerOthers();
  return useMemo(() => {
    return Object.keys(peerOthers);
  }, [peerOthers]);
};
export const usePeerOthersValues = () => {
  const peerOthers = usePeerOthers();
  return useMemo(() => {
    return Object.values(peerOthers);
  }, [peerOthers]);
};
export const usePeerMedias = () => useConfStore(state => state.peers.medias);
export const usePeerMediasById = (id: string) =>
  useConfStore(state => state.peers.medias[id]);
export const usePeerConditionsById = (id: string) =>
  useConfStore(state => state.peers.conditions[id]);
export const usePeerConditions = () =>
  useConfStore(state => state.peers.conditions);
export const usePeerPosition = () =>
  useConfStore(state => state.peers.positions);
export const usePeerActions = () =>
  useMemo(
    () => ({
      addData: useConfStore.getState().peers.addData,
      addOthersData: useConfStore.getState().peers.addOthersData,
      updateData: useConfStore.getState().peers.updateData,
      updateMedia: useConfStore.getState().peers.updateMedia,
      updateCondition: useConfStore.getState().peers.updateCondition,
      updateLastActiveSpeechTimestamp:
        useConfStore.getState().peers.updateLastActiveSpeechTimestamp,
      swapPositions: useConfStore.getState().peers.swapPositions,
      remove: useConfStore.getState().peers.remove,
      clear: useConfStore.getState().peers.clear,
    }),
    []
  );

// ============================================================================
// ROOM SELECTORS
// ============================================================================
export const useRoomData = () => useConfStore(state => state.room.data);
export const useRoomAccess = () => useConfStore(state => state.room.access);
export const useRoomActions = () =>
  useMemo(
    () => ({
      setData: useConfStore.getState().room.setData,
      setAccess: useConfStore.getState().room.setAccess,
    }),
    []
  );
