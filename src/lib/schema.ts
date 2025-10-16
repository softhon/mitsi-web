import z from 'zod';

const producerSource = z.enum(['mic', 'camera', 'screen', 'screenAudio']);
const mediaKind = z.enum(['audio', 'video']);

export const ValidationSchema = {
  peerData: z.object({
    id: z.string(),
    name: z.string(),
  }),
  peerId: z.object({
    id: z.string(),
  }),

  createConsumerData: z.object({
    id: z.string(),
    producerId: z.string(),
    transportId: z.string(),
    producerPeerId: z.string(),
    producerSource: producerSource,
    kind: mediaKind,
    type: z.string(), //mediasoup consumer type 'simple' | 'simulcast' | 'svc' | 'pipe';
    rtpParameters: z.any(),
    appData: z.any(),
    producerPaused: z.boolean(),
  }),

  consumerStateData: z.object({
    consumerId: z.string(),
    producerPeerId: z.string(),
    producerSource: producerSource,
    fromProducer: z.boolean().optional(),
  }),
};
