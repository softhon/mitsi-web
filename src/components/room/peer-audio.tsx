import { useMedia } from '@/hooks/use-media';
import { usePeerMediasById, useSpeakingActions } from '@/store/conf/hooks';
import { useEffect, useRef, useMemo, memo } from 'react';
import hark from 'hark';
import { throttle } from '@/lib/utils';

const PeerAudio = ({ peerId }: { peerId: string }) => {
  const { getConsumer } = useMedia();
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);
  const media = usePeerMediasById(peerId);
  const speechEventsRef = useRef<hark.Harker>(null);
  const speakingActions = useSpeakingActions();

  // Throttle speaking updates to max 10 per second
  const updateSpeaking = useMemo(
    () =>
      throttle((speaking: boolean) => {
        if (speakingActions.setSpeaking) {
          speakingActions.setSpeaking(peerId, speaking);
        }
      }, 100),
    [speakingActions, peerId]
  );

  // mic
  useEffect(() => {
    if (!media?.mic || !audioRef.current) {
      if (speechEventsRef.current) {
        speechEventsRef.current.stop();
      }
      return;
    }

    const consumer = getConsumer(peerId, 'mic');
    if (!consumer) return;
    const { track } = consumer;
    const stream = new MediaStream([track]);

    audioRef.current.srcObject = stream;
    speechEventsRef.current = hark(stream, {});

    speechEventsRef.current.on('speaking', () => updateSpeaking(true));
    speechEventsRef.current.on('stopped_speaking', () => updateSpeaking(false));

    return () => {
      if (speechEventsRef.current) {
        speechEventsRef.current.stop();
      }
    };
  }, [media?.mic, getConsumer, peerId, updateSpeaking]);

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

// Memoize to prevent unnecessary re-renders
export default memo(PeerAudio, (prevProps, nextProps) => {
  return prevProps.peerId === nextProps.peerId;
});
