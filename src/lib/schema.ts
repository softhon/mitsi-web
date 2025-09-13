import z from 'zod';

export const ValidationSchema = {
  peerData: z.object({
    id: z.string(),
    name: z.string(),
  }),
  peerId: z.object({
    id: z.string(),
  }),
};
