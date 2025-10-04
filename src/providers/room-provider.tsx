import { useMedia } from '@/hooks/use-media';
import { useRoom } from '@/hooks/use-room';
import { useSignaling } from '@/hooks/use-signaling';
import { HEARTBEAT_INTERVAL } from '@/lib/constants';
import { useRoomAccess } from '@/store/conf/hooks';
import { Access, type AckCallbackData, type MessageData } from '@/types';
import { Actions } from '@/types/actions';
import { useEffect, useRef, type ReactNode } from 'react';

const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { signalingService, sendHeartBeat } = useSignaling();
  const { mediaService, createWebRtcConnections } = useMedia();
  const heartBeatIntervalRef = useRef<NodeJS.Timeout>(null);
  const roomAccess = useRoomAccess();
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
            console.log(Actions.Message, args, 'callback', callback);
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
      // register heartbeat interval
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

  return <div>{children}</div>;
};

export default RoomProvider;
