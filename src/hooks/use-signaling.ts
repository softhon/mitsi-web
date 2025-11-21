import { useCallback } from 'react';
import { useServices } from './use-services';
import type { MessageData } from '@/types';
import { Actions } from '@/types/actions';

// Hook for signaling operations
export const useSignaling = () => {
  const { signalingService, isInitializing, error } = useServices();

  const sendHeartBeat = useCallback(() => {
    if (!signalingService) throw new Error('SignalingService not initialized');
    signalingService.sendMessage({
      action: Actions.Heartbeat,
    });
  }, [signalingService]);

  const sendMessage = useCallback(
    async <T = { [key: string]: unknown }>(
      message: MessageData
    ): Promise<T | undefined> => {
      if (!signalingService)
        throw new Error('SignalingService not initialized');
      return await signalingService.sendMessage<T | undefined>(message);
    },
    [signalingService]
  );

  const isConnected = useCallback(() => {
    return signalingService?.isConnected() ?? false;
  }, [signalingService]);

  const getConnection = useCallback(() => {
    if (!signalingService) throw new Error('SignalingService not initialized');
    return signalingService.getConnection();
  }, [signalingService]);

  const getConnectionState = useCallback(() => {
    return signalingService?.getConnectionState();
  }, [signalingService]);

  return {
    signalingService,
    isInitializing,
    error,
    sendHeartBeat,
    sendMessage,
    isConnected,
    getConnection,
    getConnectionState,
  };
};
