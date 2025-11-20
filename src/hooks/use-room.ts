import {
  useChatActions,
  usePeerActions,
  usePeerMe,
  useRoomAccess,
  useRoomData,
} from '@/store/conf/hooks';
import { useCallback, useMemo } from 'react';
import {
  Access,
  type AckCallbackData,
  type PeerData,
  type RoomData,
} from '@/types';
import { Actions } from '@/types/actions';
import { useSignaling } from './use-signaling';
import { useMedia } from './use-media';
import { ValidationSchema } from '@/lib/schema';
import { getPeerId } from '@/lib/utils';

export const useRoom = () => {
  const { signalingService } = useSignaling();
  const {
    mediaService,
    createConsumer,
    pauseConsumer,
    closeConsumer,
    resumeConsumer,
  } = useMedia();
  const peerActions = usePeerActions();
  const peerMe = usePeerMe();
  const roomData = useRoomData();
  const roomAccess = useRoomAccess();
  const chatActions = useChatActions();

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
      if (!peerMe || !roomData?.roomId || !signalingService || !mediaService)
        return;
      const result = await signalingService.sendMessage<{
        you: PeerData;
        peers: PeerData[];
        roomData: RoomData;
      }>({
        action: Actions.JoinRoom,
        args: {
          roomId: roomData.roomId,
          peerData: peerMe,
          deviceRtpCapabilities: mediaService.getDeviceRtpCapabilities(),
          isRejoining,
        },
      });

      const peers = result?.peers;
      peerActions.clear();
      if (peers) {
        peerActions.addOthersData(peers);
      }
    },
    [
      peerMe,
      signalingService,
      mediaService,
      roomAccess,
      peerActions,
      roomData?.roomId,
    ]
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
        console.log(data);
        chatActions.addChat(data);
      },
    }),
    [
      closeConsumer,
      createConsumer,
      pauseConsumer,
      peerActions,
      resumeConsumer,
      chatActions,
    ]
  );

  return { joinVisitors, joinRoom, leaveRoom, actionHandlers };
};
