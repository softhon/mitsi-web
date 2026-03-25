import {
  useChatActions,
  usePeerActions,
  usePeerMe,
  useReactionsActions,
  useRoomAccess,
  useRoomActions,
  useRoomData,
  useWaitersActions,
} from '@/store/conf/hooks';
import { useCallback, useMemo, useRef } from 'react';
import {
  Access,
  Role,
  type AckCallbackData,
  type EmojiReaction,
  type PeerData,
  type RoomData,
} from '@/types';
import { Actions } from '@/types/actions';
import { useSignaling } from './use-signaling';
import { useMedia } from './use-media';
import { ValidationSchema } from '@/lib/schema';
import { getPeerId } from '@/lib/utils';
import { toast } from 'sonner';
import { createElement } from 'react';
import WaiterToast from '@/components/room/waiter-toast';

export const useRoom = () => {
  const { signalingService } = useSignaling();
  const {
    mediaService,
    createConsumer,
    pauseConsumer,
    closeConsumer,
    resumeConsumer,
    pauseProducer,
  } = useMedia();
  const peerActions = usePeerActions();
  const peerMe = usePeerMe();
  const roomData = useRoomData();
  const roomAccess = useRoomAccess();
  const roomActions = useRoomActions();
  const chatActions = useChatActions();
  const reactionsActions = useReactionsActions();
  const waitersActions = useWaitersActions();

  // Use a ref so joinRoom can always read the latest peerMe without
  // being recreated every time peerMe changes (which would cause
  // room-provider's useEffect to re-run and re-join, closing existing peers).
  const peerMeRef = useRef(peerMe);
  peerMeRef.current = peerMe;

  const joinVisitors = useCallback(async () => {
    if (!signalingService || !roomData) return;

    peerActions.clear();
    const res = await signalingService.sendMessage<{ peers: PeerData[] }>({
      action: Actions.JoinVisitors,
      args: {
        roomId: roomData.roomId,
        peerId: getPeerId(),
      },
    });
    for (const peer of res?.peers || []) {
      peerActions.addData(peer);
    }
  }, [peerActions, signalingService, roomData]);

  const joinRoom = useCallback(
    async (isRejoining?: boolean) => {
      if (roomAccess !== Access.Allowed) return;
      if (!peerMeRef.current || !roomData?.roomId || !signalingService || !mediaService)
        return;
      const result = await signalingService.sendMessage<{
        you: PeerData;
        peers: PeerData[];
        roomData: RoomData;
      }>({
        action: Actions.JoinRoom,
        args: {
          roomId: roomData.roomId,
          peerData: peerMeRef.current,
          deviceRtpCapabilities: mediaService.getDeviceRtpCapabilities(),
          isRejoining,
        },
      });

      // Update "me" with server-assigned tag/roles (host vs participant)
      if (result?.you) {
        peerActions.addData({ ...peerMeRef.current, ...result.you }, true);
      }

      const peers = result?.peers;
      peerActions.clear();
      if (peers) {
        peerActions.addOthersData(peers);
      }
    },
    // peerMe intentionally excluded — accessed via peerMeRef to avoid
    // recreating this callback (and re-triggering room-provider's join effect)
    // every time the server returns updated tag/roles for the current user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signalingService, mediaService, roomAccess, peerActions, roomData?.roomId]
  );

  const joinWaiters = useCallback(
    async (peerData: PeerData): Promise<{ wasAParticipant: boolean }> => {
      if (!signalingService || !roomData?.roomId)
        return { wasAParticipant: false };
      const result = await signalingService.sendMessage<{
        wasAParticipant: boolean;
      }>({
        action: Actions.JoinWaiters,
        args: {
          roomId: roomData.roomId,
          peerId: peerData.id,
          peerData,
        },
      });
      return { wasAParticipant: result?.wasAParticipant ?? false };
    },
    [signalingService, roomData?.roomId]
  );

  const leaveRoom = useCallback(() => {
    if (!signalingService) return;
    signalingService.sendMessage({
      action: Actions.LeaveRoom,
    });
  }, [signalingService]);

  const actionHandlers: {
    [key in Actions]?: (
      args: { [key: string]: unknown },
      callback: (data: AckCallbackData) => void
    ) => void;
  } = useMemo(
    () => ({
      [Actions.PeerAdded]: async args => {
        const data = ValidationSchema.peerData.parse(args);
        peerActions.addData(data);
      },

      [Actions.PeerLeft]: async args => {
        const data = ValidationSchema.peerId.parse(args);
        peerActions.remove(data.id);
      },

      [Actions.ConsumerCreated]: async (args, callback) => {
        const data = ValidationSchema.createConsumerData.parse(args);
        await createConsumer(data);
        callback({ status: 'success' });
      },

      [Actions.ConsumerPaused]: async args => {
        const data = ValidationSchema.consumerStateData.parse(args);
        pauseConsumer(data);
      },
      [Actions.ConsumerResumed]: async args => {
        const data = ValidationSchema.consumerStateData.parse(args);
        resumeConsumer(data);
      },
      [Actions.ConsumerClosed]: async args => {
        const data = ValidationSchema.consumerStateData.parse(args);
        closeConsumer(data);
      },
      [Actions.SendChat]: async args => {
        const data = ValidationSchema.sendChat.parse(args);
        if (data.isPrivate) {
          // Determine the "other" peer: if I sent it, other is receiver; if I received it, other is sender
          const myId = peerMeRef.current?.id;
          const isMine = data.sender.id === myId;
          const otherPeer = isMine ? data.receiver : data.sender;
          if (otherPeer?.id) chatActions.addDmChat(otherPeer.id, data, isMine);
        } else {
          chatActions.addChat(data);
        }
      },

      [Actions.SendReaction]: async args => {
        const data = ValidationSchema.sendReaction.parse(args);
        reactionsActions.add(data as EmojiReaction);
      },

      [Actions.RaiseHand]: async args => {
        const data = ValidationSchema.raiseHand.parse(args);
        peerActions.updateCondition(data.peer.id, { hand: data.hand });
      },

      [Actions.RecordingChanged]: async args => {
        roomActions.setRecording((args as { recording: boolean }).recording);
      },

      [Actions.RoomLockChanged]: async args => {
        roomActions.setLocked((args as { locked: boolean }).locked);
      },

      // Waiter is admitted by host — proceed to join the room
      [Actions.Admitted]: async () => {
        roomActions.setAccess(Access.Allowed);
      },

      // Waiter was declined by host
      [Actions.Declined]: async () => {
        roomActions.setAccess(Access.Declined);
      },

      // Host receives notification that a new waiter is waiting
      [Actions.WaiterAdded]: async args => {
        const waiter = args.waiter as PeerData;
        if (!waiter?.id) return;
        waitersActions.addWaiter(waiter);

        // Only show the admit/decline popup to moderators
        if (!peerMeRef.current?.roles?.includes(Role.Moderator)) return;

        toast.custom(
          t =>
            createElement(WaiterToast, {
              waiter,
              toastId: t,
              signalingService: signalingService!,
              onRemoveWaiter: waitersActions.removeWaiter,
            }),
          { duration: Infinity, position: 'top-right' }
        );
      },

      // Admin force-muted this peer
      [Actions.Mute]: async () => {
        pauseProducer?.('mic');
      },

      // Admin forced camera off for this peer
      [Actions.OffCamera]: async () => {
        pauseProducer?.('camera');
      },
    }),
    [
      closeConsumer,
      createConsumer,
      pauseConsumer,
      peerActions,
      resumeConsumer,
      chatActions,
      reactionsActions,
      roomActions,
      waitersActions,
      pauseProducer,
      signalingService,
    ]
  );

  return { joinVisitors, joinWaiters, joinRoom, leaveRoom, actionHandlers };
};
