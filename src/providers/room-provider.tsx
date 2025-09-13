import { useMedia } from '@/hooks/use-media';
import { useSignaling } from '@/hooks/use-signaling';
import { ValidationSchema } from '@/lib/schema';
import { usePeerActions } from '@/store/conf/hooks';
import type { AckCallbackData, MessageData } from '@/types';
import { Actions } from '@/types/actions';
import { useEffect, type ReactNode } from 'react';

const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { signalingService } = useSignaling();
  const { mediaService } = useMedia();
  const peerActions = usePeerActions();
  useEffect(() => {
    if (!signalingService || !mediaService) return;

    signalingService
      .getConnection()
      .on(
        Actions.Message,
        async (data: MessageData, callback: AckCallbackData) => {
          const { action, args = {} } = data;
          console.log(Actions.Message, 'Got a message');
          console.log(Actions.Message, args);
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
    [Actions.PeerAdded]: async args => {
      const data = ValidationSchema.peerData.parse(args);
      peerActions.addData(data);
      console.log(Actions.PeerAdded, args);
    },

    [Actions.PeerLeft]: async args => {
      const data = ValidationSchema.peerId.parse(args);
      peerActions.remove(data.id);
    },
  };

  return <div>{children}</div>;
};

export default RoomProvider;
