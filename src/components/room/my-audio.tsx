import { useMedia } from '@/hooks/use-media';
import { useMicOn, usePeerActions, usePeerMe } from '@/store/conf/hooks';
import { useEffect, useRef } from 'react';
import hark from 'hark';

const MyAudio = () => {
  const { getTrack } = useMedia();
  const audioRef = useRef<HTMLAudioElement>(null);
  const screenAudioRef = useRef<HTMLAudioElement>(null);
  const peerMe = usePeerMe();
  const micOn = useMicOn();
  const speechEventsRef = useRef<hark.Harker>(null);
  const peerActions = usePeerActions();

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

    speechEventsRef.current.on('speaking', () => {
      peerActions.updateCondition(peerMe.id, { isSpeaking: true });
    });
    speechEventsRef.current.on('stopped_speaking', () => {
      peerActions.updateCondition(peerMe.id, { isSpeaking: false });
    });

    return () => {
      if (speechEventsRef.current) {
        speechEventsRef.current.stop();
      }
    };
  }, [micOn, getTrack, peerActions, peerMe?.id]);

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
