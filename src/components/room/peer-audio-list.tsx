import { usePeerOthersKeys } from '@/store/conf/hooks';
import PeerAudio from './peer-audio';

const PeerAudioList = () => {
  const peerIds = usePeerOthersKeys();
  return (
    <>
      {peerIds.map(id => (
        <PeerAudio key={id} peerId={id} />
      ))}
    </>
  );
};

export default PeerAudioList;
