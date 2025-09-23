import React, { useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import type { Layout, PeerData } from '@/types';
import { getInitials } from '@/lib/utils';
import { usePeerMediasById } from '@/store/conf/hooks';

interface PeerTileProps {
  peerData: PeerData;
  layout: Layout;
}
export const PeerTile: React.FC<PeerTileProps> = ({ peerData, layout }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const media = usePeerMediasById(peerData.id);

  useEffect(() => {
    if (!media?.camera || !videoRef.current) return;
  }, [media?.camera]);

  return (
    <div
      className=" bg-gray-700 rounded-lg overflow-hidden flex flex-col relative transition-all duration-300 ease-in-out"
      style={{ width: `${layout.width}px`, height: `${layout.height}px` }}
    >
      {/* Video/Avatar Area */}
      <div className="flex-1 relative bg-gray-800 flex items-center justify-center">
        {media?.camera ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover relative z-10"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{
              background: 'linear-gradient(135deg, #667fea 0%, #0d1db2 100%)',
            }}
          >
            {getInitials(peerData.name)}
          </div>
        )}

        {/* Mic Status */}
        <div className="absolute top-2 right-2 p-1 rounded-full bg-black/50">
          {media?.mic ? (
            <Mic className="w-4 h-4 text-green-400" />
          ) : (
            <MicOff className="w-4 h-4 text-red-400" />
          )}
        </div>
      </div>

      {/* Name Bar */}
      <div className="bg-gray-700 px-3 py-2 text-white text-sm font-medium truncate">
        {peerData.name}
      </div>
    </div>
  );
};
