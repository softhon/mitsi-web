import React, { useEffect, useRef } from 'react';
import { Hand, Mic, MicOff } from 'lucide-react';
import type { Layout } from '@/types';
import { cn, getInitials } from '@/lib/utils';
import {
  usePeerConditionsById,
  usePeerMediasById,
  usePeerOthersById,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';

interface PeerTileProps {
  peerId: string;
  layout: Layout;
}
export const PeerTile: React.FC<PeerTileProps> = ({ peerId, layout }) => {
  const { getConsumer } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerData = usePeerOthersById(peerId);
  const media = usePeerMediasById(peerId);
  const peerCondition = usePeerConditionsById(peerId);

  useEffect(() => {
    if (!media?.camera || !videoRef.current) return;
    const consumer = getConsumer(peerData.id, 'camera');
    if (!consumer) return;
    const { track } = consumer;

    const stream = new MediaStream([track]);

    videoRef.current.srcObject = stream;
  }, [media?.camera, getConsumer, peerData?.id]);

  if (!peerData) return null;

  // const openFullscreen = () => {
  //   videoRef.current?.requestFullscreen().catch(error => console.log(error));
  // };

  return (
    <div
      className={cn(
        `bg-linear-to-br from-white/5 to-white/2 border  border-white/10 backdrop-blur-xl 
        rounded-lg overflow-hidden flex items-center relative transition-all duration-300 ease-in-out`,
        peerCondition?.isSpeaking && ' border-blue-500'
      )}
      style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
    >
      {/* Video/Avatar Area */}
      {media?.camera ? (
        <video
          ref={videoRef}
          className={cn(
            'h-full w-full',
            !peerData?.isMobileDevice && ' object-cover'
          )}
          autoPlay
          muted
          playsInline
          webkit-playsinline="true"
        />
      ) : (
        <div className="w-24 h-24 bg-linear-to-br from-white/15 to-white/1 rounded-full flex items-center justify-center shadow-lg mx-auto">
          {getInitials(peerData.name)}
        </div>
      )}

      {/* Mic Status */}
      <div
        className={cn(
          'absolute top-2 right-2 z-10 p-1.5 rounded-full ',
          media?.mic
            ? 'bg-green-500/20 backdrop-blur-sm'
            : 'bg-red-500/20 backdrop-blur-sm'
        )}
      >
        {media?.mic ? (
          <Mic className="w-4 h-4 text-green-400" />
        ) : (
          <MicOff className="w-4 h-4 text-red-400" />
        )}
      </div>

      {/* Name Bar */}
      <div className="absolute flex gap-x-2 items-center bottom-0 z-10 px-3 py-2 text-white text-sm font-medium ">
        {peerCondition.hand?.raised && <Hand size={18} />}
        <span className="truncate"> {peerData.name}</span>
      </div>
    </div>
  );
};
