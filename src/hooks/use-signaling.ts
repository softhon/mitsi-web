import { useCallback } from 'react';
import { useServices } from './use-services';
import type { MessageData } from '@/types';

// Hook for signaling operations
export const useSignaling = () => {
  const { signalingService, isInitializing, error } = useServices();

  const sendMessage = useCallback(
    async <T = { [key: string]: unknown }>(
      message: MessageData
    ): Promise<T> => {
      if (!signalingService)
        throw new Error('SignalingService not initialized');
      return await signalingService.message<T>(message);
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
    sendMessage,
    isConnected,
    getConnection,
    getConnectionState,
  };
};
