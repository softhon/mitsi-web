import { useMemo } from 'react';
import { usePeerOthersKeys, useSpeakingState } from '@/store/conf/hooks';
import PeerAudio from './peer-audio';
import MyAudio from './my-audio';

const MAX_AUDIO_ELEMENTS = 20; // Maximum number of non-speaking audio elements

const PeerAudioList = () => {
  const peerIds = usePeerOthersKeys();
  const speaking = useSpeakingState();

  // Only render audio for speaking peers + 20 most recent
  const activePeerIds = useMemo(() => {
    const speakingIds = peerIds.filter(id => speaking[id]);
    const recentIds = peerIds.slice(0, MAX_AUDIO_ELEMENTS);

    // Combine and deduplicate
    return [...new Set([...speakingIds, ...recentIds])];
  }, [peerIds, speaking]);

  return (
    <>
      <MyAudio />
      {activePeerIds.map(id => (
        <PeerAudio key={id} peerId={id} />
      ))}
    </>
  );
};

export default PeerAudioList;
