import { useMedia } from '@/hooks/use-media';
import { useRoom } from '@/hooks/use-room';
import { useSignaling } from '@/hooks/use-signaling';
import { useRoomAccess } from '@/store/conf/hooks';
import { Access, type AckCallbackData, type MessageData } from '@/types';
import { Actions } from '@/types/actions';
import { useEffect, type ReactNode } from 'react';

const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { signalingService } = useSignaling();
  const { mediaService, createWebRtcConnections } = useMedia();
  const roomAccess = useRoomAccess();
  const { joinRoom, actionHandlers } = useRoom();

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
          const { action, args = {} } = data;
          console.log(Actions.Message, args);
          const handler = actionHandlers[action as Actions];
          if (handler) handler(args, callback);
        }
      );
  }, [signalingService, mediaService, actionHandlers]);

  useEffect(() => {
    if (roomAccess !== Access.Allowed) return;
    const setup = async () => {
      try {
        await joinRoom();
        console.log('join room');

        await createWebRtcConnections();
        console.log('Set up room');
      } catch (error) {
        console.log(error);
      }
    };
    setup();
  }, [roomAccess]);

  return <div>{children}</div>;
};

export default RoomProvider;
