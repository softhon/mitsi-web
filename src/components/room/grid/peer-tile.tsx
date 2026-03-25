import React, { useEffect, useRef, useState, memo } from 'react';
import { Hand, Mic, MicOff, Pin } from 'lucide-react';
import type { Layout } from '@/types';
import { cn, getInitials } from '@/lib/utils';
import {
  usePeerConditionsById,
  usePeerMediasById,
  usePeerOthersById,
  useIsSpeaking,
  usePeerSelectedId,
  usePeerActions,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';
import { useViewportQuality } from '@/hooks/use-viewport-quality';
import { useAudioLevel } from '@/hooks/use-audio-level';

interface PeerTileProps {
  peerId: string;
  layout: Layout;
}
export const PeerTile: React.FC<PeerTileProps> = ({ peerId, layout }) => {
  const { getConsumer, setConsumerQuality } = useMedia();
  const videoRef = useRef<HTMLVideoElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  const peerData = usePeerOthersById(peerId);
  const media = usePeerMediasById(peerId);
  const peerCondition = usePeerConditionsById(peerId);
  const isSpeaking = useIsSpeaking(peerId);
  const selectedId = usePeerSelectedId();
  const peerActions = usePeerActions();
  const isPinned = selectedId === peerId;
  const audioLevel = useAudioLevel(peerId);

  // Intersection observer for viewport visibility
  useEffect(() => {
    if (!tileRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 } // Consider visible if 10% is showing
    );

    observer.observe(tileRef.current);

    return () => observer.disconnect();
  }, []);

  // Apply quality based on viewport visibility and speaking status
  useViewportQuality({
    peerId: peerData?.id,
    source: 'camera',
    setConsumerQuality,
    isVisible,
    isActiveSpeaker: isSpeaking,
  });

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
      ref={tileRef}
      onDoubleClick={() => peerActions.setSelectedId(isPinned ? null : peerId)}
      className={cn(
        `bg-linear-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-xl
        rounded-lg overflow-hidden flex items-center relative transition-all duration-300 ease-in-out group cursor-pointer`,
        isSpeaking && 'border-blue-500',
        isPinned && 'border-yellow-400/60'
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

      {/* Pin icon — shown on hover or when pinned */}
      <div className={cn(
        'absolute top-2 left-2 z-10 p-1 rounded-md bg-black/40 transition-opacity',
        isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      )}>
        <Pin size={12} className={isPinned ? 'text-yellow-400 fill-yellow-400' : 'text-white'} />
      </div>

      {/* Name Bar */}
      <div className="absolute flex gap-x-2 items-center bottom-0 z-10 px-3 py-2 text-white text-sm font-medium ">
        {peerCondition.hand?.raised && <Hand size={18} />}
        <span className="truncate"> {peerData.name}</span>
      </div>

      {/* Audio level bar */}
      {audioLevel > 0.02 && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 z-20 bg-black/20">
          <div
            className="h-full bg-green-400 transition-all duration-75"
            style={{ width: `${Math.min(audioLevel * 100 * 3, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
};

// Memoize component with custom comparison for optimal re-render control
export const MemoizedPeerTile = memo(PeerTile, (prevProps, nextProps) => {
  return (
    prevProps.peerId === nextProps.peerId &&
    prevProps.layout.width === nextProps.layout.width &&
    prevProps.layout.height === nextProps.layout.height
  );
});
