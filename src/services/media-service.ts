/**
 * Handles interaction with mediasoup and webrtc communication
 */

import { Device, types as mediasoupTypes } from 'mediasoup-client';
import SignalingService from './signaling-service';
import type { ConsumerData, ProducerSource } from '@/types';
import { Actions } from '@/types/actions';

import { getSimulcastEncoding } from '@/lib/utils';

class MediaService {
  private device: Device;
  private signalingService: SignalingService;
  private sendTransport: mediasoupTypes.Transport | null;
  private recvTransport: mediasoupTypes.Transport | null;
  private producers: Map<ProducerSource, mediasoupTypes.Producer>;
  private micConsumers: Map<string, mediasoupTypes.Consumer>; // producerPeerId as key
  private cameraConsumers: Map<string, mediasoupTypes.Consumer>; // producerPeerId as key
  private screenConsumers: Map<string, mediasoupTypes.Consumer>; // producerPeerId as key
  private screenAudioConsumers: Map<string, mediasoupTypes.Consumer>; // producerPeerId as key
  // preview tracks
  private micTrack: MediaStreamTrack | null;
  private cameraTrack: MediaStreamTrack | null;
  private screenTrack: MediaStreamTrack | null;
  private screenAudioTrack: MediaStreamTrack | null;

  constructor(device: Device, signalingService: SignalingService) {
    this.device = device;

    this.signalingService = signalingService;
    this.sendTransport = null;
    this.recvTransport = null;
    this.producers = new Map();
    this.micConsumers = new Map();
    this.cameraConsumers = new Map();
    this.screenConsumers = new Map();
    this.screenAudioConsumers = new Map();
    this.micTrack = null;
    this.cameraTrack = null;
    this.screenTrack = null;
    this.screenAudioTrack = null;
  }

  async reloadDevice() {
    const device = new Device();
    const { routerRtpCapabilities } = await this.signalingService.message<{
      routerRtpCapabilities: mediasoupTypes.RtpCapabilities;
    }>({
      action: Actions.GetRouterRtpCapabilities,
    });
    await device.load({ routerRtpCapabilities });
    this.device = device;
    // console.log("Reload device- > rtpCapabilities", rtpCapabilities)
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
    track: MediaStreamTrack,
    source: ProducerSource,
    appData?: mediasoupTypes.AppData
  ) {
    if (!this.sendTransport) {
      throw new Error('Send transport not initialized');
    }
    let producer: mediasoupTypes.Producer;
    const clonedTrack = track.clone();

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
    this.setTrack(track, source);
    this.producers.set(source, producer);
    return producer;
  }

  async pauseProducer(source: ProducerSource) {
    const producer = this.producers.get(source);
    if (!producer) return;

    producer.pause();
    await this.signalingService.message({
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
    await this.signalingService.message({
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
    await this.signalingService.message({
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
    switch (source) {
      case 'mic':
        this.micTrack = track;
        break;
      case 'camera':
        this.cameraTrack = track;
        break;
      case 'screen':
        this.screenTrack = track;
        break;
      case 'screenAudio':
        this.screenAudioTrack = track;
        break;
      default:
    }
  }

  getTrack(source: ProducerSource) {
    let track: MediaStreamTrack | null = null;

    switch (source) {
      case 'mic':
        track = this.micTrack;
        break;
      case 'camera':
        track = this.cameraTrack;
        break;
      case 'screen':
        track = this.screenTrack;
        break;
      case 'screenAudio':
        track = this.screenAudioTrack;
        break;
      default:
    }
    return track;
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
    consumerOptions: ConsumerData
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
      appData, //producerPeer inside the appdata is use to delete this later
    });
    if (!consumer) {
      throw new Error('Failed to create consumer');
    }

    if (producerSource === 'mic')
      this.micConsumers.set(producerPeerId, consumer);
    if (producerSource === 'camera')
      this.cameraConsumers.set(producerPeerId, consumer);
    if (producerSource === 'screen')
      this.screenConsumers.set(producerPeerId, consumer);
    if (producerSource === 'screenAudio')
      this.screenAudioConsumers.set(producerPeerId, consumer);

    consumer.observer.on('close', () => {
      if (producerSource === 'mic') this.micConsumers.delete(producerPeerId);
      if (producerSource === 'camera')
        this.cameraConsumers.delete(producerPeerId);
      if (producerSource === 'screen')
        this.screenConsumers.delete(producerPeerId);
      if (producerSource === 'screenAudio')
        this.screenAudioConsumers.delete(producerPeerId);
    });

    return consumer;
  }

  getConsumer(producerPeerId: string, source: ProducerSource) {
    let consumer: mediasoupTypes.Consumer | undefined;

    switch (source) {
      case 'mic':
        consumer = this.micConsumers.get(producerPeerId);
        break;
      case 'camera':
        consumer = this.cameraConsumers.get(producerPeerId);
        break;
      case 'screen':
        consumer = this.screenConsumers.get(producerPeerId);
        break;
      case 'screenAudio':
        consumer = this.screenAudioConsumers.get(producerPeerId);
        break;
      default:
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
    this.micConsumers.forEach(consumer => {
      consumer.close();
    });
    this.cameraConsumers.forEach(consumer => {
      consumer.close();
    });
    this.screenConsumers.forEach(consumer => {
      consumer.close();
    });
    this.screenAudioConsumers.forEach(consumer => {
      consumer.close();
    });

    this.micConsumers.clear();
    this.cameraConsumers.clear();
    this.screenConsumers.clear();
    this.screenAudioConsumers.clear();
  }

  async createWebRtcTransports() {
    const transportsParams = await this.signalingService.message<{
      sendTransportParams: mediasoupTypes.TransportOptions;
      recvTransportParams: mediasoupTypes.TransportOptions;
    }>({
      action: Actions.CreateWebrtcTransports,
    });
    // console.log({ transportsParams })
    this.createWebRtcSendTransport(transportsParams.sendTransportParams);
    this.createWebRtcRecvTransport(transportsParams.recvTransportParams);
  }

  createWebRtcSendTransport(transportParams: mediasoupTypes.TransportOptions) {
    if (!this.device) {
      throw new Error('Device not intialised');
    }
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
          await this.signalingService.message({
            action: Actions.ConnectWebrtcTransports,
            args: {
              transportId: sendTransport.id,
              dtlsParameters,
            },
          });
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
          const { producerId } = await this.signalingService.message<{
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
          callback({ id: producerId });
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
          await this.signalingService.message({
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
    const { iceParameters } = await this.signalingService.message<{
      iceParameters: mediasoupTypes.IceParameters;
    }>({
      action: Actions.RestartIce,
      args: {
        transportId: transport.id,
      },
    });
    await transport.restartIce({ iceParameters });
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
