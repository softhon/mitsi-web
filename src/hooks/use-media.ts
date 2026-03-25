import { types as mediasoupTypes } from 'mediasoup-client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Access,
  type ConsumerStateData,
  type CreateConsumerData,
  type PeerMedia,
  type ProducerSource,
} from '@/types';
import { useServices } from './use-services';
import { QualityManager, QualityLevel } from '@/services/quality-manager';
import {
  useCameraActions,
  useCameraDeviceId,
  useCameraDevices,
  useCameraOn,
  useMicActions,
  useMicDeviceId,
  useMicDevices,
  useMicOn,
  usePeerActions,
  useRoomAccess,
  useScreenActions,
  useScreenOn,
} from '@/store/conf/hooks';
import { Actions } from '@/types/actions';
import { requestMediaPermissions, type MediaPermissionsError } from 'mic-check';
import { toast } from 'sonner';
import { DEVICE_ERRORS } from '@/lib/constants';

// Hook for media operations
export const useMedia = () => {
  const { mediaService, signalingService, isInitializing, error } =
    useServices();
  const roomAccess = useRoomAccess();

  const peerActions = usePeerActions();
  const micActions = useMicActions();
  const micOn = useMicOn();
  const micDeviceId = useMicDeviceId();
  const micDevices = useMicDevices();
  const cameraActions = useCameraActions();
  const cameraDeviceId = useCameraDeviceId();
  const cameraDevices = useCameraDevices();
  const cameraOn = useCameraOn();
  const screenOn = useScreenOn();
  const screenActions = useScreenActions();

  // Initialize Quality Manager for bandwidth optimization
  const qualityManager = useMemo(() => {
    if (!mediaService) return null;
    return new QualityManager(mediaService);
  }, [mediaService]);

  // Cleanup quality manager on unmount
  useEffect(() => {
    return () => {
      qualityManager?.clear();
    };
  }, [qualityManager]);

  // Listen for device changes (devices added or removed)
  useEffect(() => {
    const handleDeviceChange = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audioInputDevices = devices.filter(
          device => device.kind === 'audioinput'
        );
        const videoInputDevices = devices.filter(
          device => device.kind === 'videoinput'
        );

        // Update device lists in store
        micActions.setDevices(audioInputDevices);
        cameraActions.setDevices(videoInputDevices);

        // Check if currently selected mic device still exists
        if (micDeviceId) {
          const micStillExists = audioInputDevices.some(
            device => device.deviceId === micDeviceId
          );
          if (!micStillExists) {
            // Select first available device or null if none
            const newDeviceId = audioInputDevices.length
              ? audioInputDevices[0].deviceId
              : null;
            micActions.setDeviceId(newDeviceId);
          }
        }

        // Check if currently selected camera device still exists
        if (cameraDeviceId) {
          const cameraStillExists = videoInputDevices.some(
            device => device.deviceId === cameraDeviceId
          );
          if (!cameraStillExists) {
            // Select first available device or null if none
            const newDeviceId = videoInputDevices.length
              ? videoInputDevices[0].deviceId
              : null;
            cameraActions.setDeviceId(newDeviceId);
          }
        }
      } catch (error) {
        console.error('Error handling device change:', error);
      }
    };

    // Only add listener if mediaDevices API is available
    if (navigator.mediaDevices?.addEventListener) {
      navigator.mediaDevices.addEventListener(
        'devicechange',
        handleDeviceChange
      );

      return () => {
        navigator.mediaDevices.removeEventListener(
          'devicechange',
          handleDeviceChange
        );
      };
    }
  }, [
    micDeviceId,
    cameraDeviceId,
    micDevices,
    cameraDevices,
    micActions,
    cameraActions,
  ]);

  const createProducer = useCallback(
    async (source: ProducerSource, appData?: mediasoupTypes.AppData) => {
      if (!mediaService) throw new Error('MediaService not initialized');

      return await mediaService.createProducer(source, appData);
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

      if (producerSource === 'screen') {
        peerActions.addScreen(producerPeerId);
      }

      // Set initial quality to MEDIUM for all video consumers
      if (
        qualityManager &&
        (producerSource === 'camera' || producerSource === 'screen')
      ) {
        await qualityManager.setConsumerQuality(
          producerPeerId,
          producerSource,
          QualityLevel.MEDIUM
        );
      }

      // console.log("create consumer --- source", producerSource)
    },
    [mediaService, peerActions, qualityManager]
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
    [mediaService, peerActions]
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
      if (producerSource === 'screen') {
        peerActions.removeScreen(producerPeerId);
      }
    },
    [mediaService, peerActions]
  );

  const createWebRtcConnections = useCallback(async () => {
    if (!mediaService || !signalingService)
      throw new Error('MediaService or signalingService not initialized');
    // creates transports
    await mediaService.createWebRtcTransports();
    // create consumer for producer in the room
    await signalingService.sendMessage({
      action: Actions.CreateConsumersOfAllProducers,
    });
  }, [mediaService, signalingService]);

  const produceUserMedia = useCallback(async () => {
    if (roomAccess != Access.Allowed) return;

    if (micOn) await createProducer('mic');
    if (cameraOn) await createProducer('camera');
    if (screenOn) {
      await createProducer('screen');
      await createProducer('screenAudio');
    }
  }, [roomAccess, micOn, cameraOn, screenOn, createProducer]);

  const closeAllProducers = useCallback(() => {
    if (!mediaService) throw new Error('MediaService not initialized');
    mediaService.closeAllProducers();
  }, [mediaService]);

  const closeAllConsumers = useCallback(() => {
    if (!mediaService) throw new Error('MediaService not initialized');
    mediaService.closeAllConsumers();
  }, [mediaService]);

  const closeAllTransports = useCallback(() => {
    if (!mediaService) throw new Error('MediaService not initialized');
    mediaService.closeAllTransports();
  }, [mediaService]);

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
      await mediaService.startUserMedia(mediaSource, deviceId);
      if (roomAccess === Access.Allowed) createProducer(mediaSource);
    },
    [mediaService, roomAccess, createProducer]
  );
  const stopUserMedia = useCallback(
    async (mediaSource: 'mic' | 'camera') => {
      if (!mediaService) throw new Error('MediaService not initialized');
      await mediaService.stopUserMedia(mediaSource);
      if (roomAccess == Access.Allowed) closeProducer(mediaSource);
    },
    [mediaService, roomAccess, closeProducer]
  );

  const stopDisplayMedia = useCallback(async () => {
    if (!mediaService) throw new Error('MediaService not initialized');
    await mediaService.stopDisplayMedia();
    if (roomAccess == Access.Allowed) {
      closeProducer('screen');
      closeProducer('screenAudio');
    }
  }, [mediaService, roomAccess, closeProducer]);

  const handleDisplayMediaOnEnded = useCallback(async () => {
    await stopDisplayMedia();
    screenActions.toggle();
  }, [stopDisplayMedia, screenActions]);

  const startDisplayMedia = useCallback(
    async (constraints?: DisplayMediaStreamOptions) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      const stream = await mediaService.startDisplayMedia(constraints);
      stream.getTracks()[0].onended = handleDisplayMediaOnEnded;

      if (roomAccess == Access.Allowed) {
        createProducer('screen');
        if (stream.getAudioTracks().length) createProducer('screenAudio');
      }
    },
    [mediaService, roomAccess, createProducer, handleDisplayMediaOnEnded]
  );

  const switchDevice = useCallback(
    async (source: ProducerSource, deviceId: string) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      await mediaService.switchDevice(source, deviceId);

      if (source === 'mic') {
        micActions.setDeviceId(deviceId);
      } else {
        cameraActions.setDeviceId(deviceId);
      }
    },
    [cameraActions, micActions, mediaService]
  );

  const getConsumer = useCallback(
    (producerPeerId: string, source: ProducerSource) => {
      if (!mediaService) throw new Error('MediaService not initialized');
      return mediaService.getConsumer(producerPeerId, source);
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

  const [micPending, setMicPending] = useState(false);
  const [cameraPending, setCameraPending] = useState(false);

  const requestMicPermission = useCallback(() => {
    setMicPending(true);
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
        const { title, body } = DEVICE_ERRORS[type]('microphone');
        toast.error(title, { description: body });
      })
      .finally(() => setMicPending(false));
  }, [micActions]);

  const requestCameraPermission = useCallback(() => {
    setCameraPending(true);
    requestMediaPermissions({ audio: false, video: true })
      .then(async () => {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          device => device.kind === 'videoinput'
        );
        if (!videoInputDevices.length) throw 'Device not found';
        cameraActions.setDeviceId(videoInputDevices[0].deviceId);
        cameraActions.setDevices(videoInputDevices);
      })
      .catch((err: MediaPermissionsError) => {
        const type = err?.type || 'DeviceNotFound';
        const { title, body } = DEVICE_ERRORS[type]('camera');
        toast.error(title, { description: body });
      })
      .finally(() => setCameraPending(false));
  }, [cameraActions]);

  const requestCameraAndMicPermissions = useCallback(() => {
    setMicPending(true);
    setCameraPending(true);
    requestMediaPermissions()
      .catch((err: MediaPermissionsError) => {
        const type = err?.type || 'Generic';
        const { title, body } = DEVICE_ERRORS[type]('camera');
        toast.error(title, { description: body });
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
          cameraActions.setDeviceId(
            videoInputDevices.length ? videoInputDevices[0].deviceId : null
          );
          micActions.setDeviceId(
            audioInputDevices.length ? audioInputDevices[0].deviceId : null
          );
          cameraActions.setDevices(videoInputDevices);
          micActions.setDevices(audioInputDevices);
        } catch (error) {
          console.log(error);
        } finally {
          setMicPending(false);
          setCameraPending(false);
        }
      });
  }, [micActions, cameraActions]);

  const toggleCamera = useCallback(async () => {
    if (!mediaService) return console.log('Media service not intialised');
    if (!cameraDeviceId) return requestCameraPermission();
    setCameraPending(true);
    try {
      if (cameraOn) {
        await stopUserMedia('camera');
      } else {
        await startUserMedia('camera', cameraDeviceId);
      }
      cameraActions.toggle();
    } catch (error) {
      console.log(error);
    } finally {
      setCameraPending(false);
    }
  }, [
    cameraActions,
    cameraDeviceId,
    cameraOn,
    mediaService,
    requestCameraPermission,
    startUserMedia,
    stopUserMedia,
  ]);

  const toggleMic = useCallback(async () => {
    if (!mediaService) return console.log('Media service not intialised');
    if (!micDeviceId) return requestMicPermission();
    setMicPending(true);
    try {
      if (micOn) {
        await stopUserMedia('mic');
      } else {
        await startUserMedia('mic', micDeviceId);
      }
      micActions.toggle();
    } catch (error) {
      console.log(error);
    } finally {
      setMicPending(false);
    }
  }, [
    micActions,
    micDeviceId,
    micOn,
    mediaService,
    requestMicPermission,
    startUserMedia,
    stopUserMedia,
  ]);

  const toggleScreen = useCallback(async () => {
    if (!mediaService) return console.log('Media service not intialised');
    try {
      if (screenOn) {
        await stopDisplayMedia();
      } else {
        await startDisplayMedia({ video: true, audio: true });
      }
      screenActions.toggle();
    } catch (error) {
      console.log(error);
    }
  }, [
    screenActions,
    screenOn,
    mediaService,
    stopDisplayMedia,
    startDisplayMedia,
  ]);

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
    produceUserMedia,
    closeAllProducers,
    closeAllConsumers,
    closeAllTransports,
    getUserMedia,
    getDisplayMedia,
    startUserMedia,
    stopUserMedia,
    startDisplayMedia,
    stopDisplayMedia,
    switchDevice,
    getConsumer,
    setTrack,
    getTrack,
    requestMicPermission,
    requestCameraPermission,
    requestCameraAndMicPermissions,
    toggleCamera,
    toggleMic,
    toggleScreen,
    micPending,
    cameraPending,
    qualityManager,
    setConsumerQuality: qualityManager?.setConsumerQuality.bind(qualityManager),
  };
};

// Re-export QualityLevel for convenience
export { QualityLevel };
