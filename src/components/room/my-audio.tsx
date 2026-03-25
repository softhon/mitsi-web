import { useMedia } from '@/hooks/use-media';
import { useMicOn, usePeerMe, useSpeakingActions } from '@/store/conf/hooks';
import { useEffect, useRef, useMemo } from 'react';
import hark from 'hark';
import { throttle } from '@/lib/utils';

const MyAudio = () => {
  const { getTrack } = useMedia();
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);
  const peerMe = usePeerMe();
  const micOn = useMicOn();
  const speechEventsRef = useRef<hark.Harker>(null);
  const speakingActions = useSpeakingActions();

  // Throttle speaking updates to max 10 per second
  const updateSpeaking = useMemo(
    () =>
      throttle((speaking: boolean) => {
        if (peerMe?.id && speakingActions.setSpeaking) {
          speakingActions.setSpeaking(peerMe.id, speaking);
        }
      }, 100),
    [speakingActions, peerMe?.id]
  );

  // mic
  useEffect(() => {
    if (!micOn || !audioRef.current || !peerMe?.id) {
      if (speechEventsRef.current) {
        speechEventsRef.current.stop();
      }
      return;
    }
    const track = getTrack('mic');
    if (!track) return;
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
  }, [micOn, getTrack, peerMe?.id, updateSpeaking]);

  // screen audio
  useEffect(() => {
    if (!screenAudioRef.current) return;
    const track = getTrack('screenAudio');
    if (!track) return;
    const stream = new MediaStream([track]);
    screenAudioRef.current.srcObject = stream;
  }, [getTrack]);

  return (
    <>
      <audio ref={screenAudioRef} autoPlay muted />
      <audio ref={audioRef} autoPlay muted />
    </>
  );
};

export default MyAudio;
