import { useMedia } from '@/hooks/use-media';
import { useRoom } from '@/hooks/use-room';
import { useSignaling } from '@/hooks/use-signaling';
import { HEARTBEAT_INTERVAL } from '@/lib/constants';
import { useRoomAccess, useRoomActions } from '@/store/conf/hooks';
import { Access, type AckCallbackData, type MessageData } from '@/types';
import { Actions } from '@/types/actions';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';

const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { signalingService, sendHeartBeat } = useSignaling();
  const {
    mediaService,
    createWebRtcConnections,
    closeAllConsumers,
    closeAllTransports,
    closeAllProducers,
    produceUserMedia,
  } = useMedia();
  const reconnectionToastRef = useRef<string | number>(0);

  const heartBeatIntervalRef = useRef<NodeJS.Timeout>(null);
  const roomAccess = useRoomAccess();
  const roomActions = useRoomActions();
  const [rejoining, setRejoining] = useState(false);
  const [produceLocalMedia, setProduceLocalMedia] = useState(false);
  const { joinRoom, leaveRoom, actionHandlers } = useRoom();

  useEffect(() => {
    if (!signalingService || !mediaService) return;

    signalingService
      .getConnection()
      .on(
        Actions.Message,
        async (
          data: MessageData,
          callback: (data: AckCallbackData) => void
        ) => {
          try {
            const { action, args = {} } = data;
            const handler = actionHandlers[action as Actions];
            if (handler) handler(args, callback);
            else
              console.log(`no handler for for action ${action} args =>`, args);
          } catch (error) {
            console.log(error);
          }
        }
      );
  }, [signalingService, mediaService, actionHandlers]);

  useEffect(() => {
    if (roomAccess !== Access.Allowed) return;
    (async () => {
      await joinRoom();
      await createWebRtcConnections();

      setProduceLocalMedia(true);

      heartBeatIntervalRef.current = setInterval(
        sendHeartBeat,
        HEARTBEAT_INTERVAL
      );

      addEventListener('unload', leaveRoom);
    })().catch(err => console.log(err));

    return () => {
      if (heartBeatIntervalRef.current)
        clearInterval(heartBeatIntervalRef.current);
    };
  }, [roomAccess, createWebRtcConnections, joinRoom, sendHeartBeat, leaveRoom]);

  useEffect(() => {
    if (roomAccess !== Access.Allowed) return;
    if (!rejoining) return;
    (async () => {
      // closeAllProducers();
      closeAllConsumers();
      closeAllTransports();

      await joinRoom(rejoining);
      await createWebRtcConnections();
      setRejoining(false);
      setProduceLocalMedia(true);

      if (reconnectionToastRef.current)
        toast.dismiss(reconnectionToastRef.current);

      toast.success(`Your connection is restored and  you're reconnected`, {
        closeButton: true,
        position: 'bottom-center',
        richColors: true,
      });
    })().catch(err => console.log(err));
  }, [
    rejoining,
    roomAccess,
    joinRoom,
    leaveRoom,
    createWebRtcConnections,
    closeAllConsumers,
    closeAllTransports,
    closeAllProducers,
  ]);

  // produce on join
  useEffect(() => {
    if (roomAccess !== Access.Allowed) return;
    if (!produceLocalMedia) return;
    (async () => {
      await produceUserMedia();
      setProduceLocalMedia(false);
    })();
  }, [roomAccess, produceLocalMedia, produceUserMedia]);

  useEffect(() => {
    if (!signalingService) return;
    if (roomAccess !== Access.Allowed) return;

    const connection = signalingService.getConnection();
    // TODO - NEXT LINE OF ACTIONS
    connection.on('disconnect', () => {
      if (connection.active) {
        if (reconnectionToastRef.current)
          toast.dismiss(reconnectionToastRef.current);

        reconnectionToastRef.current = toast.loading(
          `You're disconnected. Attempting to reconnect`,
          {
            position: 'bottom-center',
            richColors: true,
          }
        );
        // Attempt to reconnect
        roomActions.setReconnecting(true);
      } else {
        window.location.reload();
      }
    });

    connection.io.on('reconnect', () => {
      roomActions.setReconnecting(false);
      setRejoining(true);
    });
    return () => {
      // Cleanup on unmount
    };
  }, [signalingService, roomAccess, roomActions]);

  return <div>{children}</div>;
};

export default RoomProvider;
