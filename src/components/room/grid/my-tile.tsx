import React, { useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { Layout } from '@/types';
import { cn, getInitials } from '@/lib/utils';
import {
  useCameraDeviceId,
  useCameraOn,
  useMicOn,
  usePeerMe,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PeerTileProps {
  layout: Layout;
}
const MyTile: React.FC<PeerTileProps> = ({ layout }) => {
  const { getTrack } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const micOn = useMicOn();
  const cameraOn = useCameraOn();
  const cameraDeviceId = useCameraDeviceId();
  const peerMe = usePeerMe();

  useEffect(() => {
    if (!cameraOn || !videoRef.current) return;
    const track = getTrack('camera');
    if (!track) return;
    console.log({ track });
    videoRef.current.srcObject = new MediaStream([track]);
  }, [cameraOn, cameraDeviceId, getTrack]);

  if (!peerMe) return null;
  return (
    <div
      className=" bg-linear-to-br from-white/5 to-white/2 border  border-white/10 backdrop-blur-xl rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 ease-in-out"
      style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
    >
      {/* Video/Avatar Area */}
      <div className="flex-1 relative  flex items-center justify-center">
        {cameraOn ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover relative z-10"
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
          />
        ) : (
          <Avatar className=" w-24 h-24">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback className="text-white text-xl bg-gradient-to-bl from-white/15 to-white/1  backdrop-blur-x">
              {getInitials(peerMe.name)}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Mic Status */}
        <div
          className={cn(
            'absolute top-2 right-2 z-10 p-1.5 rounded-full ',
            micOn
              ? 'bg-green-500/20 backdrop-blur-sm'
              : 'bg-red-500/20 backdrop-blur-sm'
          )}
        >
          {micOn ? (
            <Mic className="w-4 h-4 text-green-400" />
          ) : (
            <MicOff className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Name Bar */}
      <div className="absolute bottom-0 z-10 px-3 py-2 text-white text-sm font-medium truncate">
        {peerMe.name}
      </div>
    </div>
  );
};

export default MyTile;
