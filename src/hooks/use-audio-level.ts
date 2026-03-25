import { useEffect, useRef, useState } from 'react';
import { useMedia } from './use-media';
import { usePeerMediasById } from '@/store/conf/hooks';

/**
 * Returns a live audio level (0–1) for a peer's mic consumer,
 * sampled via Web Audio AnalyserNode + requestAnimationFrame.
 */
export const useAudioLevel = (peerId: string): number => {
  const { getConsumer } = useMedia();
  const media = usePeerMediasById(peerId);
  const [level, setLevel] = useState(0);

  const rafRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (!media?.mic) {
      setLevel(0);
      return;
    }

    const consumer = getConsumer(peerId, 'mic');
    if (!consumer) return;

    const ctx = new AudioContext();
    ctxRef.current = ctx;
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    analyserRef.current = analyser;
    dataRef.current = new Uint8Array(analyser.frequencyBinCount);

    const source = ctx.createMediaStreamSource(new MediaStream([consumer.track]));
    source.connect(analyser);

    const tick = () => {
      if (!analyserRef.current || !dataRef.current) return;
      analyserRef.current.getByteFrequencyData(dataRef.current);
      const avg = dataRef.current.reduce((s, v) => s + v, 0) / dataRef.current.length;
      setLevel(avg / 255);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      source.disconnect();
      ctx.close();
      analyserRef.current = null;
      dataRef.current = null;
      ctxRef.current = null;
      setLevel(0);
    };
  }, [media?.mic, getConsumer, peerId]);

  return level;
};
