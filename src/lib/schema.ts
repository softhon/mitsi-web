import z from 'zod';

const producerSource = z.enum(['mic', 'camera', 'screen', 'screenAudio']);
const mediaKind = z.enum(['audio', 'video']);

const peerDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  userId: z.string().optional(),
  email: z.string().optional(),
  photo: z.string().optional(),
  color: z.string().optional(),
  isMobileDevice: z.boolean().optional(),
});

export const ValidationSchema = {
  peerData: peerDataSchema,
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

  sendChat: z.object({
    id: z.string(),
    text: z.string(),
    sender: peerDataSchema,
    receiver: peerDataSchema.optional(),
    createdAt: z.number(),
  }),

  sendReaction: z.object({
    id: z.string(),
    name: z.string(),
    sender: peerDataSchema,
    position: z.string(),
    timestamp: z.number(),
  }),

  raiseHand: z.object({
    peer: peerDataSchema,
    hand: z.object({
      raised: z.boolean(),
      timestamp: z.number().optional(),
    }),
  }),
};
