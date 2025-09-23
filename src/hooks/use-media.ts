import { types as mediasoupTypes } from 'mediasoup-client';
import { useCallback } from 'react';
import type {
  ConsumerStateData,
  CreateConsumerData,
  PeerMedia,
  ProducerSource,
} from '@/types';
import { useServices } from './use-services';
import {
  useCameraActions,
  useMicActions,
  usePeerActions,
} from '@/store/conf/hooks';
import { Actions } from '@/types/actions';
import { requestMediaPermissions, type MediaPermissionsError } from 'mic-check';
import { DEVICE_ERRORS } from '@/lib/constants';

// Hook for media operations
export const useMedia = () => {
  const { mediaService, signalingService, isInitializing, error } =
    useServices();
  const peerActions = usePeerActions();
  const micActions = useMicActions();
  const cameraActions = useCameraActions();

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
    // create consumer for producer in the room
    await signalingService.message({
      action: Actions.CreateConsumersOfAllProducers,
    });
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

  const startUserMedia = useCallback(
    async (mediaSource: 'mic' | 'camera', deviceId: string) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.startUserMedia(mediaSource, deviceId);
    },
    [mediaService]
  );
  const stopUserMedia = useCallback(
    async (mediaSource: 'mic' | 'camera') => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return await mediaService.stopUserMedia(mediaSource);
    },
    [mediaService]
  );

  const getTrack = useCallback(
    (source: ProducerSource) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return mediaService.getTrack(source);
    },
    [mediaService]
  );
  const setTrack = useCallback(
    (track: MediaStreamTrack | null, source: ProducerSource) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return mediaService.setTrack(track, source);
    },
    [mediaService]
  );

  const requestMicPermission = useCallback(() => {
    requestMediaPermissions({ audio: true, video: false })
      .then(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(
          device => device.kind === 'audioinput'
        );
        if (!audioInputDevices.length) throw 'Device not found';
        micActions.setDeviceId(audioInputDevices[0].deviceId);
        micActions.setDevices(audioInputDevices);
      })
      .catch((err: MediaPermissionsError) => {
        const type = err?.type || 'DeviceNotFound';
        return alert(DEVICE_ERRORS[type]('microphone'));
      });
  }, [micActions]);

  const requestCameraPermission = useCallback(() => {
    requestMediaPermissions({ audio: false, video: true })
      .then(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(
          device => device.kind === 'audioinput'
        );
        if (!audioInputDevices.length) throw 'Device not found';
        cameraActions.setDeviceId(audioInputDevices[0].deviceId);
        cameraActions.setDevices(audioInputDevices);
      })
      .catch((err: MediaPermissionsError) => {
        const type = err?.type || 'DeviceNotFound';
        return alert(DEVICE_ERRORS[type]('camera'));
      });
  }, [cameraActions]);

  const requestCameraAndMicPermissions = useCallback(() => {
    requestMediaPermissions()
      .catch((err: MediaPermissionsError) => {
        console.log(err);
      })
      .finally(async () => {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const audioInputDevices = devices.filter(
            device => device.kind === 'audioinput'
          );
          const videoInputDevices = devices.filter(
            device => device.kind === 'videoinput'
          );
          // const audioOutputDevices = devices.filter(
          //   device => device.kind === 'audiooutput'
          // );

          // soundActions.setDeviceId(
          //   audioOutputDevices.length ? audioOutputDevices[0].deviceId : null
          // );
          cameraActions.setDeviceId(
            videoInputDevices.length ? videoInputDevices[0].deviceId : null
          );
          micActions.setDeviceId(
            audioInputDevices.length ? audioInputDevices[0].deviceId : null
          );

          // soundActions.setDevices(audioOutputDevices);
          cameraActions.setDevices(videoInputDevices);
          micActions.setDevices(audioInputDevices);
        } catch (error) {
          console.log(error);
        }
      });
  }, [micActions, cameraActions]);

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
    startUserMedia,
    stopUserMedia,
    setTrack,
    getTrack,
    requestMicPermission,
    requestCameraPermission,
    requestCameraAndMicPermissions,
  };
};
