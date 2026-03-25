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
// SCREEN SELECTORS
// ============================================================================
export const useScreenOn = () => useConfStore(state => state.screen.on);
export const useScreenActions = () =>
  useMemo(
    () => ({
      toggle: useConfStore.getState().screen.toggle,
    }),
    []
  );

// ============================================================================
// PEER SELECTORS
// ============================================================================
export const usePeerMe = () => useConfStore(state => state.peers.me);
export const usePeerOthers = () => useConfStore(state => state.peers.others);
export const usePeerScreens = () => useConfStore(state => state.peers.screens);
export const usePeerSelectedId = () =>
  useConfStore(state => state.peers.selectedId);
export const usePeerOthersById = (id: string) =>
  useConfStore(state => state.peers.others[id]);

// Optimized: Direct access to peerIds Set (O(1))
export const usePeerIds = () => {
  const peerIds = useConfStore(state => state.peers.peerIds);
  return useMemo(() => Array.from(peerIds), [peerIds]);
};

// Optimized: Direct count from Set size
export const usePeerCount = () =>
  useConfStore(state => state.peers.peerIds.size + 1); // +1 for me

// Legacy hooks (kept for backward compatibility, but prefer usePeerIds)
export const usePeerOthersKeys = () => {
  const peerOthers = usePeerOthers();
  return useMemo(() => {
    return Object.keys(peerOthers);
  }, [peerOthers]);
};
export const usePeersCount = () => {
  const peerKeys = usePeerOthersKeys();
  return useMemo(() => {
    return peerKeys.length + 1; // 1 is current speaker
  }, [peerKeys]);
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
      addScreen: useConfStore.getState().peers.addScreen,
      removeScreen: useConfStore.getState().peers.removeScreen,
      setSelectedId: useConfStore.getState().peers.setSelectedId,
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
export const useRoomReconnecting = () =>
  useConfStore(state => state.room.reconnecting);
export const useRoomDisconnected = () =>
  useConfStore(state => state.room.disconnected);
export const useRoomRecording = () =>
  useConfStore(state => state.room.recording);
export const useRoomLocked = () =>
  useConfStore(state => state.room.locked);
export const useRoomActions = () =>
  useMemo(
    () => ({
      setData: useConfStore.getState().room.setData,
      setAccess: useConfStore.getState().room.setAccess,
      setReconnecting: useConfStore.getState().room.setReconnecting,
      setDisconnected: useConfStore.getState().room.setDisconnected,
      setGridDimensions: useConfStore.getState().room.setGridDimensions,
      setMaxPeerPerPage: useConfStore.getState().room.setMaxPeerPerPage,
      setRecording: useConfStore.getState().room.setRecording,
      setLocked: useConfStore.getState().room.setLocked,
    }),
    []
  );

// ============================================================================
// GRID SELECTORS
// ============================================================================
export const useGridHeight = () =>
  useConfStore(state => state.grid.size.height);
export const useGridWidth = () => useConfStore(state => state.grid.size.width);
export const useGridActions = () =>
  useMemo(
    () => ({
      setSize: useConfStore.getState().grid.setSize,
    }),
    []
  );

// ============================================================================
// MODAL SELECTORS
// ============================================================================
export const useModalChatOpen = () =>
  useConfStore(state => state.modal.chatOpen);
export const useModalParticipantsOpen = () =>
  useConfStore(state => state.modal.participantsOpen);
export const useModalActions = () =>
  useMemo(
    () => ({
      toggleChatOpen: useConfStore.getState().modal.toggleChatOpen,
      toggleParticipantOpen:
        useConfStore.getState().modal.toggleParticipantOpen,
      closeChatAndParticipant:
        useConfStore.getState().modal.closeChatAndParticipant,
    }),
    []
  );

// ============================================================================
// CHAT SELECTORS
// ============================================================================

export const useChats = () => useConfStore(state => state.chat.chats);
export const useDmChats = () => useConfStore(state => state.chat.dmChats);
export const useUnreadDm = () => useConfStore(state => state.chat.unreadDm);
export const useChatActions = () =>
  useMemo(
    () => ({
      addChat: useConfStore.getState().chat.add,
      addDmChat: useConfStore.getState().chat.addDmChat,
      clearUnread: useConfStore.getState().chat.clearUnread,
    }),
    []
  );

// ============================================================================
// SETTINGS SELECTORS
// ============================================================================

export const useSettingsOpen = () => useConfStore(state => state.settings.open);
export const useSettingsNotification = () =>
  useConfStore(state => state.settings.notifications);
export const useSettingsNoiseSuppression = () =>
  useConfStore(state => state.settings.noiseSuppression);
export const useSettingsBackgroundMode = () =>
  useConfStore(state => state.settings.backgroundMode);
export const useSettingsBackgroundImage = () =>
  useConfStore(state => state.settings.backgroundImage);
export const useBackgroundTrackVersion = () =>
  useConfStore(state => state.settings.backgroundTrackVersion);
export const useSettingsActions = () =>
  useMemo(
    () => ({
      toggle: useConfStore.getState().settings.toggle,
      toggleNotification: useConfStore.getState().settings.toggleNotification,
      toggleNoiseSuppression: useConfStore.getState().settings.toggleNoiseSuppression,
      setBackgroundMode: useConfStore.getState().settings.setBackgroundMode,
      setBackgroundImage: useConfStore.getState().settings.setBackgroundImage,
      bumpBackgroundTrackVersion: useConfStore.getState().settings.bumpBackgroundTrackVersion,
    }),
    []
  );

// ============================================================================
// EmojiReactions SELECTORS
// ============================================================================

export const useReactionsEmojis = () =>
  useConfStore(state => state.reactions.emojis);

export const useReactionsActions = () =>
  useMemo(
    () => ({
      add: useConfStore.getState().reactions.add,
      clear: useConfStore.getState().reactions.clear,
    }),
    []
  );

// ============================================================================
// HAND SELECTORS
// ============================================================================
export const useHandRaised = () => useConfStore(state => state.hand.raised);
export const useHandActions = () =>
  useMemo(
    () => ({
      toggle: useConfStore.getState().hand.toggle,
    }),
    []
  );

// ============================================================================
// CAUTION SELECTORS
// ============================================================================
export const useCautionActive = () =>
  useConfStore(state => state.caution.active);
export const useCautionActions = () =>
  useMemo(
    () => ({
      set: useConfStore.getState().caution.set,
    }),
    []
  );

// ============================================================================
// FULLSCREEN SELECTORS
// ============================================================================
export const useFullscreenActive = () =>
  useConfStore(state => state.fullscreen.active);
export const useFullscreenActions = () =>
  useMemo(
    () => ({
      set: useConfStore.getState().fullscreen.set,
    }),
    []
  );

// ============================================================================
// SPEAKING SELECTORS
// ============================================================================
export const useSpeakingState = () =>
  useConfStore(state => state.speaking?.speaking ?? {});
export const useIsSpeaking = (peerId: string) =>
  useConfStore(state => state.speaking?.speaking?.[peerId] ?? false);
export const useSpeakingActions = () =>
  useMemo(
    () => ({
      setSpeaking: useConfStore.getState().speaking?.setSpeaking,
      clearSpeaking: useConfStore.getState().speaking?.clearSpeaking,
      clearAllSpeaking: useConfStore.getState().speaking?.clearAllSpeaking,
    }),
    []
  );

// ============================================================================
// LAYOUT SELECTORS
// ============================================================================
export const useLayoutMode = () => useConfStore(state => state.layout.mode);
export const useLayoutActions = () =>
  useMemo(
    () => ({
      setMode: useConfStore.getState().layout.setMode,
      toggleMode: useConfStore.getState().layout.toggleMode,
    }),
    []
  );

// ============================================================================
// WAITERS SELECTORS
// ============================================================================
export const useWaiters = () => useConfStore(state => state.waiters.waiters);
export const useWaiterCount = () =>
  useConfStore(state => state.waiters.waiters.length);
export const useWaitersActions = () =>
  useMemo(
    () => ({
      setWaiters: useConfStore.getState().waiters.setWaiters,
      addWaiter: useConfStore.getState().waiters.addWaiter,
      removeWaiter: useConfStore.getState().waiters.removeWaiter,
      clearWaiters: useConfStore.getState().waiters.clearWaiters,
    }),
    []
  );
