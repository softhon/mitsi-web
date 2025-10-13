import React, { useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { Layout } from '@/types';
import { getInitials } from '@/lib/utils';
import { usePeerMediasById, usePeerOthersById } from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface PeerTileProps {
  peerId: string;
  layout: Layout;
}
export const PeerTile: React.FC<PeerTileProps> = ({ peerId, layout }) => {
  const { getConsumer } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerData = usePeerOthersById(peerId);
  const media = usePeerMediasById(peerId);

  useEffect(() => {
    if (!media?.camera || !videoRef.current) return;
    const consumer = getConsumer(peerData.id, 'camera');
    if (!consumer) return;
    const { track } = consumer;

    const stream = new MediaStream([track]);

    videoRef.current.srcObject = stream;
  }, [media?.camera, getConsumer, peerData?.id]);

  if (!peerData) return null;

  return (
    <div
      className=" bg-gradient-to-br from-white/5 to-white/2 border  border-white/10 backdrop-blur-xl rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 ease-in-out"
      style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
    >
      {/* Video/Avatar Area */}
      <div className="flex-1 relative flex items-center justify-center">
        {media?.camera ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover relative z-10"
            autoPlay
            muted
            playsInline
            webkit-playsinline="true"
          />
        ) : (
          <Avatar className=" w-24 h-24 ">
            {/* <AvatarImage src="https://github.com/shadcn.png" /> */}
            <AvatarFallback className="text-white text-xl bg-gradient-to-bl from-white/15 to-white/1  backdrop-blur-x ">
              {getInitials(peerData.name)}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Mic Status */}
        <div className="absolute top-2 right-2 z-10 p-1 rounded-full bg-black/50">
          {media?.mic ? (
            <Mic className="w-4 h-4 text-green-400" />
          ) : (
            <MicOff className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Name Bar */}
      <div className="absolute bottom-0 z-10 px-3 py-2 text-white text-sm font-medium truncate">
        {peerData.name}
      </div>
    </div>
  );
};
