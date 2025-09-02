import { useMemo } from 'react';
import { useStore } from './index';
// import { isModerator } from '@/utils/helpers';

// Mic hooks
export const useMicOn = () => useStore(state => state.mic.on);
export const useMicDeviceId = () => useStore(state => state.mic.deviceId);
export const useMicDevices = () => useStore(state => state.mic.devices);
export const useMicToggle = () => useStore(state => state.mic.toggle);
export const useMicActions = () =>
  useStore(state => ({
    setOn: state.mic.setOn,
    setDeviceId: state.mic.setDeviceId,
    setDevices: state.mic.setDevices,
    setToggle: state.mic.setToggle,
  }));

// Camera hooks
export const useCameraOn = () => useStore(state => state.camera.on);
export const useCameraDeviceId = () => useStore(state => state.camera.deviceId);
export const useCameraDevices = () => useStore(state => state.camera.devices);
export const useCameraToggle = () => useStore(state => state.camera.toggle);
export const useCameraActions = () =>
  useStore(state => ({
    setOn: state.camera.setOn,
    setDeviceId: state.camera.setDeviceId,
    setDevices: state.camera.setDevices,
    setToggle: state.camera.setToggle,
  }));

// screen sharing hooks
export const useScreenSharing = () => useStore(state => state.screen.sharing);
export const useScreenChange = () => useStore(state => state.screen.change);
export const useScreenStop = () => useStore(state => state.screen.stop);
export const useScreenActions = () =>
  useStore(state => ({
    setSharing: state.screen.setSharing,
    setChange: state.screen.setChange,
    setStop: state.screen.setStop,
  }));

// device hooks
export const useDeviceAgent = () => useStore(state => state.device.agent);
export const useDeviceIsMobile = () => useStore(state => state.device.isMobile);
export const useDeviceIsIOS = () => useStore(state => state.device.isIOS);
export const useDeviceIsAndroid = () =>
  useStore(state => state.device.isAndroid);

// sound hooks
export const useSoundDeviceId = () => useStore(state => state.sound.deviceId);
export const useSoundDevices = () => useStore(state => state.sound.devices);
export const useSoundActions = () =>
  useStore(state => ({
    setDeviceId: state.sound.setDeviceId,
    setDevices: state.sound.setDevices,
  }));

//hand hooks
export const useHandRaised = () => useStore(state => state.hand.raised);
export const useHandActions = () =>
  useStore(state => ({
    setRaised: state.hand.setRaised,
  }));

// peers hooks
export const usePeerSelfId = () => useStore(state => state.peers.self?.id);
export const usePeerSelf = () => useStore(state => state.peers.self);
export const usePeers = () => useStore(state => state.peers.others);
export const usePeersOrder = () => useStore(state => state.peers.idsOrder);
export const usePeersOrderIds = () => {
  const peerOrderIds = usePeersOrder();
  return useMemo(() => Object.keys(peerOrderIds), [peerOrderIds]);
};
export const usePeerSelfIsModerator = () => {
  // const peerSelf = usePeerSelf();
  // return !!useMemo(() => peerSelf && isModerator(peerSelf), [peerSelf?.roles]);
  return false;
};

export const usePeerValues = () => {
  const peers = usePeers();
  return useMemo(() => {
    const tagPriority: Record<string, number> = {
      self: 0,
      Host: 1,
      'Co-host': 2,
      Moderator: 3,
      Speaker: 4,
      Spotlighted: 5,
      Attendee: 6,
    };

    return Object.values(peers).sort((a, b) => {
      // Determine tags, defaulting to 'Attendee' if undefined
      const aTag = a.tag ?? 'Attendee';
      const bTag = b.tag ?? 'Attendee';

      // Compare by tag priority
      const tagComparison = tagPriority[aTag] - tagPriority[bTag];
      if (tagComparison !== 0) {
        return tagComparison;
      }

      // Within same tag, sort by name (ascending)
      return a.name.localeCompare(b.name);
    });
  }, [peers]);
};

export const usePeerIdsWithinView = () => {
  const peersOrderIds = usePeersOrderIds();
  const pageSize = usePaginagionPageSize();
  const currentPage = usePaginagionCurrentPage();
  const spotlightedPeers = usePeersSpotlighted();
  const hasPresentationView = usePeersIsPresenting();
  const spotlightedPeersId = spotlightedPeers.map(peer => peer.id);
  // console.log({ spotlightedPeersId })

  // console.log(peersOrderIds)
  return useMemo(() => {
    const start = (pageSize - 1) * (currentPage - 1);
    const end = (pageSize - 1) * currentPage;
    if (hasPresentationView) {
      // console.log("hasPresentationView ")
      return peersOrderIds.slice(start, end);
    } else {
      // console.log("no PresentationView ")
      return peersOrderIds
        .filter(id => !spotlightedPeersId.includes(id))
        .slice(start, end);
    }
  }, [
    peersOrderIds,
    pageSize,
    currentPage,
    spotlightedPeersId,
    hasPresentationView,
  ]);
};

export const usePeersSpotlighted = () => {
  const peerValues = usePeerValues();
  const peerSelf = usePeerSelf();
  return useMemo(() => {
    if (peerSelf?.spotlighted) {
      return [peerSelf, ...peerValues.filter(peer => peer.spotlighted)];
    }
    return peerValues.filter(peer => peer.spotlighted);
  }, [peerValues, peerSelf]);
};

export const usePeersScreenSharing = () => {
  const peerValues = usePeerValues();
  const peerSelf = usePeerSelf();

  return useMemo(() => {
    if (peerSelf?.screen) {
      return [peerSelf, ...peerValues.filter(peer => peer.screen)];
    }
    return peerValues.filter(peer => peer.screen);
  }, [peerValues, peerSelf]);
};

export const usePeersIsPresenting = () => {
  const peerValues = usePeerValues();
  const peerSelf = usePeerSelf();
  const shareMediaUrl = useSharedMediaUrl();

  return useMemo(() => {
    if (shareMediaUrl || peerSelf?.screen) return true;

    if (peerValues.find(peer => peer.screen)) return true;

    return false;
  }, [peerValues, peerSelf, shareMediaUrl]);
};

export const usePeersHandRaised = () => {
  const peerValues = usePeerValues();
  const peerSelf = usePeerSelf();

  return useMemo(() => {
    const raisedHandPeers = peerSelf?.hand?.raised
      ? [peerSelf, ...peerValues.filter(peer => peer.hand?.raised)]
      : peerValues.filter(peer => peer.hand?.raised);
    const sortWithTimestamp = raisedHandPeers.sort(
      (a, b) =>
        ((a.hand && a.hand.timestamp) || 0) -
        ((b.hand && b.hand.timestamp) || 0)
    );
    return sortWithTimestamp;
  }, [peerValues, peerSelf]);
};

export const usePeerLength = () => usePeerValues().length;
export const usePeerSelected = () => useStore(state => state.peers.selected);
export const usePeerSelectedAction = () =>
  useStore(state => state.peers.selectedAction);

export const usePeerActions = () =>
  useStore(state => ({
    setSelf: state.peers.setSelf,
    updateSelf: state.peers.updateSelf,
    addPeer: state.peers.add,
    updatePeer: state.peers.update,
    removePeer: state.peers.remove,
    clearPeer: state.peers.clear,
    swapIdsOrder: state.peers.swapIdsOrder,
    updateIdTimestamp: state.peers.updateIdTimestamp,
    setSelectedPeer: state.peers.setSelectedPeer,
  }));

// meeting hooks
export const useMeetingData = () => useStore(state => state.meeting.data);
export const useMeetingJoined = () => useStore(state => state.meeting.joined);
export const useMeetingStarted = () => useStore(state => state.meeting.started);
export const useMeetingEnded = () => useStore(state => state.meeting.ended);
export const useMeetingRecording = () =>
  useStore(state => state.meeting.recording);
export const useMeetingMaxPeers = () =>
  useStore(state => state.meeting.maxPeers);
export const useMeetingRemoved = () => useStore(state => state.meeting.removed);
export const useMeetingDisconnected = () =>
  useStore(state => state.meeting.disconnected);
export const useMeetingTimeLeft = () =>
  useStore(state => state.meeting.timeLeft);
export const useMeetingMirror = () => useStore(state => state.meeting.mirror);
export const useMeetingWaitingToStart = () =>
  useStore(state => state.meeting.waitingToStart);
export const useMeetingAllowWaiting = () =>
  useStore(state => state.meeting.allowWaiting);
export const useMeetingAccess = () => useStore(state => state.meeting.access);
export const useMeetingActiveSpeakerPeerId = () =>
  useStore(state => state.meeting.activeSpeakerPeerId);
export const useMeetingPresenterPeerId = () =>
  useStore(state => state.meeting.presenterPeerId);
export const useMeetingActions = () =>
  useStore(state => ({
    setData: state.meeting.setData,
    setJoined: state.meeting.setJoined,
    setStarted: state.meeting.setStarted,
    setEnded: state.meeting.setEnded,
    setRecording: state.meeting.setRecording,
    setMaxPeers: state.meeting.setMaxPeers,
    setRemoved: state.meeting.setRemoved,
    setDisconnected: state.meeting.setDisconnected,
    setTimeLeft: state.meeting.setTimeLeft,
    reduceTimeLeft: state.meeting.reduceTimeLeft,
    setMirror: state.meeting.setMirror,
    setWaitingToStart: state.meeting.setWaitingToStart,
    setAllowWaiting: state.meeting.setAllowWaiting,
    setAccess: state.meeting.setAccess,
    setActiveSpeakerPeerId: state.meeting.setActiveSpeakerPeerId,
    setPresenterPeerId: state.meeting.setPresenterPeerId,
  }));

// settings hooks
export const useSettingsActiveTab = () =>
  useStore(state => state.settings.activeTab);
export const useSettingsAttendeeJoinedAlert = () =>
  useStore(state => state.settings.attendeeJoinedAlert);
export const useSettingsAttendeeLeftAlert = () =>
  useStore(state => state.settings.attendeeLeftAlert);
export const useSettingsRequestToJoinAlert = () =>
  useStore(state => state.settings.requestToJoinAlert);
export const useSettingsNewChatAlert = () =>
  useStore(state => state.settings.newChatAlert);
export const useSettingsAttendeeJoinedSound = () =>
  useStore(state => state.settings.attendeeJoinedSound);
export const useSettingsRecordingSound = () =>
  useStore(state => state.settings.recordingSound);
export const useSettingsActions = () =>
  useStore(state => ({
    setActiveTab: state.settings.setActiveTab,
    setAttendeeJoinedAlert: state.settings.setAttendeeJoinedAlert,
    setAttendeeLeftAlert: state.settings.setAttendeeLeftAlert,
    setRequestToJoinAlert: state.settings.setRequestToJoinAlert,
    setNewChatAlert: state.settings.setNewChatAlert,
    setAttendeeJoinedSound: state.settings.setAttendeeJoinedSound,
    setRecordingSound: state.settings.setRecordingSound,
  }));

// pagination hooks
export const usePaginagionCurrentPage = () =>
  useStore(state => state.pagination.currentPage);
export const usePaginagionPageSize = () =>
  useStore(state => state.pagination.pageSize);
export const usePaginagionMaxPage = () =>
  useStore(state => state.pagination.maxPage);
export const usePaginagionActions = () =>
  useStore(state => ({
    setMaxPage: state.pagination.setMaxPage,
    setCurrentPage: state.pagination.setCurrentPage,
    setPageSize: state.pagination.setPageSize,
  }));

//chat hooks
export const useChatLatestChat = () =>
  useStore(state => state.chats.latestChat);
export const useChatPublic = () => useStore(state => state.chats.public);
export const useChatPublicValues = () => {
  const chatPublic = useChatPublic();
  return useMemo(() => Object.values(chatPublic), [chatPublic]);
};
export const useChatPrivate = () => useStore(state => state.chats.private);

export const useChatPrivateValues = () => {
  const chatPrivate = useChatPrivate();
  return useMemo(() => Object.values(chatPrivate), [chatPrivate]);
};
export const useChatPrivateOpened = () =>
  useStore(state => state.chats.privateOpened);
export const useChatOpenedPrivateChatPeer = () =>
  useStore(state => state.chats.openedPrivateChatPeer);
export const useChatUnreadPublic = () =>
  useStore(state => state.chats.unreadPublic);
export const useChatPrivateChatPeers = () =>
  useStore(state => state.chats.privateChatPeers);
export const useChatActions = () =>
  useStore(state => ({
    add: state.chats.add,
    setPrivateOpened: state.chats.setPrivateOpened,
    setOpenedPrivateChatPeer: state.chats.setOpenedPrivateChatPeer,
    setUnreadPublic: state.chats.setUnreadPublic,
    addUnreadPublic: state.chats.addUnreadPublic,
    addPrivateChatPeer: state.chats.addPrivateChatPeer,
  }));

// waiters hooks
export const useWaiters = () => useStore(state => state.waiters.records);
export const useWaitersValues = () => {
  const waiters = useWaiters();
  return useMemo(() => Object.values(waiters), [waiters]);
};
export const useWaitersActions = () =>
  useStore(state => ({
    add: state.waiters.add,
    update: state.waiters.update,
    remove: state.waiters.remove,
    clear: state.waiters.clear,
  }));

// shared media
export const useSharedMedia = () => useStore(state => state.sharedMedia);
export const useSharedMediaPeerId = () =>
  useStore(state => state.sharedMedia.peerId);
export const useSharedMediaUrl = () => useStore(state => state.sharedMedia.url);
export const useSharedMediaType = () =>
  useStore(state => state.sharedMedia.type);
export const useSharedMediaPaused = () =>
  useStore(state => state.sharedMedia.paused);
export const useSharedMediaTime = () =>
  useStore(state => state.sharedMedia.time);
export const useSharedMediaActions = () =>
  useStore(state => ({
    set: state.sharedMedia.set,
    update: state.sharedMedia.update,
    clear: state.sharedMedia.clear,
  }));

// modal hooks
export const useModalSharedMediaOpened = () =>
  useStore(state => state.modal.sharedMediaOpened);
export const useModalAttendeesOpened = () =>
  useStore(state => state.modal.attendeesOpened);
export const useModalChatsOpened = () =>
  useStore(state => state.modal.chatsOpened);
export const useModalPaymentOpened = () =>
  useStore(state => state.modal.paymentOpened);
export const useModalActionOpened = () =>
  useStore(state => state.modal.actionOpened);
export const useModalSettingsOpened = () =>
  useStore(state => state.modal.settingsOpened);
export const useModalActions = () =>
  useStore(state => ({
    setSharedMediaOpened: state.modal.setSharedMediaOpened,
    setAttendeesOpened: state.modal.setAttendeesOpened,
    setChatsOpened: state.modal.setChatsOpened,
    setPaymentOpened: state.modal.setPaymentOpened,
    setActionOpened: state.modal.setActionOpened,
    setSettingsOpened: state.modal.setSettingsOpened,
  }));

// reactions hooks

export const useReactionsOpen = () => useStore(state => state.reactions.open);
export const useReactionsEmojis = () =>
  useStore(state => state.reactions.emojis);
export const useReactionsActions = () =>
  useStore(state => ({
    add: state.reactions.add,
    setOpen: state.reactions.setOpen,
    clear: state.reactions.clear,
  }));
