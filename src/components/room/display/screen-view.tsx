import { cn } from '@/lib/utils';
import { usePeerMe, usePeerScreens, useScreenOn } from '@/store/conf/hooks';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useMedia } from '@/hooks/use-media';
import { Maximize2, MonitorUp } from 'lucide-react';

const ScreenView = () => {
  const { getTrack, getConsumer } = useMedia();
  const [aspectRatio, setAspectRatio] = useState(0);

  const peerScreens = usePeerScreens();
  const screenOn = useScreenOn();
  const peerMe = usePeerMe();
  const videoRef = useRef<HTMLVideoElement>(null);

  // get the screen sharing peerId
  const peerId = useMemo(
    () =>
      screenOn && peerMe
        ? peerMe.id
        : peerScreens.length
          ? peerScreens[0]
          : null,
    [peerScreens, peerMe, screenOn]
  );

  useEffect(() => {
    if (!peerId || !videoRef.current) return;
    let track;
    if (screenOn) {
      track = getTrack('screen');
    } else {
      const consumer = getConsumer(peerId, 'screen');
      track = consumer?.track;
    }

    if (!track) return;

    const ratio =
      Math.round((track.getSettings().aspectRatio || 1 / 1) * 10) / 10;
    setAspectRatio(ratio);
    const stream = new MediaStream([track]);
    videoRef.current.srcObject = stream;
  }, [peerId, getConsumer, getTrack, screenOn]);

  if (!peerId) return null;
  return (
    <div
      className={cn(
        'relative  bg-linear-to-br from-white/5 to-white/2  rounded-2xl h-1/2 lg:h-full w-full lg:w-5/6 overflow-hidden'
      )}
    >
      <div className=" cursor-pointer absolute h-fit bg-black/30 hover:bg-black/50 right-2 top-2 rounded-md p-2 ">
        <Maximize2 size={16} />
      </div>
      <div
        className={cn(
          'flex-1   flex w-full h-full items-center justify-center',
          `aspect-[${aspectRatio}]`
        )}
      >
        <video
          ref={videoRef}
          className=" object-cover "
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
        />

        {/* Mic Status */}
      </div>

      <div className="bg-black/30 absolute  flex flex-row items-center gap-2 z-20 w-fit -mt-8 ml-2 rounded-md px-2 py-1 text-sm">
        <MonitorUp size={16} /> <span> {`${peerMe?.name} is presenting`}</span>
      </div>
    </div>
  );
};

export default ScreenView;
