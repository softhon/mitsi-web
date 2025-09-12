import { useMedia } from '@/hooks/use-media';
import { useSignaling } from '@/hooks/use-signaling';
import type { AckCallbackData, MessageData } from '@/types';
import { Actions } from '@/types/actions';
import { useEffect, type ReactNode } from 'react';

const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { signalingService } = useSignaling();
  const { mediaService } = useMedia();

  useEffect(() => {
    if (!signalingService || !mediaService) return;

    signalingService
      .getConnection()
      .on(
        Actions.Message,
        async (data: MessageData, callback: AckCallbackData) => {
          const { action, args = {} } = data;
          const handler = actionHandlers[action as Actions];
          if (handler) handler(args, callback);
        }
      );
  }, [signalingService, mediaService]);

  const actionHandlers: {
    [key in Actions]?: (
      args: { [key: string]: unknown },
      callback: AckCallbackData
    ) => void;
  } = {
    [Actions.PeerAdded]: async (args, callback) => {
      console.log('Peer Added');
    },

    [Actions.PeerLeft]: async (args, callback) => {
      console.log('Peer Left');
    },
  };

  return <div>{children}</div>;
};

export default RoomProvider;
