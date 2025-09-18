import { types as mediasoupTypes } from 'mediasoup-client';
import { useCallback } from 'react';
import type {
  ConsumerStateData,
  CreateConsumerData,
  PeerMedia,
  ProducerSource,
} from '@/types';
import { useServices } from './use-services';
import { usePeerActions } from '@/store/conf/hooks';
import { Actions } from '@/types/actions';

// Hook for media operations
export const useMedia = () => {
  const { mediaService, signalingService, isInitializing, error } =
    useServices();
  const peerActions = usePeerActions();
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

  const createConsumer = useCallback(
    async (consumerData: CreateConsumerData) => {
      if (!mediaService) throw new Error('MediaService not initialized');

      const { producerSource, producerPeerId, producerPaused } = consumerData;

      peerActions.updateMedia(producerPeerId, { [producerSource]: false }); // a trick to ensure the peerview and audio is rebuilt to get consumer

      await mediaService.createConsumer(consumerData);

      const mediaUpdate: Partial<PeerMedia> =
        producerSource !== 'camera'
          ? {
              [producerSource]:
                producerSource === 'mic' && producerPaused ? false : true,
            }
          : { [producerSource]: true, cameraPaused: true }; // create camera in a pause state
      peerActions.updateMedia(producerPeerId, mediaUpdate);

      // console.log("create consumer --- source", producerSource)
    },
    [mediaService, peerActions]
  );

  const pauseConsumer = useCallback(
    async (consumerData: ConsumerStateData) => {
      if (!mediaService) throw new Error('MediaService not initialized');

      const { producerSource, producerPeerId } = consumerData;

      await mediaService.pauseConsumer(producerPeerId, producerSource);
      const mediaUpdate: Partial<PeerMedia> =
        producerSource !== 'camera'
          ? { [producerSource]: false }
          : { [producerSource]: true, cameraPaused: true }; //   camera is paused
      peerActions.updateMedia(producerPeerId, mediaUpdate);
    },
    [mediaService, peerActions]
  );

  const resumeConsumer = useCallback(
    async (consumerData: ConsumerStateData) => {
      if (!mediaService) throw new Error('MediaService not initialized');

      const { producerSource, producerPeerId } = consumerData;

      await mediaService.resumeConsumer(producerPeerId, producerSource);
      const mediaUpdate: Partial<PeerMedia> =
        producerSource !== 'camera'
          ? { [producerSource]: true }
          : { [producerSource]: true, cameraPaused: false };
      peerActions.updateMedia(producerPeerId, mediaUpdate);
      // console.log("resumeConsumer --- source", producerSource)
    },
    []
  );

  const closeConsumer = useCallback(
    async (consumerOptions: ConsumerStateData) => {
      if (!mediaService) throw new Error('MediaService not initialized');

      const { producerSource, producerPeerId } = consumerOptions;

      mediaService.closeConsumer(producerPeerId, producerSource);
      const mediaUpdate: Partial<PeerMedia> =
        producerSource !== 'camera'
          ? { [producerSource]: false }
          : { [producerSource]: false, cameraPaused: false };
      peerActions.updateMedia(producerPeerId, mediaUpdate);
    },
    []
  );

  const createWebRtcConnections = useCallback(async () => {
    if (!mediaService || !signalingService)
      throw new Error('MediaService or signalingService not initialized');
    // creates transports

    await mediaService.createWebRtcTransports();
    console.log('Create transport');

    // create consumer for producer in the room
    await signalingService?.message({
      action: Actions.CreateConsumersOfAllProducers,
    });
    console.log('Create CreateConsumersOfAllProducers');
  }, [mediaService, signalingService]);

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
    createConsumer,
    pauseConsumer,
    resumeConsumer,
    closeConsumer,
    createWebRtcConnections,
    getUserMedia,
    getDisplayMedia,
  };
};
