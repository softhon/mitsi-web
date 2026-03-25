import React, { useEffect, useRef, memo } from 'react';
import { Mic, MicOff, Hand } from 'lucide-react';
import type { Layout } from '@/types';
import { cn, getInitials } from '@/lib/utils';
import {
  usePeerConditionsById,
  usePeerMediasById,
  usePeerOthersById,
  useIsSpeaking,
} from '@/store/conf/hooks';
import { useMedia } from '@/hooks/use-media';

interface CanvasPeerTileProps {
  peerId: string;
  layout: Layout;
  fps?: number; // Frames per second (default: 10)
}

/**
 * Canvas-based peer tile that renders video at lower FPS to reduce CPU usage
 * Useful for off-screen or non-priority participants
 */
export const CanvasPeerTile: React.FC<CanvasPeerTileProps> = ({
  peerId,
  layout,
  fps = 10,
}) => {
  const { getConsumer } = useMedia();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const intervalRef = useRef<number | null>(null);

  const peerData = usePeerOthersById(peerId);
  const media = usePeerMediasById(peerId);
  const peerCondition = usePeerConditionsById(peerId);
  const isSpeaking = useIsSpeaking(peerId);

  // Set up video stream
  useEffect(() => {
    if (!media?.camera || !videoRef.current) return;

    const consumer = getConsumer(peerData.id, 'camera');
    if (!consumer) return;

    const { track } = consumer;
    const stream = new MediaStream([track]);
    videoRef.current.srcObject = stream;

    return () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [media?.camera, getConsumer, peerData?.id]);

  // Canvas rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const video = videoRef.current;

    if (!canvas || !video || !media?.camera) {
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    // Set canvas size
    canvas.width = layout.width;
    canvas.height = layout.height;

    // Render video to canvas at specified FPS
    const renderFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    };

    const frameInterval = 1000 / fps;
    intervalRef.current = window.setInterval(renderFrame, frameInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [media?.camera, layout.width, layout.height, fps]);

  if (!peerData) return null;

  return (
    <div
      className={cn(
        `bg-linear-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-xl
        rounded-lg overflow-hidden flex items-center relative transition-all duration-300 ease-in-out`,
        isSpeaking && 'border-blue-500'
      )}
      style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
    >
      {/* Hidden video element (source) */}
      <video
        ref={videoRef}
        className="hidden"
        autoPlay
        muted
        playsInline
        webkit-playsinline="true"
      />

      {/* Canvas or Avatar */}
      {media?.camera ? (
        <canvas
          ref={canvasRef}
          className="h-full w-full object-cover"
          style={{ imageRendering: 'auto' }}
        />
      ) : (
        <div className="w-24 h-24 bg-linear-to-br from-white/15 to-white/1 rounded-full flex items-center justify-center shadow-lg mx-auto">
          {getInitials(peerData.name)}
        </div>
      )}

      {/* Mic Status */}
      <div
        className={cn(
          'absolute top-2 right-2 z-10 p-1.5 rounded-full',
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
      <div className="absolute flex gap-x-2 items-center bottom-0 z-10 px-3 py-2 text-white text-sm font-medium">
        {peerCondition.hand?.raised && <Hand size={18} />}
        <span className="truncate">{peerData.name}</span>
        <span className="text-xs text-white/50 ml-1">{fps} FPS</span>
      </div>
    </div>
  );
};

// Memoize component
export const MemoizedCanvasPeerTile = memo(
  CanvasPeerTile,
  (prevProps, nextProps) => {
    return (
      prevProps.peerId === nextProps.peerId &&
      prevProps.layout.width === nextProps.layout.width &&
      prevProps.layout.height === nextProps.layout.height &&
      prevProps.fps === nextProps.fps
    );
  }
);
