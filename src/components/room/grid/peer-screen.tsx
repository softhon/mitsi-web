import { useMedia } from '@/hooks/use-media';
import { usePeerScreens } from '@/store/conf/hooks';
import { useEffect, useMemo, useRef } from 'react';

const PeerScreen = () => {
  const { getConsumer } = useMedia();
  const peerScreen = usePeerScreens();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerId = useMemo(
    () => (peerScreen.length ? peerScreen[0] : null),
    [peerScreen]
  );

  useEffect(() => {
    if (!peerId || !videoRef.current) return;
    const consumer = getConsumer(peerId, 'screen');
    if (!consumer) return;

    const { track } = consumer;
    console.log('track- size =>', track.getSettings().aspectRatio);
    const stream = new MediaStream([track]);
    videoRef.current.srcObject = stream;
  }, [peerId, getConsumer]);

  return (
    <div className=" bg-gray-700 rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 ease-in-out">
      {/* Video/Avatar Area */}
      <div className="flex-1 relative bg-gray-800 flex items-center justify-center rounded-lg">
        <video
          ref={videoRef}
          className="w-full h-full object-cover relative z-10"
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
        />

        {/* Mic Status */}
      </div>
    </div>
  );
};

export default PeerScreen;
