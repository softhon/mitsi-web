import { useMedia } from '@/hooks/use-media';
import { cn } from '@/lib/utils';
import { usePeerMe, useScreenOn } from '@/store/conf/hooks';
import { useEffect, useRef, useState } from 'react';

const MyScreen = () => {
  const { getTrack } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerMe = usePeerMe();
  const screenOn = useScreenOn();
  const [aspectRatio, setAspectRatio] = useState(1 / 1);

  useEffect(() => {
    if (!peerMe || !screenOn || !videoRef.current) return;
    const track = getTrack('screen');
    if (!track) return;
    const ratio =
      Math.round((track.getSettings().aspectRatio || 1 / 1) * 10) / 10;
    // console.log('track- size =>', ratio, '=>', track.getSettings().aspectRatio);
    setAspectRatio(ratio);
    const stream = new MediaStream([track]);
    videoRef.current.srcObject = stream;
  }, [peerMe?.id, screenOn, peerMe, getTrack]);

  return (
    <div className="rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 ease-in-out w-full h-full">
      {/* Video/Avatar Area */}
      <div
        className={cn(
          'flex-1 relative  flex w-full h-full items-center justify-center',
          `aspect-[${aspectRatio}]`
        )}
      >
        <video
          ref={videoRef}
          className=" object-cover relative z-10"
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

export default MyScreen;
