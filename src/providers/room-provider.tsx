import { useMedia } from '@/hooks/use-media';
import { useSignaling } from '@/hooks/use-signaling';
import { ValidationSchema } from '@/lib/schema';
import { usePeerActions } from '@/store/conf/hooks';
import type { AckCallbackData, MessageData } from '@/types';
import { Actions } from '@/types/actions';
import { useEffect, type ReactNode } from 'react';

const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { signalingService } = useSignaling();
  const {
    mediaService,
    createConsumer,
    pauseConsumer,
    closeConsumer,
    resumeConsumer,
  } = useMedia();
  const peerActions = usePeerActions();
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
      callback: (data: AckCallbackData) => void
    ) => void;
  } = {
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
      console.log(Actions.ConsumerCreated, data);
      callback({ status: 'success' });
    },

    [Actions.ConsumerPaused]: async args => {
      const data = ValidationSchema.consumerStateData.parse(args);
      pauseConsumer(data);
      console.log(Actions.ConsumerPaused, data);
    },
    [Actions.ConsumerResumed]: async args => {
      const data = ValidationSchema.consumerStateData.parse(args);
      resumeConsumer(data);
      console.log(Actions.ConsumerResumed, data);
    },
    [Actions.ConsumerClosed]: async args => {
      const data = ValidationSchema.consumerStateData.parse(args);
      closeConsumer(data);
      console.log(Actions.ConsumerPaused, data);
    },
  };

  return <div>{children}</div>;
};

export default RoomProvider;
