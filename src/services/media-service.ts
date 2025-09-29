/**
 * Handles interaction with mediasoup and webrtc communication
 */

import { Device, types as mediasoupTypes } from 'mediasoup-client';
import SignalingService from './signaling-service';
import type {
  AppData,
  CreateConsumerData,
  // MediaServiceConfig,
  ProducerSource,
} from '@/types';
import { Actions } from '@/types/actions';
// import appConfig from '@/config';

import {
  audioContraints,
  getSimulcastEncoding,
  videoConstraints,
} from '@/lib/utils';

class MediaService {
  private device: Device;
  private signalingService: SignalingService;
  private sendTransport: mediasoupTypes.Transport | null;
  private recvTransport: mediasoupTypes.Transport | null;
  private producers: Map<ProducerSource, mediasoupTypes.Producer>;
  private consumers: Map<ProducerSource, Map<string, mediasoupTypes.Consumer>>; // key of the inner map is the producerPeerId
  private tracks: Map<ProducerSource, MediaStreamTrack | null>;
  // private config: MediaServiceConfig;

  constructor(
    device: Device,
    signalingService: SignalingService
    // config?: MediaServiceConfig
  ) {
    this.device = device;

    this.signalingService = signalingService;
    this.sendTransport = null;
    this.recvTransport = null;
    this.producers = new Map();

    this.consumers = new Map();

    this.tracks = new Map();

    // this.config = config ? config : appConfig.media;
  }

  static async start(signalingService: SignalingService) {
    const device = new Device();
    const response = await signalingService.sendMessage<{
      routerRtpCapabilities: mediasoupTypes.RtpCapabilities;
    }>({
      action: Actions.GetRouterRtpCapabilities,
    });
    if (!response) throw 'routerRtpCapabilities was not set';

    await device.load({
      routerRtpCapabilities: response.routerRtpCapabilities,
    });
    return new MediaService(device, signalingService);
  }

  // Helper method to get user media with proper constraints
  async getUserMedia(constraints: MediaStreamConstraints) {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }
  async startUserMedia(mediaSource: 'mic' | 'camera', deviceId: string) {
    const mediaTrack = this.getTrack(mediaSource);
    if (mediaTrack && mediaTrack.enabled) {
      if (mediaTrack.getSettings().deviceId === deviceId) return;
      mediaTrack.stop();
    }
    const stream = await navigator.mediaDevices.getUserMedia(
      mediaSource === 'mic'
        ? audioContraints(deviceId)
        : videoConstraints(deviceId)
    );
    this.setTrack(stream.getTracks()[0], mediaSource);
    return;
  }
  async stopUserMedia(mediaSource: 'mic' | 'camera') {
    const mediaTrack = this.getTrack(mediaSource);
    if (!mediaTrack) return;
    if (mediaTrack.enabled) mediaTrack.stop();
    this.setTrack(null, mediaSource);
    return;
  }

  // Helper method to get display media
  async getDisplayMedia(constraints?: DisplayMediaStreamOptions) {
    return await navigator.mediaDevices.getDisplayMedia(constraints);
  }

  async reloadDevice() {
    const device = new Device();
    const response = await this.signalingService.sendMessage<{
      routerRtpCapabilities: mediasoupTypes.RtpCapabilities;
    }>({
      action: Actions.GetRouterRtpCapabilities,
    });
    if (!response) throw 'routerRtpCapabilities was not set';
    await device.load({
      routerRtpCapabilities: response?.routerRtpCapabilities,
    });
    this.device = device;
  }

  async createProducerNew(
    track: MediaStreamTrack,
    source: ProducerSource,
    appData?: mediasoupTypes.AppData
  ) {
    if (!this.sendTransport) {
      throw new Error('Send transport not initialized');
    }

    this.setTrack(track, source);

    let producer: mediasoupTypes.Producer;
    const clonedTrack = track.clone();

    // Check if the device supports simulcast or SVC
    const canSimulcast =
      this.device.canProduce('video') &&
      this.device.rtpCapabilities.codecs?.some(
        codec =>
          codec.mimeType.toLowerCase().includes('vp8') ||
          codec.mimeType.toLowerCase().includes('h264')
      );

    if ((source === 'camera' || source === 'screen') && canSimulcast) {
      const codecOptions = {
        videoGoogleStartBitrate: 1000, // Improve initial quality
      };
      // Check if the device supports SVC
      const canUseSVC =
        this.device.canProduce('video') &&
        this.device.rtpCapabilities.codecs?.some(
          codec =>
            codec.mimeType.toLowerCase().includes('vp9') ||
            codec.mimeType.toLowerCase().includes('av1')
        );

      const encodings = getSimulcastEncoding(source);

      // Prefer SVC (VP9 or AV1) if supported and enabled
      const codec = canUseSVC
        ? this.device.rtpCapabilities.codecs?.find(
            codec =>
              codec.mimeType.toLowerCase() === 'video/vp9' ||
              codec.mimeType.toLowerCase() === 'video/av1'
          )
        : undefined;

      producer = await this.sendTransport.produce({
        track: clonedTrack,
        encodings: codec ? undefined : encodings, // Use SVC if available, otherwise simulcast
        codecOptions,
        codec, // Specify VP9/AV1 for SVC
        appData: {
          ...appData,
          source,
          scalabilityMode: codec ? 'L1T3' : undefined,
        }, // SVC mode
      });
    } else {
      // Fallback for audio sources or unsupported devices
      producer = await this.sendTransport.produce({
        track: clonedTrack,
        appData: { ...appData, source },
      });
    }

    this.producers.set(source, producer);
    return producer;
  }

  async createProducer(
    source: ProducerSource,
    appData?: mediasoupTypes.AppData
  ) {
    if (!this.sendTransport) {
      throw new Error('Send transport not initialized');
    }
    let producer: mediasoupTypes.Producer;
    const clonedTrack = this.getTrack(source);

    console.log({ clonedTrack });

    if (!clonedTrack)
      throw `${source} track was not found -- start ${source} before you create producer`;

    if (source === 'camera') {
      // Simulcast encoding settings
      const encodings = [
        { rid: 'r0', maxBitrate: 150000, scaleResolutionDownBy: 2 }, // Low quality, 320x240
        { rid: 'r1', maxBitrate: 300000, scaleResolutionDownBy: 1.5 }, // Medium quality, 480x270
        { rid: 'r2', maxBitrate: 900000, scaleResolutionDownBy: 1 }, // High quality, 640x360
      ];

      const codecOptions = {
        videoGoogleStartBitrate: 1000, // Optional for improving initial quality
      };

      producer = await this.sendTransport.produce({
        track: clonedTrack,
        encodings,
        codecOptions,
        appData: { ...appData, source },
      });
    } else {
      producer = await this.sendTransport.produce({
        track: clonedTrack,
        appData: { ...appData, source },
      });
    }
    // this.setTrack(track, source);
    this.producers.set(source, producer);
    return producer;
  }

  async pauseProducer(source: ProducerSource) {
    const producer = this.producers.get(source);
    if (!producer) return;

    producer.pause();
    await this.signalingService.sendMessage({
      action: Actions.PauseProducer,
      args: {
        producerId: producer.id,
        source,
      },
    });
  }

  async resumeProducer(source: ProducerSource) {
    const producer = this.producers.get(source);
    if (!producer) return;

    producer.resume();
    await this.signalingService.sendMessage({
      action: Actions.ResumeProducer,
      args: {
        producerId: producer.id,
        source,
      },
    });
  }

  async closeProducer(source: ProducerSource) {
    this.getTrack(source)?.stop();
    this.setTrack(null, source);
    const producer = this.producers.get(source);
    if (!producer) return;
    producer.close();
    this.producers.delete(source);
    await this.signalingService.sendMessage({
      action: Actions.CloseProducer,
      args: {
        producerId: producer.id,
        source,
      },
    });
  }

  async closeAllProducers() {
    for (const producer of this.producers.values()) {
      producer.close();
    }
    this.producers.clear();
  }

  hasProducer(source: ProducerSource) {
    return this.producers.has(source);
  }

  setTrack(track: MediaStreamTrack | null, source: ProducerSource) {
    this.tracks.set(source, track);
  }

  getTrack(source: ProducerSource) {
    return this.tracks.get(source) || null;
  }

  stopTrack(source: ProducerSource) {
    this.getTrack(source)?.stop();
    this.setTrack(null, source);
  }

  async replaceProducerTrack(track: MediaStreamTrack, source: ProducerSource) {
    const producer = this.producers.get(source);
    if (!producer) return;
    this.setTrack(track, source);
    await producer.replaceTrack({ track: track.clone() });
  }

  async createConsumer(
    consumerOptions: CreateConsumerData
  ): Promise<mediasoupTypes.Consumer | null> {
    const {
      id,
      producerId,
      kind,
      rtpParameters,
      appData,
      producerSource,
      producerPeerId,
    } = consumerOptions;
    if (!this.recvTransport) {
      throw new Error('Recieve transport not initialized');
    }
    const consumer = await this.recvTransport.consume({
      id,
      producerId,
      kind,
      rtpParameters,
      appData, //producerPeer in the appdata is use to delete this later
    });
    if (!consumer) {
      throw new Error('Failed to create consumer');
    }
    if (!this.consumers.has(producerSource))
      this.consumers.set(producerSource, new Map());

    const consumers = this.consumers.get(producerSource);
    consumers?.set(producerPeerId, consumer);

    consumer.observer.on('close', () => {
      consumers?.delete(producerPeerId);
    });

    return consumer;
  }

  getConsumer(producerPeerId: string, source: ProducerSource) {
    let consumer: mediasoupTypes.Consumer<AppData> | undefined;
    const consumers = this.consumers.get(source);
    if (consumers) {
      consumer = consumers.get(producerPeerId);
    }
    return consumer;
  }

  async pauseConsumer(producerPeerId: string, producerSource: ProducerSource) {
    const consumer = this.getConsumer(producerPeerId, producerSource);
    if (!consumer?.paused) consumer?.pause();
  }
  async resumeConsumer(producerPeerId: string, producerSource: ProducerSource) {
    const consumer = this.getConsumer(producerPeerId, producerSource);
    if (consumer?.paused) consumer?.resume();
  }

  closeConsumer(producerPeerId: string, producerSource: ProducerSource) {
    const consumer = this.getConsumer(producerPeerId, producerSource);
    consumer?.close();
  }

  closeAllConsumers() {
    this.consumers.forEach(sourceConsumers => {
      sourceConsumers.forEach(consumer => {
        consumer.close();
      });
      sourceConsumers.clear();
    });

    this.consumers.clear();
  }

  async createWebRtcTransports() {
    const response = await this.signalingService.sendMessage<{
      sendTransportParams: mediasoupTypes.TransportOptions;
      recvTransportParams: mediasoupTypes.TransportOptions;
    }>({
      action: Actions.CreateWebrtcTransports,
    });
    console.log('createWebRtcTransports', response);
    // console.log({ transportsParams })
    if (!response)
      throw 'Transport not created, - transport params were not recieved';
    this.createWebRtcSendTransport(response.sendTransportParams);
    this.createWebRtcRecvTransport(response.recvTransportParams);
  }

  createWebRtcSendTransport(transportParams: mediasoupTypes.TransportOptions) {
    if (!this.device) {
      throw new Error('Device not intialised');
    }
    console.log('createWebRtcSendTransport', transportParams);
    this.sendTransport = this.device.createSendTransport({
      id: transportParams.id,
      iceParameters: transportParams.iceParameters,
      iceCandidates: transportParams.iceCandidates,
      dtlsParameters: transportParams.dtlsParameters,
    });
    this.listenToSendTransport(this.sendTransport);
  }

  createWebRtcRecvTransport(transportParams: mediasoupTypes.TransportOptions) {
    if (!this.device) {
      throw new Error('Device not intialised');
    }
    this.recvTransport = this.device.createRecvTransport({
      id: transportParams.id,
      iceParameters: transportParams.iceParameters,
      iceCandidates: transportParams.iceCandidates,
      dtlsParameters: transportParams.dtlsParameters,
    });

    this.listenToRecvTransport(this.recvTransport);
  }

  private listenToSendTransport(sendTransport: mediasoupTypes.Transport) {
    sendTransport.on(
      'connect',
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await this.signalingService.sendMessage({
            action: Actions.ConnectWebrtcTransports,
            args: {
              transportId: sendTransport.id,
              dtlsParameters,
            },
          });
          console.log('connected webrtc transports');
          callback();
        } catch (error) {
          errback(error as Error);
        }
      }
    );

    sendTransport.on(
      'produce',
      async ({ kind, rtpParameters, appData }, callback, errback) => {
        try {
          const response = await this.signalingService.sendMessage<{
            producerId: string;
          }>({
            action: Actions.CreateProducer,
            args: {
              transportId: sendTransport.id,
              kind,
              rtpParameters,
              appData,
            },
          });
          console.log('Create Producer, producerId', response?.producerId);
          if (!response)
            return errback(new Error('ProducerId was not recieved'));
          callback({ id: response.producerId });
        } catch (error) {
          errback(error as Error);
        }
      }
    );

    sendTransport.on('connectionstatechange', state => {
      switch (state) {
        case 'connecting':
          break;
        case 'connected':
          break;
        case 'disconnected':
        case 'failed':
          this.restartICE(sendTransport);
          break;
        default:
          break;
      }
    });
  }

  private listenToRecvTransport(recvTransport: mediasoupTypes.Transport) {
    recvTransport.on(
      'connect',
      async ({ dtlsParameters }, callback, errback) => {
        try {
          await this.signalingService.sendMessage({
            action: Actions.ConnectWebrtcTransports,
            args: {
              transportId: recvTransport.id,
              dtlsParameters,
            },
          });
          callback();
        } catch (error) {
          errback(error as Error);
        }
      }
    );

    recvTransport.on('connectionstatechange', state => {
      switch (state) {
        case 'disconnected':
        case 'failed':
          this.restartICE(recvTransport);
          break;
        default:
          break;
      }
    });
  }

  async restartICE(transport: mediasoupTypes.Transport) {
    const response = await this.signalingService.sendMessage<{
      iceParameters: mediasoupTypes.IceParameters;
    }>({
      action: Actions.RestartIce,
      args: {
        transportId: transport.id,
      },
    });
    if (!response) throw 'Ice Parameters was not recieved';
    await transport.restartIce({ iceParameters: response.iceParameters });
  }

  async closeAllTransports() {
    if (this.sendTransport) {
      this.sendTransport.close();
      this.sendTransport = null;
    }
    if (this.recvTransport) {
      this.recvTransport.close();
      this.recvTransport = null;
    }
  }

  getDeviceRtpCapabilities() {
    return this.device.rtpCapabilities;
  }
}

export default MediaService;
