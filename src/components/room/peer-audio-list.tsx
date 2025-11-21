import { usePeerOthersKeys } from '@/store/conf/hooks';
import PeerAudio from './peer-audio';
import MyAudio from './my-audio';

const PeerAudioList = () => {
  const peerIds = usePeerOthersKeys();
  return (
    <>
      <MyAudio />
      {peerIds.map(id => (
        <PeerAudio key={id} peerId={id} />
      ))}
    </>
  );
};

export default PeerAudioList;
