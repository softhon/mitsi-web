import { types as mediasoupTypes } from 'mediasoup-client';
import { ServiceContext } from '@/context/service-context';
import type { ProducerSource } from '@/types';
import { useCallback, useContext } from 'react';

// Main hook to access services
export const useServices = () => {
  const context = useContext(ServiceContext);
  if (!context) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  return context;
};

export const useMedia = () => {
  const { mediaService, isInitializing, error } = useServices();

  const createProducer = useCallback(
    async (
      track: MediaStreamTrack,
      source: ProducerSource,
      appData?: mediasoupTypes.AppData
    ) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.createProducer(track, source, appData);
    },
    [mediaService]
  );

  const pauseProducer = useCallback(
    async (source: ProducerSource) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.pauseProducer(source);
    },
    [mediaService]
  );

  const resumeProducer = useCallback(
    async (source: ProducerSource) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.resumeProducer(source);
    },
    [mediaService]
  );

  const closeProducer = useCallback(
    async (source: ProducerSource) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.closeProducer(source);
    },
    [mediaService]
  );

  const getUserMedia = useCallback(
    async (constraints: MediaStreamConstraints) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.getUserMedia(constraints);
    },
    [mediaService]
  );

  const getDisplayMedia = useCallback(
    async (constraints?: DisplayMediaStreamOptions) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.getDisplayMedia(constraints);
    },
    [mediaService]
  );

  return {
    mediaService,
    isInitializing,
    error,
    createProducer,
    pauseProducer,
    resumeProducer,
    closeProducer,
    getUserMedia,
    getDisplayMedia,
  };
};
