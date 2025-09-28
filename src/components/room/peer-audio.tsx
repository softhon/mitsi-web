import { useMedia } from '@/hooks/use-media';
import { usePeerMediasById } from '@/store/conf/hooks';
import { useEffect, useRef } from 'react';

const PeerAudio = ({ peerId }: { peerId: string }) => {
  const { getConsumer } = useMedia();
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);
  const media = usePeerMediasById(peerId);

  // mic
  useEffect(() => {
    if (!media?.mic || !audioRef.current) return;
    const consumer = getConsumer(peerId, 'mic');
    if (!consumer) return;
    const { track } = consumer;
    const stream = new MediaStream([track]);

    audioRef.current.srcObject = stream;
  }, [media?.mic, getConsumer, peerId]);

  // screen audio
  useEffect(() => {
    if (!media?.screenAudio || !screenAudioRef.current) return;
    const consumer = getConsumer(peerId, 'mic');
    if (!consumer) return;
    const { track } = consumer;
    const stream = new MediaStream([track]);

    screenAudioRef.current.srcObject = stream;
  }, [media?.screenAudio, getConsumer, peerId]);
  return (
    <>
      <audio ref={screenAudioRef} autoPlay />
      <audio ref={audioRef} autoPlay />
    </>
  );
};

export default PeerAudio;
